import unittest

from extract_namu import parse, to_module


def row(*cells):
    """cells: str 또는 (str, rowspan) 튜플."""
    out = []
    for c in cells:
        text, rowspan = (c, 1) if isinstance(c, str) else c
        attr = f' rowspan="{rowspan}"' if rowspan > 1 else ''
        out.append(f'<td{attr}><div>{text}</div></td>')
    return '<tr>' + ''.join(out) + '</tr>'


def table(*rows):
    return '<table><tbody>' + ''.join(rows) + '</tbody></table>'


HEADER = row(('스킬', 1), '쿨타임', '효과')
TYPE = row('타입', '기본 공격', '대쉬 공격') + row('스피드', '물리데미지', '없음')


def stage_table(names, cooldown='5초'):
    rows = [HEADER, row('패시브', '-', '-', '패시브 효과'), row('교대', '교대기', '-', '교대 효과')]
    rows.append(row(('스킬', len(names)), names[0], cooldown, f'{names[0]} 효과'))
    rows += [row(n, cooldown, f'{n} 효과') for n in names[1:]]
    return table(*rows)


FOUR = ['A', 'B', 'C', 'D']


class ExtractTest(unittest.TestCase):
    def test_stage_labels(self):
        html = ('<h3>3.5. 웨어울프[편집]</h3>'
                + table(row('노말 : 웨어울프', '레어 : 나이 든 웨어울프'), TYPE)
                + stage_table(FOUR) + table(TYPE) + stage_table(FOUR))
        stages = parse(html)['웨어울프']['stages']
        self.assertEqual([s['label'] for s in stages], ['노말', '레어'])
        self.assertEqual(stages[0]['form'], '웨어울프')
        self.assertEqual(stages[0]['kind'], 'stage')
        self.assertEqual(stages[0]['passive'], ['패시브 효과'])
        self.assertEqual(stages[0]['swap'], {'name': '교대기', 'effect': ['교대 효과']})

    def test_type_row_after_table(self):
        html = ('<h3>3.12. 노예 ★[편집]</h3>'
                + table(row('노말 : 노예', '레어 : 검사'))
                + table(HEADER, row('패시브', '-', '-', 'p'),
                        row(('스킬', 4), 'A', '1초', 'a'), row('B', '1초', 'b'), row('C', '1초', 'c'), row('D', '1초', 'd'),
                        row('타입', '기본 공격', '대쉬 공격'), row('밸런스', '물리데미지', '없음'),
                        HEADER, row('패시브', '-', '-', 'p'),
                        row(('스킬', 4), 'A', '1초', 'a'), row('B', '1초', 'b'), row('C', '1초', 'c'), row('D', '1초', 'd'),
                        row('타입', '기본 공격', '대쉬 공격')))
        stages = parse(html)['노예']['stages']
        self.assertEqual([len(s['skills']) for s in stages], [4, 4])

    def test_oversized_skill_rowspan_stops_at_type_row(self):
        # 좀도둑: 원문 마크업의 `스킬` rowspan이 5인데 스킬은 4개이고 바로 뒤에 타입 행이 온다.
        html = ('<h3>3.7. 좀도둑[편집]</h3>' + table(row('노말 : 좀도둑'))
                + table(HEADER, row(('스킬', 5), 'A', '1초', 'a'), row('B', '1초', 'b'), row('C', '1초', 'c'), row('D', '1초', 'd'),
                        row('타입', '기본 공격', '대쉬 공격'), row('스피드', '물리데미지', '없음')))
        skills = parse(html)['좀도둑']['stages'][0]['skills']
        self.assertEqual([k['name'] for k in skills], ['A', 'B', 'C', 'D'])

    def test_skill_rows_and_br(self):
        html = ('<h3>5.8. 죄수[편집]</h3>' + table(row('유니크 : 죄수'))
                + table(HEADER, row(('스킬', 1), '이중 자동 쇠뇌Ⅱ~Ⅵ<a href="#fn-75">[75]</a>', '12초<br>(충전)', 'A<br>B[75]')))
        skill = parse(html)['죄수']['stages'][0]['skills'][0]
        self.assertEqual(skill['name'], '이중 자동 쇠뇌Ⅱ~Ⅵ')
        self.assertEqual(skill['effect'], ['A', 'B'])
        self.assertEqual(skill['cooldown'], '12초 (충전)')

    def test_variants_with_and_without_cooldown(self):
        html = ('<h3>6.1. 그림리퍼[편집]</h3>' + table(row('레전더리 : 그림리퍼'))
                + table(HEADER,
                        row(('스킬', 6), ('수확', 3), '15초', '기본'), row('44초', '1단계'), row('44초', '2단계'),
                        row(('소울 차지', 3), ('13초', 3), '기본'), row('연소'), row('안정')))
        harvest, charge = parse(html)['그림리퍼']['stages'][0]['skills']
        self.assertEqual(harvest['cooldown'], '15초')
        self.assertEqual(harvest['variants'], [{'cooldown': '44초', 'effect': ['1단계']}, {'cooldown': '44초', 'effect': ['2단계']}])
        self.assertEqual(charge['name'], '소울 차지')
        self.assertEqual([v['cooldown'] for v in charge['variants']], ['13초', '13초'])
        self.assertEqual(charge['variants'][1]['effect'], ['안정'])

    def test_form_stage(self):
        html = ('<h3>5.5. 버서커[편집]</h3>' + table(row('레전더리 : 데빌 버서커'))
                + stage_table(FOUR) + table(row('악마의 뼈(스킬) : 데빌')) + stage_table(['악마의 울음', 'B', 'C', 'D']))
        stages = parse(html)['버서커']['stages']
        self.assertEqual({k: stages[1][k] for k in ('label', 'kind')}, {'label': '데빌', 'kind': 'form'})
        self.assertEqual(stages[1]['skills'][0]['name'], '악마의 울음')
        self.assertEqual(stages[0]['kind'], 'stage')

    def test_no_stage_row_and_subsection_ignored(self):
        html = ('<h2>3. 일반[편집]</h2><h3>3.1. 스컬(리틀본)[편집]</h3>' + table(row('스컬'))
                + stage_table(['두개골 투척', '머리가 본체'])
                + '<h4>3.1.1. ???[편집]</h4>' + table(row('용사 리틀본')) + stage_table(['X', 'Y'])
                + '<h2>7. 정수를 사용해 변신하는 스컬[편집]</h2><h3>7.1. 일반[편집]</h3>' + stage_table(['Z']))
        result = parse(html)
        self.assertEqual(list(result), ['스컬(리틀본)'])
        stages = result['스컬(리틀본)']['stages']
        self.assertEqual(len(stages), 1)
        self.assertEqual(stages[0]['label'], '기본')
        self.assertEqual([k['name'] for k in stages[0]['skills']], ['두개골 투척', '머리가 본체'])

    def test_cost_header_variant(self):
        html = ('<h3>6.2. 챔피언[편집]</h3>' + table(row('레전더리 : 챔피언'))
                + table(row(('스킬', 1), '필요 기력', '효과'), row(('스킬', 2), '순보', '25', 'a'), row('콤비네이션', '50', 'b')))
        stages = parse(html)['챔피언']['stages']
        self.assertEqual(len(stages), 1)
        self.assertEqual(stages[0]['cooldownLabel'], '필요 기력')
        self.assertEqual([k['cooldown'] for k in stages[0]['skills']], ['25', '50'])
        plain = parse('<h3>3.5. 웨어울프[편집]</h3>' + stage_table(FOUR))['웨어울프']['stages'][0]
        self.assertEqual(plain['cooldownLabel'], '쿨타임')

    def test_placeholder_swap_dropped(self):
        # 야차의 나찰 형태: `교대 | - | - | -` 행은 교대 스킬이 없다는 뜻이다.
        html = ('<h3>6.3. 야차[편집]</h3>'
                + table(HEADER, row('교대', '-', '-', '-'), row(('스킬', 1), 'A', '1초', 'a')))
        self.assertIsNone(parse(html)['야차']['stages'][0]['swap'])

    def test_marks_stripped(self):
        html = '<h3>3.12. 노예 ★[편집]</h3>' + stage_table(FOUR) + '<h3>3.9. 돌원숭 ◆[편집]</h3>' + stage_table(FOUR)
        self.assertEqual(sorted(parse(html)), ['노예', '돌원숭'])

    def test_to_module(self):
        out = to_module({'노예': {'stages': []}}, '2026-11-08')
        self.assertIn('CC BY-NC-SA 2.0 KR', out)
        self.assertIn('export const SKILL_INFO = ', out)
        self.assertIn("retrieved: '2026-11-08'", out)
        self.assertIn('나무위키 기여자', out)
        self.assertIn('https://creativecommons.org/licenses/by-nc-sa/2.0/kr/', out)


if __name__ == '__main__':
    unittest.main()
