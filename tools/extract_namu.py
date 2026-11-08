"""저장해 둔 나무위키 「Skul: The Hero Slayer/스컬」 HTML에서 스컬별 스킬 표를 뽑아 public/js/skills.js를 만든다.

개발용 도구다(배포되지 않음). 표준 라이브러리만 쓰고, 네트워크에 접속하지 않는다.

    python -X utf8 tools/extract_namu.py sources/namu-skul.html --retrieved 2026-11-08 > public/js/skills.js
"""

import argparse
import json
import re
import sys
from html.parser import HTMLParser

URL = 'https://namu.wiki/w/Skul:%20The%20Hero%20Slayer/%EC%8A%A4%EC%BB%AC'
TITLE = 'Skul: The Hero Slayer/스컬'
LICENSE = 'CC BY-NC-SA 2.0 KR'
LICENSE_URL = 'https://creativecommons.org/licenses/by-nc-sa/2.0/kr/'
COMMAND = 'python -X utf8 tools/extract_namu.py sources/namu-skul.html --retrieved <YYYY-MM-DD> > public/js/skills.js'

SKULL_CHAPTERS = {3, 4, 5, 6}  # 일반, 레어, 유니크, 레전더리
HEADING_RE = re.compile(r'^(\d+(?:\.\d+)*)\.\s*(.+)$')
STAGE_RE = re.compile(r'^(노말|레어|유니크|레전더리) : (.+)$')
PAIR_RE = re.compile(r'^(.+) : (.+)$')
FOOTNOTE_RE = re.compile(r'\[\d+\]')
STOP_ROWS = {'타입', '장점', '단점'}


def clean_lines(raw):
    """<br> 경계(\n)로 나누고, 공백을 접고, 각주 표식을 지운다. 빈 줄은 버린다."""
    lines = (FOOTNOTE_RE.sub('', re.sub(r'\s+', ' ', part)).strip() for part in raw.split('\n'))
    return [line for line in lines if line]


class _TableReader(HTMLParser):
    """제목(h2~h5)과 표 행을 문서 순서대로 events에 모은다."""

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.events = []
        self._heading = None
        self._rows = []   # 중첩 표에 대비한 행 스택
        self._cells = []  # 셀 스택: [text, rowspan]

    def handle_starttag(self, tag, attrs):
        if tag in ('h2', 'h3', 'h4', 'h5'):
            self._heading = ''
        elif tag == 'tr':
            self._rows.append([])
        elif tag in ('td', 'th') and self._rows:
            rowspan = dict(attrs).get('rowspan') or '1'
            self._cells.append(['', int(rowspan) if rowspan.isdigit() else 1])
        elif tag == 'br' and self._cells:
            self._cells[-1][0] += '\n'

    def handle_endtag(self, tag):
        if tag in ('h2', 'h3', 'h4', 'h5') and self._heading is not None:
            self.events.append(('heading', self._heading.strip()))
            self._heading = None
        elif tag in ('td', 'th') and self._cells and self._rows:
            text, rowspan = self._cells.pop()
            self._rows[-1].append({'lines': clean_lines(text), 'rowspan': rowspan})
        elif tag == 'tr' and self._rows:
            self.events.append(('row', self._rows.pop()))

    def handle_data(self, data):
        if self._heading is not None:
            self._heading += data
        if self._cells:
            self._cells[-1][0] += data


def _heading_info(text):
    """(장 번호, 깊이, 스컬 이름) 또는 None."""
    text = text.replace('[편집]', '').strip()
    m = HEADING_RE.match(text)
    if not m:
        return None
    numbers = m.group(1).split('.')
    name = re.sub(r'\s*[★◆]$', '', m.group(2).strip())
    return int(numbers[0]), len(numbers), name


def _text(cell):
    return ' '.join(cell['lines'])


class _Section:
    def __init__(self):
        self.stage_names = []  # [(label, form)]
        self.last_pair = None  # 직전 단일 셀 "X : Y" 행의 Y
        self.headers_seen = 0
        self.stages = []
        self.stage = None
        self.last_skill = None
        self.variants_left = 0
        self.skill_rows_left = 0  # `스킬` 라벨 칸의 rowspan이 덮는 남은 행 수

    def _open_stage(self, cooldown_label):
        i = self.headers_seen
        self.headers_seen += 1
        if i < len(self.stage_names):
            label, form = self.stage_names[i]
            kind = 'stage'
        elif not self.stage_names:
            label, form, kind = '기본', None, 'stage'
        else:
            label, form, kind = self.last_pair, None, 'form'
        self.stage = {'label': label, 'form': form, 'kind': kind, 'cooldownLabel': cooldown_label,
                      'passive': [], 'swap': None, 'skills': []}
        self.stages.append(self.stage)
        self.last_skill = None
        self.variants_left = 0
        self.skill_rows_left = 0

    def _add_skill(self, name_cell, cooldown_cell, effect_cell):
        skill = {'name': _text(name_cell), 'cooldown': _text(cooldown_cell),
                 'effect': effect_cell['lines'], 'variants': []}
        self.stage['skills'].append(skill)
        self.last_skill = skill
        self.variants_left = name_cell['rowspan'] - 1

    def feed_row(self, cells):
        texts = [_text(c) for c in cells]
        if cells and all(STAGE_RE.match(t) for t in texts):
            self.stage_names = [STAGE_RE.match(t).groups() for t in texts]
            return
        if len(cells) == 1 and PAIR_RE.match(texts[0]):
            self.last_pair = PAIR_RE.match(texts[0]).group(2)
        if len(texts) == 3 and texts[0] == '스킬' and texts[2] == '효과':  # 가운데 칸: 쿨타임, 챔피언은 필요 기력
            self._open_stage(texts[1])
            return
        if self.stage is None:
            return
        if texts and texts[0] in STOP_ROWS:  # rowspan이 실제보다 큰 표(좀도둑 등)에서도 여기서 끝낸다
            self.stage = None
            return
        in_skill_block = self.skill_rows_left > 0
        self.skill_rows_left = max(self.skill_rows_left - 1, 0)
        if in_skill_block and self.variants_left > 0 and len(cells) in (1, 2):
            cooldown = texts[0] if len(cells) == 2 else self.last_skill['cooldown']
            self.last_skill['variants'].append({'cooldown': cooldown, 'effect': cells[-1]['lines']})
            self.variants_left -= 1
        elif texts and texts[0] == '패시브':
            self.stage['passive'] = [line for line in cells[-1]['lines'] if line != '-']
        elif texts and texts[0] == '교대':
            self.stage['swap'] = {'name': texts[1], 'effect': cells[-1]['lines']}
        elif texts and texts[0] == '스킬' and len(cells) == 4:
            self._add_skill(*cells[1:])
            self.skill_rows_left = cells[0]['rowspan'] - 1
        elif in_skill_block and len(cells) == 3:
            self._add_skill(*cells)
        else:
            self.stage = None  # 타입·장점 등 표 밖의 행

    def result(self):
        return {'stages': [s for s in self.stages if s['skills']]}


def parse(html):
    reader = _TableReader()
    reader.feed(html)
    reader.close()
    sections = {}
    current = None
    for kind, value in reader.events:
        if kind == 'heading':
            info = _heading_info(value)
            if info is None:
                continue
            chapter, depth, name = info
            if chapter in SKULL_CHAPTERS and depth == 2:
                current = sections.setdefault(name, _Section())
            else:
                current = None  # 장 제목, 3.1.1 같은 하위 섹션, 7장 이후
        elif current is not None:
            current.feed_row(value)
    return {name: section.result() for name, section in sections.items()}


def to_module(data, retrieved):
    meta = {'url': URL, 'title': TITLE, 'license': LICENSE, 'licenseUrl': LICENSE_URL, 'retrieved': retrieved}
    meta_js = ',\n'.join(f'  {k}: {json.dumps(v, ensure_ascii=False)}'.replace('"', "'") for k, v in meta.items())
    return (
        '// 자동 생성 파일: 손으로 고치지 말 것.\n'
        f'// 출처: 나무위키 「{TITLE}」 {URL}\n'
        f'// 작성: 나무위키 기여자 · 라이선스: {LICENSE} ({LICENSE_URL}) · {retrieved} 기준\n'
        '// 이 파일의 내용은 위 라이선스(CC BY-NC-SA 2.0 KR)를 따른다.\n'
        f'// 생성: {COMMAND}\n\n'
        f'export const NAMU = {{\n{meta_js},\n}};\n\n'
        f'export const SKILL_INFO = {json.dumps(data, ensure_ascii=False, indent=1)};\n'
    )


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument('html', help='저장해 둔 나무위키 HTML 경로')
    ap.add_argument('--retrieved', required=True, help='원본 저장일(YYYY-MM-DD)')
    args = ap.parse_args(argv)
    with open(args.html, encoding='utf-8') as f:
        data = parse(f.read())
    sys.stdout.write(to_module(data, args.retrieved))


if __name__ == '__main__':
    main()
