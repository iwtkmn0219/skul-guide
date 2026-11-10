"""사용자가 관리하는 엑셀(Skul_아이템_각인_DB형.xlsx)을 검증해 public/js/items.js를 만든다.

개발용 도구다(배포되지 않음). 표준 라이브러리만 쓴다. 변환에 실패하면 --out 파일을 건드리지 않는다.

    python -X utf8 tools/convert_items.py data/Skul_아이템_각인_DB형.xlsx --retrieved 2026-11-10 --out public/js/items.js
"""

import argparse
import io
import json
import os
import posixpath
import re
import sys
import tempfile
import zipfile
import xml.etree.ElementTree as ET
from urllib.parse import quote

COMMAND = ('python -X utf8 tools/convert_items.py data/Skul_아이템_각인_DB형.xlsx '
           '--retrieved <YYYY-MM-DD> --out public/js/items.js  (npm run build:items)')
SOURCE_FILE = 'data/Skul_아이템_각인_DB형.xlsx'
BASE_TITLE = 'Skul: The Hero Slayer/아이템과 각인'
SOURCE_TITLES = [BASE_TITLE] + [f'{BASE_TITLE}/{sub}' for sub in
                                ('레어 아이템', '유니크 아이템', '레전더리 아이템', '흉조 아이템', 'DLC 아이템')]
LICENSE = 'CC BY-NC-SA 2.0 KR'
LICENSE_URL = 'https://creativecommons.org/licenses/by-nc-sa/2.0/kr/'

GRADES = [('common', '일반'), ('rare', '레어'), ('unique', '유니크'), ('legendary', '레전더리'), ('omen', '흉조')]
GRADE_ID = {label: gid for gid, label in GRADES}
CATEGORIES = ['능력치 각인', '상태이상 각인', '특수능력 각인(공격)', '특수능력 각인(방어)']
KINDS = ('기본', '개조')
BOOLS = {'TRUE': True, '1': True, 'FALSE': False, '0': False}

ITEM_SHEET = '아이템 목록'
ITEM_COLUMNS = ['아이템 이름', '등급', '각인 1', '각인 2', '설명', 'DLC']
ENGRAVING_SHEET = '각인 정보'
ENGRAVING_COLUMNS = ['각인명', '분류', '효과유형', '필요개수', '개조가능', '효과', '비고']

RANDOM_RE = re.compile(r'^랜덤[A-Z]?$')
VARIANT_RE = re.compile(r'^\[(.+)의 강화·변환형 / 등급은 원본 문서 분류 기준\]$')
CELL_REF_RE = re.compile(r'^([A-Z]+)(\d+)$')


class ConvertError(Exception):
    def __init__(self, messages):
        super().__init__('\n'.join(messages))
        self.messages = list(messages)


# ---------------------------------------------------------------- xlsx 읽기

def _local(tag):
    return tag.rsplit('}', 1)[-1]


def _children(el, name):
    return [c for c in el if _local(c.tag) == name]


def _text_runs(el):
    """<si>/<is> 안의 텍스트: 직접 <t> 또는 리치 텍스트 <r><t>를 이어 붙인다. 발음 표기(<rPh>)는 뺀다."""
    parts = []
    for child in el:
        name = _local(child.tag)
        if name == 't':
            parts.append(child.text or '')
        elif name == 'r':
            parts.extend(t.text or '' for t in _children(child, 't'))
    return ''.join(parts)


def _col_index(letters):
    n = 0
    for ch in letters:
        n = n * 26 + ord(ch) - 64
    return n - 1


def _sheet_paths(z):
    workbook = ET.fromstring(z.read('xl/workbook.xml'))
    rels = ET.fromstring(z.read('xl/_rels/workbook.xml.rels'))
    targets = {r.get('Id'): r.get('Target') for r in rels if _local(r.tag) == 'Relationship'}
    paths = {}
    for el in workbook.iter():
        if _local(el.tag) != 'sheet':
            continue
        rid = next(v for k, v in el.attrib.items() if _local(k) == 'id')
        target = targets[rid]
        path = target.lstrip('/') if target.startswith('/') else posixpath.normpath(posixpath.join('xl', target))
        paths[el.get('name')] = path
    return paths


def read_xlsx(source):
    """시트 이름 → 행 목록. 행 i는 엑셀 i+1행이고, 셀은 열 문자 위치에 놓으며 빈 칸은 ''이다."""
    with zipfile.ZipFile(io.BytesIO(source) if isinstance(source, bytes) else source) as z:
        names = set(z.namelist())
        shared = []
        if 'xl/sharedStrings.xml' in names:
            shared = [_text_runs(si) for si in ET.fromstring(z.read('xl/sharedStrings.xml')) if _local(si.tag) == 'si']
        result = {}
        for sheet_name, path in _sheet_paths(z).items():
            rows = {}
            for row_el in ET.fromstring(z.read(path)).iter():
                if _local(row_el.tag) != 'row':
                    continue
                row_no = int(row_el.get('r') or (max(rows, default=0) + 1))
                cells = {}
                for c in _children(row_el, 'c'):
                    m = CELL_REF_RE.match(c.get('r') or '')
                    col = _col_index(m.group(1)) if m else len(cells)
                    cells[col] = _cell_value(c, shared)
                rows[row_no] = [cells.get(i, '') for i in range(max(cells, default=-1) + 1)]
            result[sheet_name] = [rows.get(n, []) for n in range(1, max(rows, default=0) + 1)]
        return result


def _cell_value(c, shared):
    kind = c.get('t')
    v = next(iter(_children(c, 'v')), None)
    text = v.text or '' if v is not None else ''
    if kind == 's':
        value = shared[int(text)] if text else ''
    elif kind == 'inlineStr':
        value = ''.join(_text_runs(is_el) for is_el in _children(c, 'is'))
    elif kind == 'b':
        value = 'TRUE' if text.strip() == '1' else 'FALSE'
    else:  # 숫자, t="str"(수식 결과), 오류값
        value = text
    return value.replace('\r\n', '\n').replace('\r', '\n')


# ---------------------------------------------------------------- 검증과 변환

def _lines(value):
    return [line.strip() for line in value.split('\n') if line.strip()]


def _table(sheets, sheet_name, columns, errors):
    """헤더 행(첫 열 이름이 처음 나오는 행)을 찾아 (행 번호, {열 이름: 값}) 목록을 돌려준다."""
    rows = sheets.get(sheet_name)
    if rows is None:
        errors.append(f'{sheet_name} 시트가 없습니다.')
        return []
    header_at = next((i for i, row in enumerate(rows) if columns[0] in (c.strip() for c in row)), None)
    if header_at is None:
        errors.append(f'{sheet_name}: 헤더 행(`{columns[0]}`)을 찾을 수 없습니다.')
        return []
    header = [c.strip() for c in rows[header_at]]
    missing = [c for c in columns if c not in header]
    if missing:
        errors.append(f'{sheet_name} {header_at + 1}행: 열이 없습니다: {", ".join(missing)}')
        return []
    index = {c: header.index(c) for c in columns}
    records = []
    for i in range(header_at + 1, len(rows)):
        row = rows[i]
        record = {c: (row[j] if j < len(row) else '') for c, j in index.items()}
        if all(not v.strip() for v in record.values()):
            continue
        records.append((i + 1, record))
    return records


def _positive_int(value):
    try:
        number = float(value)
    except ValueError:
        return None
    return int(number) if number.is_integer() and number > 0 else None


def _build_engravings(records, errors):
    engravings = {}
    for row_no, r in records:
        where = f'{ENGRAVING_SHEET} {row_no}행'
        name, category, kind = r['각인명'].strip(), r['분류'].strip(), r['효과유형'].strip()
        if not name:
            errors.append(f'{where}: 각인명이 비어 있습니다.')
            continue
        if category not in CATEGORIES:
            errors.append(f'{where}: 알 수 없는 분류 `{category}`')
        if kind not in KINDS:
            errors.append(f'{where}: 효과유형은 기본 또는 개조여야 합니다: `{kind}`')
        count = _positive_int(r['필요개수'].strip())
        if count is None:
            errors.append(f'{where}: 필요개수는 양의 정수여야 합니다: `{r["필요개수"].strip()}`')
        moddable = BOOLS.get(r['개조가능'].strip().upper())
        if moddable is None:
            errors.append(f'{where}: 개조가능은 TRUE/FALSE여야 합니다: `{r["개조가능"].strip()}`')
        note = r['비고'].strip() or None
        tier = {'kind': kind, 'count': count, 'effect': _lines(r['효과']), 'note': note}
        eng = engravings.get(name)
        if eng is None:
            eng = engravings[name] = {'name': name, 'category': category, 'moddable': moddable, 'tiers': []}
        else:
            if category != eng['category']:
                errors.append(f'{where}: 각인 `{name}`의 분류가 앞 행과 다릅니다: `{category}` ≠ `{eng["category"]}`')
            if moddable is not None and eng['moddable'] is not None and moddable != eng['moddable']:
                errors.append(f'{where}: 각인 `{name}`의 개조가능 값이 앞 행과 다릅니다.')
        if kind == '개조' and (moddable is False or eng['moddable'] is False):
            errors.append(f'{where}: 각인 `{name}`은 개조가능이 FALSE인데 개조 효과가 있습니다.')
        eng['tiers'].append(tier)
    return list(engravings.values())


def _build_items(records, engraving_names, errors):
    items, seen, pending_variants = [], set(), []
    for row_no, r in records:
        where = f'{ITEM_SHEET} {row_no}행'
        name, grade_label = r['아이템 이름'].strip(), r['등급'].strip()
        description = _lines(r['설명'])
        problems = []
        if not name:
            problems.append('아이템 이름이 비어 있습니다.')
        elif name in seen:
            problems.append(f'아이템 이름이 중복됩니다: `{name}`')
        if not grade_label:
            problems.append('등급이 비어 있습니다.')
        elif grade_label not in GRADE_ID:
            problems.append(f'알 수 없는 등급 `{grade_label}`')
        if not description:
            problems.append('설명이 비어 있습니다.')
        engravings = [v.strip() for v in (r['각인 1'], r['각인 2']) if v.strip()]
        for e in engravings:
            if e not in engraving_names and not RANDOM_RE.match(e):
                problems.append(f'알 수 없는 각인 `{e}`')
        dlc_value = r['DLC'].strip()
        if dlc_value not in ('DLC', ''):
            problems.append(f'DLC 칸은 DLC 또는 빈 칸이어야 합니다: `{dlc_value}`')
        variant_of = None
        if description and (m := VARIANT_RE.match(description[0])):
            variant_of = m.group(1)
            description = description[1:]
            pending_variants.append((where, variant_of))
        errors.extend(f'{where}: {p}' for p in problems)
        if name:
            seen.add(name)
        items.append({'name': name, 'grade': GRADE_ID.get(grade_label), 'engravings': engravings,
                      'description': description, 'variantOf': variant_of, 'dlc': dlc_value == 'DLC'})
    for where, target in pending_variants:
        if target not in seen:
            errors.append(f'{where}: 강화·변환형 원본 아이템 `{target}`이 목록에 없습니다.')
    return items


def build(sheets):
    errors = []
    engraving_records = _table(sheets, ENGRAVING_SHEET, ENGRAVING_COLUMNS, errors)
    item_records = _table(sheets, ITEM_SHEET, ITEM_COLUMNS, errors)
    engravings = _build_engravings(engraving_records, errors)
    items = _build_items(item_records, {e['name'] for e in engravings}, errors)
    if errors:
        raise ConvertError(errors)
    return {'items': items, 'engravings': engravings}


# ---------------------------------------------------------------- 출력

def _js_str(s):
    return "'" + s.replace('\\', '\\\\').replace("'", "\\'") + "'"


def source_url(title):
    return 'https://namu.wiki/w/' + quote(title, safe=':/')


def to_module(data, retrieved):
    sources = ',\n'.join(f'    {{ title: {_js_str(t)}, url: {_js_str(source_url(t))} }}' for t in SOURCE_TITLES)
    header = '\n'.join([
        '// 자동 생성 파일: 손으로 고치지 말 것. 엑셀을 고친 뒤 변환기를 다시 실행한다.',
        f'// 생성: {COMMAND}',
        f'// 원본: {SOURCE_FILE}',
        '// 출처: 나무위키 기여자, 다음 문서 6개',
        *[f'//   - 「{t}」 {source_url(t)}' for t in SOURCE_TITLES],
        f'// 라이선스: {LICENSE} ({LICENSE_URL}) · {retrieved} 기준. 이 파일의 내용은 위 라이선스를 따른다.',
    ])
    grades = ',\n'.join(f'  {{ id: {_js_str(gid)}, label: {_js_str(label)} }}' for gid, label in GRADES)
    dump = lambda v: json.dumps(v, ensure_ascii=False, indent=1)
    return (
        f'{header}\n\n'
        f'export const ITEMS_META = {{\n  sources: [\n{sources},\n  ],\n'
        f'  license: {_js_str(LICENSE)},\n  licenseUrl: {_js_str(LICENSE_URL)},\n  retrieved: {_js_str(retrieved)},\n}};\n\n'
        f'export const ITEM_GRADES = [\n{grades},\n];\n\n'
        f'export const ENGRAVING_CATEGORIES = {dump(CATEGORIES)};\n\n'
        f'export const ITEMS = {dump(data["items"])};\n\n'
        f'export const ENGRAVINGS = {dump(data["engravings"])};\n'
    )


def main(argv):
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument('xlsx', help='엑셀 원본 경로')
    ap.add_argument('--retrieved', required=True, help='정리 기준일(YYYY-MM-DD)')
    ap.add_argument('--out', required=True, help='출력할 items.js 경로(성공했을 때만 쓴다)')
    args = ap.parse_args(argv)
    try:
        data = build(read_xlsx(args.xlsx))
    except ConvertError as e:
        for message in e.messages:
            print(message, file=sys.stderr)
        return 1
    module = to_module(data, args.retrieved)
    out_dir = os.path.dirname(os.path.abspath(args.out))
    fd, tmp = tempfile.mkstemp(dir=out_dir, suffix='.tmp')
    try:
        with os.fdopen(fd, 'w', encoding='utf-8', newline='\n') as f:
            f.write(module)
        os.replace(tmp, args.out)
    except BaseException:
        os.unlink(tmp)
        raise
    print(f'items {len(data["items"])}, engravings {len(data["engravings"])}')
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
