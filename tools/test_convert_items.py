import io
import os
import tempfile
import unittest
import zipfile
from xml.sax.saxutils import escape

from convert_items import ConvertError, build, main, read_xlsx, to_module

MAIN_NS = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'
REL_NS = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'


def _col(i):
    s = ''
    i += 1
    while i:
        i, r = divmod(i - 1, 26)
        s = chr(65 + r) + s
    return s


def make_xlsx(sheets, style='shared'):
    """sheets: {시트 이름: 행 목록}. 셀 값은 str, bool, int 또는 리치 텍스트 조각 list[str]이다.
    style 'shared'는 공유 문자열, 'inline'은 인라인 문자열로 쓴다. 시트 XML은 `x:` 접두사 네임스페이스를 쓴다."""
    shared = []

    def text_xml(value, tag):
        if isinstance(value, list):
            runs = ''.join(f'<x:r><x:t xml:space="preserve">{escape(part)}</x:t></x:r>' for part in value)
            return f'<x:{tag}>{runs}</x:{tag}>'
        return f'<x:{tag}><x:t xml:space="preserve">{escape(value)}</x:t></x:{tag}>'

    def cell(ref, value):
        if value == '' or value is None:
            return ''
        if isinstance(value, bool):
            return f'<x:c r="{ref}" t="b"><x:v>{int(value)}</x:v></x:c>'
        if isinstance(value, (int, float)):
            return f'<x:c r="{ref}"><x:v>{value}</x:v></x:c>'
        if style == 'shared':
            shared.append(value)
            return f'<x:c r="{ref}" t="s"><x:v>{len(shared) - 1}</x:v></x:c>'
        return f'<x:c r="{ref}" t="inlineStr">{text_xml(value, "is")}</x:c>'

    buf = io.BytesIO()
    with zipfile.ZipFile(buf, 'w') as z:
        sheet_entries, rels = [], []
        for n, (name, rows) in enumerate(sheets.items(), start=1):
            row_xml = ''.join(
                f'<x:row r="{r}">' + ''.join(cell(f'{_col(c)}{r}', v) for c, v in enumerate(row)) + '</x:row>'
                for r, row in enumerate(rows, start=1))
            z.writestr(f'xl/worksheets/sheet{n}.xml',
                       f'<x:worksheet xmlns:x="{MAIN_NS}"><x:sheetData>{row_xml}</x:sheetData></x:worksheet>')
            sheet_entries.append(f'<x:sheet name="{escape(name)}" sheetId="{n}" r:id="rId{n}"/>')
            rels.append(f'<Relationship Id="rId{n}" Type="{REL_NS}/worksheet" Target="worksheets/sheet{n}.xml"/>')
        z.writestr('[Content_Types].xml', '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"/>')
        z.writestr('xl/workbook.xml',
                   f'<x:workbook xmlns:x="{MAIN_NS}" xmlns:r="{REL_NS}"><x:sheets>{"".join(sheet_entries)}</x:sheets></x:workbook>')
        z.writestr('xl/_rels/workbook.xml.rels',
                   '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
                   + ''.join(rels) + '</Relationships>')
        if style == 'shared':
            sis = ''.join(f'<x:si>{text_xml(v, "si")[len("<x:si>"):-len("</x:si>")]}</x:si>' for v in shared)
            z.writestr('xl/sharedStrings.xml', f'<x:sst xmlns:x="{MAIN_NS}">{sis}</x:sst>')
    return buf.getvalue()


ITEM_HEADER = ['아이템 이름', '등급', '각인 1', '각인 2', '설명', 'DLC']
ENG_HEADER = ['각인명', '분류', '효과유형', '필요개수', '개조가능', '효과', '비고']
VARIANT_LINE = '[광란의 뼈의 강화·변환형 / 등급은 원본 문서 분류 기준]'


def base_items():
    return [
        ['광란의 뼈', '유니크', '무구', '', '기본 효과', ''],
        ['영원의 뼈: 광란', '레전더리', '무구', '마도구', f'{VARIANT_LINE}\n효과', 'DLC'],
        ['복제 도장', '레어', '랜덤A', '랜덤A', '복제', ''],
    ]


def base_engravings():
    return [
        ['무구', '능력치 각인', '기본', 2, True, '물리공격력 증가', ''],
        ['무구', '능력치 각인', '개조', 4, True, '더 증가', '메모'],
        ['마도구', '능력치 각인', '기본', 2, True, '마법공격력 증가', ''],
    ]


def sheets(items=None, engravings=None):
    return {
        '아이템 목록': [ITEM_HEADER] + (base_items() if items is None else items),
        '각인 정보': [ENG_HEADER] + (base_engravings() if engravings is None else engravings),
    }


def convert(data, style='shared'):
    return build(read_xlsx(make_xlsx(data, style)))


class ConvertItemsTest(unittest.TestCase):
    def test_shared_and_inline_same_result(self):
        shared = convert(sheets(), 'shared')
        self.assertEqual(shared, convert(sheets(), 'inline'))
        self.assertEqual([i['name'] for i in shared['items']], ['광란의 뼈', '영원의 뼈: 광란', '복제 도장'])
        self.assertEqual(shared['items'][1]['engravings'], ['무구', '마도구'])
        self.assertTrue(shared['items'][1]['dlc'])

    def test_rich_text_and_crlf(self):
        items = base_items()
        items[0][4] = ['물리공격력이 ', '20%']
        items[2][4] = 'A\r\nB'
        for style in ('shared', 'inline'):
            result = convert(sheets(items=items), style)['items']
            self.assertEqual(result[0]['description'], ['물리공격력이 20%'])
            self.assertEqual(result[2]['description'], ['A', 'B'])

    def test_header_found_by_name_with_extra_and_reordered_columns(self):
        order = ['DLC', '아이템 이름', '이미지', '등급', '각인 1', '각인 2', '설명']
        rows = [['Skul 아이템 도감 · 제목 행'], []]
        rows.append(order)
        for item in base_items():
            values = dict(zip(ITEM_HEADER, item), 이미지='portrait.png')
            rows.append([values[c] for c in order])
        data = {'아이템 목록': rows, '각인 정보': [ENG_HEADER] + base_engravings()}
        self.assertEqual(convert(data), convert(sheets()))

    def test_variant_prefix(self):
        item = convert(sheets())['items'][1]
        self.assertEqual(item['variantOf'], '광란의 뼈')
        self.assertEqual(item['description'], ['효과'])
        self.assertIsNone(convert(sheets())['items'][0]['variantOf'])

    def test_random_engravings_allowed(self):
        items = base_items()
        items[0][2:4] = ['랜덤B', '랜덤']
        result = convert(sheets(items=items))['items']
        self.assertEqual(result[0]['engravings'], ['랜덤B', '랜덤'])
        self.assertEqual(result[2]['engravings'], ['랜덤A', '랜덤A'])

    def test_errors_collected_with_row_numbers(self):
        items = base_items() + [
            ['나쁜 각인', '레어', '무구ㄱ', '', '설명', ''],   # 5행
            ['광란의 뼈', '레어', '', '', '설명', ''],         # 6행
            ['에픽 아이템', '에픽', '', '', '설명', ''],        # 7행
        ]
        with self.assertRaises(ConvertError) as ctx:
            convert(sheets(items=items))
        text = '\n'.join(ctx.exception.messages)
        for marker in ('아이템 목록 5행', '아이템 목록 6행', '아이템 목록 7행', '무구ㄱ', '에픽'):
            self.assertIn(marker, text)
        self.assertEqual(len(ctx.exception.messages), 3)

    def test_engraving_tiers(self):
        engravings = base_engravings()
        engravings[1][4] = '1'
        engravings[0][3] = '2.0'
        result = convert(sheets(engravings=engravings))['engravings']
        weapon = result[0]
        self.assertEqual(weapon['name'], '무구')
        self.assertTrue(weapon['moddable'])
        self.assertEqual(weapon['category'], '능력치 각인')
        self.assertEqual(weapon['tiers'], [
            {'kind': '기본', 'count': 2, 'effect': ['물리공격력 증가'], 'note': None},
            {'kind': '개조', 'count': 4, 'effect': ['더 증가'], 'note': '메모'},
        ])

        bad_mod = base_engravings()
        bad_mod[0][4] = False
        bad_mod[1][4] = False
        with self.assertRaises(ConvertError) as ctx:
            convert(sheets(engravings=bad_mod))
        self.assertIn('각인 정보 3행', '\n'.join(ctx.exception.messages))

        bad_category = base_engravings()
        bad_category[1][1] = '상태이상 각인'
        with self.assertRaises(ConvertError) as ctx:
            convert(sheets(engravings=bad_category))
        self.assertIn('각인 정보 3행', '\n'.join(ctx.exception.messages))

    def test_missing_sheet_or_column(self):
        with self.assertRaises(ConvertError) as ctx:
            build(read_xlsx(make_xlsx({'아이템 목록': [ITEM_HEADER] + base_items()})))
        self.assertIn('각인 정보', '\n'.join(ctx.exception.messages))

        header = [c for c in ITEM_HEADER if c != '설명']
        rows = [header] + [[v for c, v in zip(ITEM_HEADER, item) if c != '설명'] for item in base_items()]
        with self.assertRaises(ConvertError) as ctx:
            build(read_xlsx(make_xlsx({'아이템 목록': rows, '각인 정보': [ENG_HEADER] + base_engravings()})))
        self.assertIn('설명', '\n'.join(ctx.exception.messages))

    def test_cli_keeps_output_on_error(self):
        with tempfile.TemporaryDirectory() as tmp:
            out = os.path.join(tmp, 'items.js')
            with open(out, 'w', encoding='utf-8') as f:
                f.write('OLD')
            bad = os.path.join(tmp, 'bad.xlsx')
            with open(bad, 'wb') as f:
                f.write(make_xlsx(sheets(items=base_items() + [['x', '에픽', '', '', 'd', '']])))
            self.assertEqual(main([bad, '--retrieved', '2026-11-10', '--out', out]), 1)
            with open(out, encoding='utf-8') as f:
                self.assertEqual(f.read(), 'OLD')

            good = os.path.join(tmp, 'good.xlsx')
            with open(good, 'wb') as f:
                f.write(make_xlsx(sheets()))
            self.assertEqual(main([good, '--retrieved', '2026-11-10', '--out', out]), 0)
            with open(out, encoding='utf-8') as f:
                self.assertIn('export const ITEMS', f.read())

    def test_to_module_header(self):
        out = to_module(convert(sheets()), '2026-11-10')
        for needle in ('CC BY-NC-SA 2.0 KR', "retrieved: '2026-11-10'", '아이템과 각인/흉조 아이템', 'export const ENGRAVINGS = '):
            self.assertIn(needle, out)


if __name__ == '__main__':
    unittest.main()
