// 자동 생성 파일: 손으로 고치지 말 것. 엑셀을 고친 뒤 변환기를 다시 실행한다.
// 생성: python -X utf8 tools/convert_items.py data/Skul_아이템_각인_DB형.xlsx --retrieved <YYYY-MM-DD> --out public/js/items.js  (npm run build:items)
// 원본: data/Skul_아이템_각인_DB형.xlsx
// 출처: 나무위키 기여자, 다음 문서 6개
//   - 「Skul: The Hero Slayer/아이템과 각인」 https://namu.wiki/w/Skul:%20The%20Hero%20Slayer/%EC%95%84%EC%9D%B4%ED%85%9C%EA%B3%BC%20%EA%B0%81%EC%9D%B8
//   - 「Skul: The Hero Slayer/아이템과 각인/레어 아이템」 https://namu.wiki/w/Skul:%20The%20Hero%20Slayer/%EC%95%84%EC%9D%B4%ED%85%9C%EA%B3%BC%20%EA%B0%81%EC%9D%B8/%EB%A0%88%EC%96%B4%20%EC%95%84%EC%9D%B4%ED%85%9C
//   - 「Skul: The Hero Slayer/아이템과 각인/유니크 아이템」 https://namu.wiki/w/Skul:%20The%20Hero%20Slayer/%EC%95%84%EC%9D%B4%ED%85%9C%EA%B3%BC%20%EA%B0%81%EC%9D%B8/%EC%9C%A0%EB%8B%88%ED%81%AC%20%EC%95%84%EC%9D%B4%ED%85%9C
//   - 「Skul: The Hero Slayer/아이템과 각인/레전더리 아이템」 https://namu.wiki/w/Skul:%20The%20Hero%20Slayer/%EC%95%84%EC%9D%B4%ED%85%9C%EA%B3%BC%20%EA%B0%81%EC%9D%B8/%EB%A0%88%EC%A0%84%EB%8D%94%EB%A6%AC%20%EC%95%84%EC%9D%B4%ED%85%9C
//   - 「Skul: The Hero Slayer/아이템과 각인/흉조 아이템」 https://namu.wiki/w/Skul:%20The%20Hero%20Slayer/%EC%95%84%EC%9D%B4%ED%85%9C%EA%B3%BC%20%EA%B0%81%EC%9D%B8/%ED%9D%89%EC%A1%B0%20%EC%95%84%EC%9D%B4%ED%85%9C
//   - 「Skul: The Hero Slayer/아이템과 각인/DLC 아이템」 https://namu.wiki/w/Skul:%20The%20Hero%20Slayer/%EC%95%84%EC%9D%B4%ED%85%9C%EA%B3%BC%20%EA%B0%81%EC%9D%B8/DLC%20%EC%95%84%EC%9D%B4%ED%85%9C
// 라이선스: CC BY-NC-SA 2.0 KR (https://creativecommons.org/licenses/by-nc-sa/2.0/kr/) · 2026-11-10 기준. 이 파일의 내용은 위 라이선스를 따른다.

export const ITEMS_META = {
  sources: [
    { title: 'Skul: The Hero Slayer/아이템과 각인', url: 'https://namu.wiki/w/Skul:%20The%20Hero%20Slayer/%EC%95%84%EC%9D%B4%ED%85%9C%EA%B3%BC%20%EA%B0%81%EC%9D%B8' },
    { title: 'Skul: The Hero Slayer/아이템과 각인/레어 아이템', url: 'https://namu.wiki/w/Skul:%20The%20Hero%20Slayer/%EC%95%84%EC%9D%B4%ED%85%9C%EA%B3%BC%20%EA%B0%81%EC%9D%B8/%EB%A0%88%EC%96%B4%20%EC%95%84%EC%9D%B4%ED%85%9C' },
    { title: 'Skul: The Hero Slayer/아이템과 각인/유니크 아이템', url: 'https://namu.wiki/w/Skul:%20The%20Hero%20Slayer/%EC%95%84%EC%9D%B4%ED%85%9C%EA%B3%BC%20%EA%B0%81%EC%9D%B8/%EC%9C%A0%EB%8B%88%ED%81%AC%20%EC%95%84%EC%9D%B4%ED%85%9C' },
    { title: 'Skul: The Hero Slayer/아이템과 각인/레전더리 아이템', url: 'https://namu.wiki/w/Skul:%20The%20Hero%20Slayer/%EC%95%84%EC%9D%B4%ED%85%9C%EA%B3%BC%20%EA%B0%81%EC%9D%B8/%EB%A0%88%EC%A0%84%EB%8D%94%EB%A6%AC%20%EC%95%84%EC%9D%B4%ED%85%9C' },
    { title: 'Skul: The Hero Slayer/아이템과 각인/흉조 아이템', url: 'https://namu.wiki/w/Skul:%20The%20Hero%20Slayer/%EC%95%84%EC%9D%B4%ED%85%9C%EA%B3%BC%20%EA%B0%81%EC%9D%B8/%ED%9D%89%EC%A1%B0%20%EC%95%84%EC%9D%B4%ED%85%9C' },
    { title: 'Skul: The Hero Slayer/아이템과 각인/DLC 아이템', url: 'https://namu.wiki/w/Skul:%20The%20Hero%20Slayer/%EC%95%84%EC%9D%B4%ED%85%9C%EA%B3%BC%20%EA%B0%81%EC%9D%B8/DLC%20%EC%95%84%EC%9D%B4%ED%85%9C' },
  ],
  license: 'CC BY-NC-SA 2.0 KR',
  licenseUrl: 'https://creativecommons.org/licenses/by-nc-sa/2.0/kr/',
  retrieved: '2026-11-10',
};

export const ITEM_GRADES = [
  { id: 'common', label: '일반' },
  { id: 'rare', label: '레어' },
  { id: 'unique', label: '유니크' },
  { id: 'legendary', label: '레전더리' },
  { id: 'omen', label: '흉조' },
];

export const ENGRAVING_CATEGORIES = [
 "능력치 각인",
 "상태이상 각인",
 "특수능력 각인(공격)",
 "특수능력 각인(방어)"
];

export const ITEMS = [
 {
  "name": "그림자 정령 데스",
  "grade": "common",
  "engravings": [
   "동화",
   "난투"
  ],
  "description": [
   "7초마다 주변 임의의 적에게 그림자 마법으로 마법 피해를 줍니다. 빛의 정령 루를 함께 보유하면 어둠의 정령 셰이드로 변합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "낡은 십자가",
  "grade": "common",
  "engravings": [
   "성물",
   "현기증"
  ],
  "description": [
   "치명타 확률이 5% 증가합니다. 기본 공격 시 2% 확률로 적에게 기절을 부여합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "독극물 팬던트",
  "grade": "common",
  "engravings": [
   "가보",
   "독살"
  ],
  "description": [
   "물리공격력이 20% 증가합니다. 기본 공격 시 2% 확률로 적에게 중독을 부여합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "마공학 톱니바퀴",
  "grade": "common",
  "engravings": [
   "마공학",
   "방화"
  ],
  "description": [
   "마법공격력이 20% 증가합니다. 기본 공격 시 2% 확률로 적에게 화상을 부여합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "미지의 씨앗",
  "grade": "common",
  "engravings": [
   "고대의 힘",
   "마나 순환"
  ],
  "description": [
   "체력을 10 회복할 때마다 물리·마법 공격력이 1% 증가합니다. 누적 회복량이 300에 도달하면 세계수 씨앗으로 변합니다. 위그드라실 처치 후 보물상자에서 획득합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "바람의 반지",
  "grade": "common",
  "engravings": [
   "가보",
   "비상"
  ],
  "description": [
   "공격속도와 이동속도가 각각 15% 증가합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "버려진 결혼반지",
  "grade": "common",
  "engravings": [
   "가보",
   "절대영도"
  ],
  "description": [
   "스킬 쿨다운 속도가 25% 증가합니다. 기본 공격 시 2% 확률로 적에게 빙결을 부여합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "보급형 칼레온 갑옷",
  "grade": "common",
  "engravings": [
   "전리품",
   "요새"
  ],
  "description": [
   "받는 피해가 15% 감소합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "보급형 칼레온 검",
  "grade": "common",
  "engravings": [
   "전리품",
   "용기"
  ],
  "description": [
   "물리공격력이 30% 증가합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "보급형 칼레온 스태프",
  "grade": "common",
  "engravings": [
   "전리품",
   "지혜"
  ],
  "description": [
   "마법공격력이 30% 증가합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "보급형 칼레온 활",
  "grade": "common",
  "engravings": [
   "전리품",
   "강타"
  ],
  "description": [
   "치명타 확률이 8% 증가합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "부서진 단검",
  "grade": "common",
  "engravings": [
   "암기",
   "과다출혈"
  ],
  "description": [
   "공격속도가 15% 증가합니다. 기본 공격 시 2% 확률로 적에게 상처를 부여합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "빛 바랜 마석 파편",
  "grade": "common",
  "engravings": [
   "골동품",
   "복수"
  ],
  "description": [
   "최대 체력이 25 증가합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "식전 기도문",
  "grade": "common",
  "engravings": [
   "성물",
   "마나 순환"
  ],
  "description": [
   "스킬 쿨다운 속도가 40% 증가합니다. 암시장에서 해금되는 아이템입니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "원기회복의 뿌리",
  "grade": "common",
  "engravings": [
   "복수",
   "돌연변이"
  ],
  "description": [
   "피격 시 체력을 1 회복합니다. 암시장에서 해금되는 아이템입니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "죽도",
  "grade": "common",
  "engravings": [
   "무구",
   "신속"
  ],
  "description": [
   "공격속도가 20% 증가합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "증오의 돌",
  "grade": "common",
  "engravings": [
   "마도구",
   "복수"
  ],
  "description": [
   "피격 시 4초간 마법공격력이 55% 증가합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "칼레온 계급장",
  "grade": "common",
  "engravings": [
   "전리품",
   "보물"
  ],
  "description": [
   "맵 이동 시 보유한 칼레온 아이템 1개당 30골드를 획득합니다. 대상: 칼레온 계급장, 보급형 칼레온 갑옷·검·스태프·활. 계급장 자체도 포함됩니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "가속검",
  "grade": "rare",
  "engravings": [
   "무구",
   "신속"
  ],
  "description": [
   "14초마다 가속검을 휘둘러 물리데미지를 입힙니다. 공격속도가 증가할수록 가속검을 더 자주 휘두릅니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "가시견갑",
  "grade": "rare",
  "engravings": [
   "요새",
   "과다출혈"
  ],
  "description": [
   "적에게 대쉬공격으로 입히는 데미지가 80% 증가합니다.",
   "적에게 대쉬공격 시 10% 확률로 적에게 상처를 부여합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "가시장화",
  "grade": "rare",
  "engravings": [
   "비상",
   "과다출혈"
  ],
  "description": [
   "공중에 있을 시 물리공격력이 40% 증가합니다. 공중에서 적에게 기본공격 시 15% 확률로 상처를 부여합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "강인함의 상징",
  "grade": "rare",
  "engravings": [
   "요새",
   "가보"
  ],
  "description": [
   "방어막을 가지고 있는 상태에서 피격 시 자신을 공격한 대상을 향해 충격파가 발생됩니다.",
   "충격파는 가지고 있던 방어막의 양에 비례한 물리데미지랑 마법데미지 중 높은 수치의 공격 유형의 피해를 입힙니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "거인의 도끼",
  "grade": "rare",
  "engravings": [
   "무구",
   "돌연변이"
  ],
  "description": [
   "파워 타입 스컬로 교대 시 주변 적들을 밀쳐내고 물리데미지를 입힙니다.",
   "물리공격력이 40% 증가합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "건강검진기",
  "grade": "rare",
  "engravings": [
   "마공학",
   "강타"
  ],
  "description": [
   "주변의 상태이상에 걸린 적 1명당 교대 쿨다운 속도가 10% 증가하고 치명타 확률이 4% 증가합니다. (각각 최대 50%, 20% 증가)"
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "겁쟁이의 망토",
  "grade": "rare",
  "engravings": [
   "골동품",
   "추적"
  ],
  "description": [
   "대쉬 후 0.1초 내로 점프 시 1초간 이동속도가 300% 증가합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "고급 찻잔",
  "grade": "rare",
  "engravings": [
   "골동품",
   "가보"
  ],
  "description": [
   "정신집중 시작 시 주변 적에게 경직을 부여합니다.",
   "정신집중 종료 시 1초간 치명타 확률이 15% 증가합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "고대향로",
  "grade": "rare",
  "engravings": [
   "골동품",
   "고대의 힘"
  ],
  "description": [
   "정수 쿨다운 속도가 65% 증가합니다.",
   "최대체력이 35 증가합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "고장난 마력엔진",
  "grade": "rare",
  "engravings": [
   "마공학",
   "추적"
  ],
  "description": [
   "대쉬 시 마력덩어리가 유출됩니다.",
   "마력덩어리는 일정시간 뒤 폭발하여 마법데미지를 입힙니다.",
   "쿨다운 속도가 40% 증가합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "공감대 형성기",
  "grade": "rare",
  "engravings": [
   "마공학",
   "현기증"
  ],
  "description": [
   "스킬 쿨다운 속도가 40% 증가합니다.",
   "적에게 기절 부여 시 파장이 발생하여 주변 적에게도 기절을 부여합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "공격형 수레바퀴",
  "grade": "rare",
  "engravings": [
   "골동품",
   "마나 순환"
  ],
  "description": [
   "물리공격력이 45% 증가합니다.",
   "스킬 4회 사용 후 교대 시 수레바퀴가 굴러가며 물리데미지를 입힙니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "광란의 뼈",
  "grade": "rare",
  "engravings": [
   "뼈",
   "난투"
  ],
  "description": [
   "스킬 사용 시 5초간 유지되는 뼈의 영역이 생성됩니다. (쿨타임: 5초)",
   "영역 내에 있을 시 물리공격력 및 마법공격력이 55% 증가합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "영원의 뼈: 광란",
  "grade": "rare",
  "engravings": [
   "뼈",
   "난투"
  ],
  "description": [
   "스킬 사용 시 5초간 유지되는 뼈의 영역이 생성됩니다. (쿨타임: 5초)",
   "영역 내에 있을 시 물리공격력 및 마법공격력이 55% 증가합니다.",
   "뼈 각인 효과 발동 시 15초간 유지되는 광란의 영역이 생성됩니다.",
   "광란의 영역 내에 있을 시 입히는 데미지가 20% 증폭됩니다."
  ],
  "variantOf": "광란의 뼈",
  "dlc": false
 },
 {
  "name": "광전사의 장갑",
  "grade": "rare",
  "engravings": [
   "걸작",
   "복수"
  ],
  "description": [
   "잃은체력에 비례하여 공격속도가 최대 60%까지 증가합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "암흑 광전사의 장갑",
  "grade": "rare",
  "engravings": [
   "걸작",
   "복수"
  ],
  "description": [
   "잃은체력에 비례하여 공격속도가 최대 70%까지 증가합니다. 현재 체력이 30% 이하일 시 공격속도가 추가로 50% 더 증가합니다."
  ],
  "variantOf": "광전사의 장갑",
  "dlc": false
 },
 {
  "name": "기병대 장식",
  "grade": "rare",
  "engravings": [
   "가보",
   "추적"
  ],
  "description": [
   "대쉬 시 전방의 적을 찔러 물리데미지를 입힙니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "기사의 각오",
  "grade": "rare",
  "engravings": [
   "요새",
   "복수"
  ],
  "description": [
   "현재 체력이 30% 이하일 경우 받는 데미지가 30% 감소합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "나이아스의 심장",
  "grade": "rare",
  "engravings": [
   "고대의 힘",
   "절대영도"
  ],
  "description": [
   "피격 시 주변 적에게 빙결을 부여합니다. (쿨타임: 10초)",
   "빙결 상태의 적은 빙결 해제 시 추가 마법데미지를 입습니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "내면의 독기",
  "grade": "rare",
  "engravings": [
   "돌연변이",
   "독살"
  ],
  "description": [
   "교대 시 내면의 독기를 일으켜 주변 적에게 물리데미지를 입히고 중독을 부여하며 12초간 물리공격력이 60% 증가합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "내면의 불꽃",
  "grade": "rare",
  "engravings": [
   "돌연변이",
   "방화"
  ],
  "description": [
   "교대 시 내면의 불꽃을 일으켜 주변 적에게 마법데미지를 입히고 화상을 부여하며 12초간 마법공격력이 60% 증가합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "달의 반지",
  "grade": "rare",
  "engravings": [
   "마도구",
   "해와 달"
  ],
  "description": [
   "마법공격력이 40% 증가합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "도적의 팔토시",
  "grade": "rare",
  "engravings": [
   "암기",
   "불운"
  ],
  "description": [
   "기본공격 시 물리데미지를 입히는 수리검을 던집니다.",
   "치명타 시 물리데미지를 입히는 대형 수리검을 던집니다.(쿨타임 0.5초)"
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "뒤틀린 곡검",
  "grade": "rare",
  "engravings": [
   "암기",
   "결투"
  ],
  "description": [
   "물리공격력이 25% 증가합니다.",
   "치명타 확률이 10% 증가합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "땅의 정령 노움",
  "grade": "rare",
  "engravings": [
   "동화",
   "요새"
  ],
  "description": [
   "땅의 정령 노움이 자신을 따라다니며 12초마다 바위 마법으로 주변 적에게 마법데미지를 입힙니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "마공학 중력제어기",
  "grade": "rare",
  "engravings": [
   "마공학",
   "용기"
  ],
  "description": [
   "스킬 사용 시 마공학 중력제어기가 작동하여 주변 적에게 물리데미지를 입히고 잠시 공중에 띄웁니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "마공학 추진장치",
  "grade": "rare",
  "engravings": [
   "마공학",
   "비상"
  ],
  "description": [
   "공중에서 기본공격 또는 스킬 사용 시 5초간 공격속도가 10% 증가합니다. (최대 50% 증가)"
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "마법사의 목걸이",
  "grade": "rare",
  "engravings": [
   "가보",
   "마나 순환"
  ],
  "description": [
   "스킬 사용 시 화염옥이 생성됩니다.",
   "화염옥은 일정범위 내 가장 가까운 적에게 파이어볼을 발사하여 마법데미지를 입힙니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "마법의 어둠보주",
  "grade": "rare",
  "engravings": [
   "돌연변이",
   "현기증"
  ],
  "description": [
   "3번째 교대 시 주변 적들에게 기절을 부여합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "마법의 초커",
  "grade": "rare",
  "engravings": [
   "돌연변이",
   "강타"
  ],
  "description": [
   "교대 시 8개의 마법 투사체가 발사되어 마법데미지를 입힙니다.",
   "적에게 적중한 마법 투사체 1개당 10초간 치명타 확률이 2% 증가합니다. (최대 16% 증가)"
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "맹금의 부리",
  "grade": "rare",
  "engravings": [
   "고대의 힘",
   "강타"
  ],
  "description": [
   "공격속도가 25% 증가하고 치명타 확률이 5% 증가합니다.",
   "스피드 타입 스컬로 교대 시 12초간 치명타 확률이 10% 증가합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "무의식의 쾌검",
  "grade": "rare",
  "engravings": [
   "무구",
   "결투"
  ],
  "description": [
   "13초마다 주변 임의의 적에게 물리데미지를 입힙니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "바람갑옷",
  "grade": "rare",
  "engravings": [
   "요새",
   "추적"
  ],
  "description": [
   "대쉬 후 0.4초 내로 대쉬 시 2초간 날카로운 바람이 자신을 감싸 주변 적에게 마법데미지를 입힙니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "바람의 정령 실피드",
  "grade": "rare",
  "engravings": [
   "동화",
   "신속"
  ],
  "description": [
   "바람의 정령 실피드가 자신을 따라다니며 10초마다 바람의 마법으로 전방의 적에게 마법데미지를 입힙니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "발광석",
  "grade": "rare",
  "engravings": [
   "보물",
   "마나 순환"
  ],
  "description": [
   "스킬 5회 사용 시 30초간 유지되는 10의 방어막을 얻습니다. (쿨타임: 30초)"
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "뱀파이어의 이빨",
  "grade": "rare",
  "engravings": [
   "고대의 힘",
   "과다출혈"
  ],
  "description": [
   "적을 5명 처치할 시 체력을 1 회복하고 뱀파이어의 말뚝이 뻗어나 주변 적에게 상처를 부여합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "벼락의 열 한번째 손가락",
  "grade": "rare",
  "engravings": [
   "마도구",
   "결투"
  ],
  "description": [
   "8초마다 주변 임의의 적에게 벼락이 떨어져 마법데미지를 입힙니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "보이지 않는 검",
  "grade": "rare",
  "engravings": [
   "암기",
   "불운"
  ],
  "description": [
   "치명타 시 보이지 않는 검으로 찔러 추가 마법데미지를 입힙니다.",
   "치명타 확률이 10% 증가합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "부패한 심장",
  "grade": "rare",
  "engravings": [
   "복수",
   "독살"
  ],
  "description": [
   "피격 시 주변 적에게 중독을 부여합니다. (쿨타임: 1초)",
   "중독 상태의 적 처치 시 부패 물질이 퍼져 주변 적에게 중독을 부여합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "분노의 갈퀴손",
  "grade": "rare",
  "engravings": [
   "암기",
   "처형"
  ],
  "description": [
   "적에게 첫 공격 시 5초간 공격속도가 25% 증가합니다.",
   "적 처치 시 5초간 공격속도가 25% 증가합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "불타는 경전",
  "grade": "rare",
  "engravings": [
   "성물",
   "방화"
  ],
  "description": [
   "화상 상태의 적이 화상으로 주변의 다른 적에게 데미지를 입힐 시 15% 확률로 화상을 부여합니다.",
   "마법공격력이 30% 증가합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "사냥꾼의 장화",
  "grade": "rare",
  "engravings": [
   "걸작",
   "추적"
  ],
  "description": [
   "대쉬 시 주변 임의의 적에게 화살이 떨어져 물리데미지를 입힙니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "베테랑 사냥꾼의 장화",
  "grade": "rare",
  "engravings": [
   "걸작",
   "추적"
  ],
  "description": [
   "대쉬 시 최대 3명의 주변 임의의 적에게 화살이 떨어져 물리데미지를 입힙니다."
  ],
  "variantOf": "사냥꾼의 장화",
  "dlc": false
 },
 {
  "name": "사제의 베일",
  "grade": "rare",
  "engravings": [
   "성물",
   "마나 순환"
  ],
  "description": [
   "10초마다 10초간 유지되는 임의의 버프를 얻습니다.",
   "(물리공격력 및 마법공격력 35% 증가 / 받는데미지 10% 감소 / 공격속도 25%, 이동속도 35% 증가)"
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "선조의 팔찌",
  "grade": "rare",
  "engravings": [
   "고대의 힘",
   "신속"
  ],
  "description": [
   "정수 쿨다운 속도가 45% 증가합니다.",
   "공격속도가 30% 증가합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "수행자의 견갑",
  "grade": "rare",
  "engravings": [
   "요새",
   "용기"
  ],
  "description": [
   "정신집중 속도가 40% 증가하고 물리공격력이 35% 증가합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "수행자의 목걸이",
  "grade": "rare",
  "engravings": [
   "골동품",
   "지혜"
  ],
  "description": [
   "정신집중 속도가 40% 증가하고 마법공격력이 35% 증가합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "숨겨진 단검",
  "grade": "rare",
  "engravings": [
   "암기",
   "추적"
  ],
  "description": [
   "대쉬 시 단검을 던져 물리데미지를 입힙니다.",
   "치명타 확률이 10% 증가합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "스핑크스의 눈",
  "grade": "rare",
  "engravings": [
   "고대의 힘",
   "마도구"
  ],
  "description": [
   "함정으로 인해 받는 데미지가 75% 감소합니다",
   "마법공격력이 35% 증가합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "시간의 뼈",
  "grade": "rare",
  "engravings": [
   "뼈",
   "마나 순환"
  ],
  "description": [
   "스킬을 사용할 때마다 교대 쿨타임이 0.5초 감소합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "영원의 뼈: 시간",
  "grade": "rare",
  "engravings": [
   "뼈",
   "마나 순환"
  ],
  "description": [
   "스킬을 사용할 때마다 교대 쿨타임이 0.5초 감소합니다.",
   "뼈 각인 효과 발동 시 다음 1회의 교대에 대하여 교대 쿨타임이 즉시 회복됩니다."
  ],
  "variantOf": "시간의 뼈",
  "dlc": false
 },
 {
  "name": "신비한 기구",
  "grade": "rare",
  "engravings": [
   "가보",
   "신속"
  ],
  "description": [
   "스킬 사용 시 3초간 공격속도가 20% 증가하고 기본공격 시 신비한 힘의 파동이 발생하여 물리데미지를 입힙니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "심연 바이러스",
  "grade": "rare",
  "engravings": [
   "마도구",
   "처형"
  ],
  "description": [
   "적 최대체력의 50% 이상의 데미지를 입힐 시 가시가 뻗어나와 주변 적에게 마법데미지를 입힙니다. (모험가 및 보스의 경우 5%) (쿨타임: 1초)"
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "암살용 단검",
  "grade": "rare",
  "engravings": [
   "암기",
   "강타"
  ],
  "description": [
   "치명타 확률이 15% 증가합니다.",
   "스피드 타입 스컬의 공격속도가 25%,이동속도가 20% 증가합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "얼음비늘 견갑",
  "grade": "rare",
  "engravings": [
   "요새",
   "절대영도"
  ],
  "description": [
   "적에게 대쉬공격으로 입히는 데미지가 30% 증가합니다. 적에게 대쉬공격 시 10% 확률로 적에게 빙결을 부여합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "예절주입기",
  "grade": "rare",
  "engravings": [
   "처형",
   "현기증"
  ],
  "description": [
   "물리공격력 및 마법공격력이 30% 증가합니다.",
   "12초마다 다음 공격이 기절을 부여합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "왕자의 상자",
  "grade": "rare",
  "engravings": [
   "랜덤A",
   "랜덤B"
  ],
  "description": [
   "물리공격력 및 마법공격력이 30% 증가합니다.",
   "최대체력이 20 증가합니다.",
   "이 아이템은 임의의 각인을 갖습니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "왕자의 상자 두 개",
  "grade": "rare",
  "engravings": [
   "걸작",
   "랜덤"
  ],
  "description": [
   "보유하고 있는 모든 각인의 개수가 1개 증가합니다.",
   "최대체력이 20 증가합니다.",
   "이 아이템은 임의의 각인을 갖습니다."
  ],
  "variantOf": "왕자의 상자",
  "dlc": false
 },
 {
  "name": "뼈 상자",
  "grade": "rare",
  "engravings": [
   "뼈",
   "랜덤"
  ],
  "description": [
   "물리공격력 및 마법공격력이 30% 증가합니다.",
   "최대체력이 20 증가합니다.",
   "이 아이템은 임의의 각인을 갖습니다.",
   "뼈 각인 효과 발동 시 15초간 활성화되어있는 뼈 각인 효과 1개당 물리공격력 및 마법공격력이 45% 증가합니다."
  ],
  "variantOf": "왕자의 상자",
  "dlc": false
 },
 {
  "name": "요술 지팡이",
  "grade": "rare",
  "engravings": [
   "돌연변이",
   "마나 순환"
  ],
  "description": [
   "현재 체력이 최대치인 적 공격 시 10% 확률로 귀염둥이로 변신시킵니다. (모험가 및 보스 제외)"
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "용사의 장갑",
  "grade": "rare",
  "engravings": [
   "걸작",
   "용기"
  ],
  "description": [
   "대쉬 시 기폭발을 일으켜 물리데미지를 입힙니다.(쿨타임 7초)"
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "베테랑 용사의 장갑",
  "grade": "rare",
  "engravings": [
   "걸작",
   "용기"
  ],
  "description": [
   "대쉬 시 강화 된 기폭발을 일으켜 물리데미지를 입힙니다.(쿨타임 4초)"
  ],
  "variantOf": "용사의 장갑",
  "dlc": false
 },
 {
  "name": "원망의 돌",
  "grade": "rare",
  "engravings": [
   "마도구",
   "처형"
  ],
  "description": [
   "적 처치 시 30%의 확률로 주변에 마법데미지를 입히는 폭발을 일힙니다.",
   "최대체력이 30 증가합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "의식용 단검",
  "grade": "rare",
  "engravings": [
   "암기",
   "마도구"
  ],
  "description": [
   "치명타 확률이 10% 증가합니다.",
   "치명타 시 4초간 마법공격력이 55% 증가합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "의식용 지팡이",
  "grade": "rare",
  "engravings": [
   "마도구",
   "지혜"
  ],
  "description": [
   "마법공격력이 50% 증가합니다.",
   "밸런스 타입 스컬의 스킬 쿨다운 속도가 45% 증가합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "일격의 메아리",
  "grade": "rare",
  "engravings": [
   "지혜",
   "신속"
  ],
  "description": [
   "기본공격 시 메아리가 날아가 마법데미지를 입힙니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "일회용 주사기",
  "grade": "rare",
  "engravings": [
   "불운",
   "독살"
  ],
  "description": [
   "치명타 시 중독을 부여합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "자가몬의 가시",
  "grade": "rare",
  "engravings": [
   "고대의 힘",
   "과다출혈"
  ],
  "description": [
   "상처 상태의 적에게 기본공격 시 7 고정데미지를 입히고 5초간 공격속도 및 이동속도가 3% 증가합니다. (최대 30% 증가)"
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "장로엔트의 보은",
  "grade": "rare",
  "engravings": [
   "고대의 힘",
   "마나 순환"
  ],
  "description": [
   "50의 방어막을 얻습니다.",
   "이 보호막이 유지되는 동안 물리공격력 및 마법공격력이 50%증가합니다.",
   "방어막이 파괴될 시 이 아이템은 소멸합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "저격의 구",
  "grade": "rare",
  "engravings": [
   "결투",
   "불운"
  ],
  "description": [
   "마법공격력이 25% 증가하고 치명타 데미지가 10% 증가합니다.",
   "밸런스 타입 스컬로 교대 시 다수의 마법화살을 발사하여 마법데미지를 입힙니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "전사의 견갑",
  "grade": "rare",
  "engravings": [
   "요새",
   "난투"
  ],
  "description": [
   "20초마다 5초간 유지되는 장벽을 생성합니다.",
   "장벽은 전방에서 가해지는 공격을 무효화 시킵니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "전해지는 검집",
  "grade": "rare",
  "engravings": [
   "성물",
   "마나 순환"
  ],
  "description": [
   "체력을 회복할 시 10초간 주변에 참격이 일어나 물리데미지를 입힙니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "정령사의 축복",
  "grade": "rare",
  "engravings": [
   "동화",
   "가보"
  ],
  "description": [
   "보유한 정령 1개 당 마법공격력이 45% 증가합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "제니의 사슬낫",
  "grade": "rare",
  "engravings": [
   "비상",
   "불운"
  ],
  "description": [
   "공중에서 기본공격 시 사슬낫을 휘둘러 물리데미지를 입힙니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "처형 도끼",
  "grade": "rare",
  "engravings": [
   "무구",
   "처형"
  ],
  "description": [
   "물리공격력이 50% 증가합니다.",
   "파워 타입 스컬의 최대체력이 30 증가합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "태양의 검",
  "grade": "rare",
  "engravings": [
   "무구",
   "해와 달"
  ],
  "description": [
   "물리공격력이 40% 증가합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "태양마차의 파편",
  "grade": "rare",
  "engravings": [
   "추적",
   "방화"
  ],
  "description": [
   "대쉬 시 불길이 일어나 마법데미지를 입히고 10% 확률로 화상을 부여합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "투사의 벨트",
  "grade": "rare",
  "engravings": [
   "걸작",
   "난투"
  ],
  "description": [
   "주변의 적 1명당 물리공격력이 15% 증가합니다. (최대 90% 증가)"
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "최강 투사의 벨트",
  "grade": "rare",
  "engravings": [
   "걸작",
   "난투"
  ],
  "description": [
   "주변의 적 1명당 물리공격력이 25% 증가합니다. (최대 100% 증가)",
   "기본공격 시 충격파를 일으켜 주변 적에게 물리데미지를 입힙니다. (쿨타임: 5초)",
   "주변의 적 1명당 충격파의 쿨타임이 1초 감소합니다."
  ],
  "variantOf": "투사의 벨트",
  "dlc": false
 },
 {
  "name": "현자의 시간",
  "grade": "rare",
  "engravings": [
   "걸작",
   "용기"
  ],
  "description": [
   "쿨다운 상태인 스킬 1개당 물리공격력이 25% 증가합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "대현자의 시간",
  "grade": "rare",
  "engravings": [
   "걸작",
   "용기"
  ],
  "description": [
   "쿨다운 상태인 스킬 1개당 물리공격력이 35% 증가합니다.",
   "쿨다운 상태의 스킬이 4개가 되면 깨달음의 파동을 일으켜 주변 적에게 물리데미지를 입힙니다. (쿨타임: 3초)"
  ],
  "variantOf": "현자의 시간",
  "dlc": false
 },
 {
  "name": "혹한의 철갑신발",
  "grade": "rare",
  "engravings": [
   "비상",
   "절대영도"
  ],
  "description": [
   "공중에 있을 시 마법공격력이 40% 증가합니다. 공중에서 적에게 기본공격 시 5% 확률로 빙결을 부여합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "황금 채찍",
  "grade": "rare",
  "engravings": [
   "보물",
   "복수"
  ],
  "description": [
   "획득하는 골드량이 15% 증가합니다.",
   "피격 시 4초간 치명타 확률이 25% 증가합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "황금향로",
  "grade": "rare",
  "engravings": [
   "골동품",
   "보물"
  ],
  "description": [
   "획득하는 골드량이 25% 증가합니다.",
   "최대체력이 35 증가합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "황금의 칼",
  "grade": "rare",
  "engravings": [
   "무구",
   "보물"
  ],
  "description": [
   "100의 금화를 소모할 때마다 물리공격력이 1% 증가합니다. (최대 70% 증가)"
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "황금의 완드",
  "grade": "rare",
  "engravings": [
   "마도구",
   "보물"
  ],
  "description": [
   "100의 금화를 소모할 때마다 마법공격력이 1% 증가합니다. (최대 70% 증가)"
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "거인 석상",
  "grade": "rare",
  "engravings": [
   "골동품",
   "신비"
  ],
  "description": [
   "최대체력이 35 증가합니다. 적에게 기본공격 시 주변 적을 끌어당깁니다"
  ],
  "variantOf": null,
  "dlc": true
 },
 {
  "name": "고대인의 투구",
  "grade": "rare",
  "engravings": [
   "고대의 힘",
   "신비"
  ],
  "description": [
   "정수 사용 시 10초간 물리공격력이 60% 증가합니다."
  ],
  "variantOf": null,
  "dlc": true
 },
 {
  "name": "마법의 장화",
  "grade": "rare",
  "engravings": [
   "신속",
   "신비"
  ],
  "description": [
   "대쉬 시 3초간 공격속도가 40% 증가합니다."
  ],
  "variantOf": null,
  "dlc": true
 },
 {
  "name": "보병대 창",
  "grade": "rare",
  "engravings": [
   "무구",
   "신비"
  ],
  "description": [
   "피격 시 창으로 찔러 물리데미지를 입힙니다."
  ],
  "variantOf": null,
  "dlc": true
 },
 {
  "name": "붉은 말의 갈기",
  "grade": "rare",
  "engravings": [
   "돌연변이",
   "신비"
  ],
  "description": [
   "공격속도 및 이동속도가 25% 증가합니다.",
   "교대 시 8초간 공격속도가 40% 추가 증가합니다."
  ],
  "variantOf": null,
  "dlc": true
 },
 {
  "name": "외치는 뿔피리",
  "grade": "rare",
  "engravings": [
   "마나 순환",
   "신비"
  ],
  "description": [
   "기본공격 5회 후 스킬 사용 시 파동이 일어나 마법데미지를 입히며 마법공격력이 45% 증가합니다."
  ],
  "variantOf": null,
  "dlc": true
 },
 {
  "name": "충의 생성기",
  "grade": "rare",
  "engravings": [
   "마공학",
   "신비"
  ],
  "description": [
   "적에게 스킬로 데미지를 입힐 시 3초간 공격속도가 40% 증가합니다.",
   "적에게 기본공격으로 데미지를 입힐 시 3초간 물리공격력이 40% 증가합니다."
  ],
  "variantOf": null,
  "dlc": true
 },
 {
  "name": "파괴하는 손",
  "grade": "rare",
  "engravings": [
   "현기증",
   "신비"
  ],
  "description": [
   "물리공격력이 50% 증가합니다.",
   "스킬 3회 사용 시 주변 적에게 기절을 부여합니다."
  ],
  "variantOf": null,
  "dlc": true
 },
 {
  "name": "호수를 담은 병",
  "grade": "rare",
  "engravings": [
   "동화",
   "신비"
  ],
  "description": [
   "마법공격력이 40% 증가합니다. 물의 정령 운디네를 가지고 있을 시 운디네가 본래의 모습을 되찾습니다."
  ],
  "variantOf": null,
  "dlc": true
 },
 {
  "name": "힘의 띠",
  "grade": "rare",
  "engravings": [
   "난투",
   "신비"
  ],
  "description": [
   "3번 째 기본공격에 피격된 적 1명에게 정전기가 폭발해 주변 적에게",
   "마법데미지를 입힙니다."
  ],
  "variantOf": null,
  "dlc": true
 },
 {
  "name": "겁쟁이 명사수의 활",
  "grade": "unique",
  "engravings": [
   "불운",
   "강타"
  ],
  "description": [
   "주변에 적이 아무도 없으면 투사체의 데미지가 40% 증가합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "결투의 대가",
  "grade": "unique",
  "engravings": [
   "결투",
   "처형"
  ],
  "description": [
   "물리공격력 및 마법공격력이 25% 증가합니다. 주변에 적이 2명 이하면 55% 더 증가합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "고행자의 심장",
  "grade": "unique",
  "engravings": [
   "성물",
   "복수"
  ],
  "description": [
   "최대체력이 150 증가합니다.",
   "현재 체력이 50% 이상일 시 체력이 지속적으로 감소합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "그을린 자마다르",
  "grade": "unique",
  "engravings": [
   "암기",
   "방화"
  ],
  "description": [
   "적에게 기본공격 시 15% 확률로 화상을 부여합니다.",
   "화상 상태의 적에게 화상 부여 시 추가 마법데미지를 입힙니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "금단의 도서",
  "grade": "unique",
  "engravings": [
   "마도구",
   "마나 순환"
  ],
  "description": [
   "마법공격력이 15% 증가합니다.",
   "적에게 스킬로 데미지를 입힐 시 마도서 페이지를 1장 얻습니다.(동일한 대상에게 최대 3장)",
   "마도서 페이지를 500장 모을 시 이 아이템은 '데모노미콘'으로 변합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "끔찍한 칼날 조각",
  "grade": "unique",
  "engravings": [
   "걸작",
   "과다출혈"
  ],
  "description": [
   "출혈 발생 시 4초간 기본공격 시 끔찍한 칼날 조각을 휘둘러 물리데미지를 입힙니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "만개한 칼날 조각",
  "grade": "unique",
  "engravings": [
   "걸작",
   "과다출혈"
  ],
  "description": [
   "출혈 발생 시 4초간 기본공격 시 끔찍한 칼날 조각을 휘둘러 물리데미지를 입히고 10% 확률로 상처를 부여합니다."
  ],
  "variantOf": "끔찍한 칼날 조각",
  "dlc": false
 },
 {
  "name": "낙인의 의족",
  "grade": "unique",
  "engravings": [
   "결투",
   "추적"
  ],
  "description": [
   "대쉬 시 처음으로 부딪힌 적에게 낙인을 찍습니다.",
   "대쉬 또는 스킬 사용 시 낙인이 찍힌 적에게 추가 마법데미지를 입힙니다.",
   "낙인이 찍힌 적이 존재할 시 다른 적에게 낙인을 찍을 수 없습니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "난투의 대가",
  "grade": "unique",
  "engravings": [
   "난투",
   "처형"
  ],
  "description": [
   "물리공격력 및 마법공격력이 25% 증가합니다. 주변에 적이 4명 이상이면 55% 더 증가합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "날개갑주",
  "grade": "unique",
  "engravings": [
   "요새",
   "비상"
  ],
  "description": [
   "공중에 있을 시 받는 데미지가 35% 감소하고 스킬 쿨다운 속도가 50% 증가합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "도적의 흑철단검",
  "grade": "unique",
  "engravings": [
   "암기",
   "신속"
  ],
  "description": [
   "적을 공격할 때마다 2초간 치명타 확률이 2% 증가합니다.",
   "이 효과는 20회까지 중첩됩니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "돌가면",
  "grade": "unique",
  "engravings": [
   "보물",
   "골동품"
  ],
  "description": [
   "보유중인 스컬 중 등급이 가장 높은 스컬의 등급에 따라 금화 획득량이 (20% / 30% / 40% / 50%) 증가합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "레오니아의 은총",
  "grade": "unique",
  "engravings": [
   "지혜",
   "성물"
  ],
  "description": [
   "30초마다 20의 방어막을 얻습니다.",
   "이 방어막이 유지되는 동안 마법 공격력이 70% 증가하고",
   "5초마다 주변 적을 향해 세례의 구체가 발사 되어 마법데미지를 입힙니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "마공학 몽둥이",
  "grade": "unique",
  "engravings": [
   "마공학",
   "강타"
  ],
  "description": [
   "스킬 3회 사용 후 적에게 기본공격 시 3초간 기본공격이 치명타로 적중합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "마공학 순환장치",
  "grade": "unique",
  "engravings": [
   "마공학",
   "마나 순환"
  ],
  "description": [
   "스킬 사용 시 현재 쿨다운 중인 다른 스킬의 쿨타임이 2초 감소합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "마공학 스태프",
  "grade": "unique",
  "engravings": [
   "마공학",
   "불운"
  ],
  "description": [
   "스킬 사용 시 8초간 마법공격력이 10% 증가합니다. (최대 60% 증가)",
   "이 아이템의 효과가 최대치에 도달하면 치명타 확률이 20% 증가합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "마나건틀렛",
  "grade": "unique",
  "engravings": [
   "마도구",
   "신속"
  ],
  "description": [
   "기본공격 시 5초간 마법공격력이 5% 증가합니다. (최대 75% 증가)",
   "아이템의 효과가 최대치에 도달하면 적에게 기본공격 시 추가 마법데미지를 입힙니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "마나의 뼈",
  "grade": "unique",
  "engravings": [
   "뼈",
   "지혜"
  ],
  "description": [
   "스킬 사용 시 자신을 감싸는 마나 폭풍을 일으켜 마법데미지를 입힙니다.",
   "보유한 밸런스 타입 스컬 개수에 따라 마나폭풍의 데미지와 범위가 (20%/60%) 증가합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "영원의 뼈: 마나",
  "grade": "unique",
  "engravings": [
   "뼈",
   "지혜"
  ],
  "description": [
   "스킬 사용 시 자신을 감싸는 마나 폭풍을 일으켜 마법데미지를 입힙니다.",
   "보유한 밸런스 타입 스컬 개수에 따라 마나폭풍의 데미지와 범위가 (20%/60%) 증가합니다.",
   "뼈 각인 효과 발동 시 더욱 강력한 마나 폭풍이 추가로 발생하여 마법데미지를 입힙니다."
  ],
  "variantOf": "마나의 뼈",
  "dlc": false
 },
 {
  "name": "마나이터",
  "grade": "unique",
  "engravings": [
   "암기",
   "마나 순환"
  ],
  "description": [
   "스킬 사용 후 기본공격 시 마나이터로 찔러 전방의 적에게 추가 물리데미지를 입힙니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "마녀의 비약",
  "grade": "unique",
  "engravings": [
   "고대의 힘",
   "돌연변이"
  ],
  "description": [
   "교대 시 물리 공격력이 85% 증가하고 공격속도와 이동속도가 120% 증가하고 5초에 걸쳐 효과가 사라집니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "마법사의 마나팔찌",
  "grade": "unique",
  "engravings": [
   "가보",
   "지혜"
  ],
  "description": [
   "스킬 6회 사용 시 10초간 스킬 쿨다운 속도가 120% 증가합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "마법의 회중시계",
  "grade": "unique",
  "engravings": [
   "골동품",
   "돌연변이"
  ],
  "description": [
   "스킬 쿨다운 속도가 70% 증가합니다.",
   "교대 시 12초간 정신집중 속도가 100% 증가합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "목각상",
  "grade": "unique",
  "engravings": [
   "가보",
   "걸작"
  ],
  "description": [
   "스킬 쿨다운 속도가 100% 증가합니다.",
   "피격 시 10초간 이 아이템의 효과가 사라집니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "공포의 목각상",
  "grade": "unique",
  "engravings": [
   "가보",
   "걸작"
  ],
  "description": [
   "스킬 쿨다운 속도가 120% 증가하고 공격속도가 30% 증가합니다.",
   "피격 시 10초간 이 아이템의 효과가 사라집니다."
  ],
  "variantOf": "목각상",
  "dlc": false
 },
 {
  "name": "묵주",
  "grade": "unique",
  "engravings": [
   "성물",
   "비상"
  ],
  "description": [
   "공중에 있을 시 물리공격력 및 마법공격력이 70% 증가합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "물의 정령 운디네",
  "grade": "unique",
  "engravings": [
   "동화",
   "절대영도"
  ],
  "description": [
   "물의 정령 운디네가 자신을 따라다니며 25초마다 주변 임의의 적에게 얼음조각을 발사하여 마법데미지를 입히고 빙결을 부여합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "미스릴 보호대",
  "grade": "unique",
  "engravings": [
   "걸작",
   "추적"
  ],
  "description": [
   "적에게 대쉬공격 시 6초간 물리공격력이 8% 증가합니다. (최대 80% 증가)",
   "이 아이템의 효과가 최대치에 도달하면 받는 데미지가 20% 감소합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "절대적 미스릴 보호대",
  "grade": "unique",
  "engravings": [
   "걸작",
   "추적"
  ],
  "description": [
   "적에게 대쉬공격 시 6초간 물리공격력이 8% 증가합니다. (최대 80% 증가)",
   "이 아이템의 효과가 최대치에 도달하면 받는 데미지가 25% 감소하고 물리공격력이 50% 증가합니다."
  ],
  "variantOf": "미스릴 보호대",
  "dlc": false
 },
 {
  "name": "복제 도장",
  "grade": "unique",
  "engravings": [
   "랜덤A",
   "랜덤A"
  ],
  "description": [
   "물리공격력과 마법공격력이 40% 증가합니다. 최대체력이 30 증가합니다.",
   "이 아이템은 임의의 동일한 2개의 각인을 갖습니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "복제 뼈",
  "grade": "unique",
  "engravings": [
   "뼈",
   "뼈"
  ],
  "description": [
   "물리공격력과 마법공격력이 40% 증가합니다. 최대체력이 30 증가합니다.",
   "이 아이템은 임의의 동일한 2개의 각인을 갖습니다.",
   "뼈 각인 효과 발동 15초간 활성화되어 있는 뼈 각인 효과 1개당 적에게 입히는 데미지가 5% 증폭됩니다."
  ],
  "variantOf": "복제 도장",
  "dlc": false
 },
 {
  "name": "복제 복제",
  "grade": "unique",
  "engravings": [
   "걸작",
   "걸작"
  ],
  "description": [
   "보유하고 있는 모든 각인의 개수가 2개 증가합니다.",
   "최대체력이 30 증가합니다.",
   "이 아이템은 임의의 동일한 2개의 각인을 갖습니다."
  ],
  "variantOf": "복제 도장",
  "dlc": false
 },
 {
  "name": "봉인된 검",
  "grade": "unique",
  "engravings": [
   "무구",
   "신속"
  ],
  "description": [
   "물리공격력이 15% 증가합니다.",
   "300명의 적 처치 시 이 아이템은 '마검: 키리온'으로 변합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "불의 정령 샐러맨더",
  "grade": "unique",
  "engravings": [
   "동화",
   "방화"
  ],
  "description": [
   "불의 정령 샐러맨더가 플레이어를 따라다니며 20초마다 주변 적들에게 마법데미지를 입힙니다.",
   "샐러맨더의 공격은 화상을 부여합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "사냥꾼의 나무장궁",
  "grade": "unique",
  "engravings": [
   "불운",
   "강타"
  ],
  "description": [
   "치명타 데미지가 35% 증가합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "사제의 십자가 스태프",
  "grade": "unique",
  "engravings": [
   "성물",
   "골동품"
  ],
  "description": [
   "현재 체력이 30% 이하일 경우 체력이 천천히 회복됩니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "서리거인 가죽",
  "grade": "unique",
  "engravings": [
   "고대의 힘",
   "절대영도"
  ],
  "description": [
   "스킬 사용 시 5초간 서리거인의 보호를 받습니다. (쿨타임: 30초)",
   "서리거인의 보호를 받는 동안 받는 데미지가 30% 감소하며 적에게 빙결 부여 시 20초간 유지되는 10의 방어막을 얻습니다. (최대 20)"
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "서리마녀의 스태프",
  "grade": "unique",
  "engravings": [
   "마도구",
   "절대영도"
  ],
  "description": [
   "적에게 빙결 부여 시 서리 마녀의 마법이 발동 되어 주변 적에게 마법데미지를 입히고 빙결을 부여합니다.",
   "서리마녀의 마법으로 적에게 데미지를 입힐 시 마법공격력이 8% 증가합니다. (최대 80% 증가)"
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "설계자의 흉갑",
  "grade": "unique",
  "engravings": [
   "요새",
   "용기"
  ],
  "description": [
   "스킬 사용 시 1초간 10의 방어막을 얻고 피격 시 2초간 물리공격력이 60% 증가합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "섬록암 서클릿",
  "grade": "unique",
  "engravings": [
   "가보",
   "고대의 힘"
  ],
  "description": [
   "정수로 적에게 데미지를 입힐 시 8초간 마법공격력이 90% 증가합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "성스러운 발자취",
  "grade": "unique",
  "engravings": [
   "성물",
   "추적"
  ],
  "description": [
   "대쉬 시 4초간 스킬 쿨다운 속도가 10% 증가합니다. (최대 50% 증가)",
   "이 아이템의 효과가 최대치에 도달하면 마법공격력이 70% 증가합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "승리의 바톤",
  "grade": "unique",
  "engravings": [
   "처형",
   "돌연변이"
  ],
  "description": [
   "교대시 4초간 마법공격력이 85% 증가하고 이동속도가 50% 증가합니다.",
   "효과가 유지되는 동안 적 처치 시 효과의 지속시간이 초기화됩니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "신속의 뼈",
  "grade": "unique",
  "engravings": [
   "뼈",
   "신속"
  ],
  "description": [
   "적에게 기본 공격 시 물리와 마법 중 더 높은 공격력에 따라 추가 데미지를 입힙니다.",
   "스피드 타입 스컬의 개수에 따라 이 아이템의 효과로 발생하는 추가 데미지가 (25%/75%) 증폭됩니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "영원의 뼈: 신속",
  "grade": "unique",
  "engravings": [
   "뼈",
   "신속"
  ],
  "description": [
   "적에게 기본 공격 시 물리와 마법 중 더 높은 공격력에 따라 추가 데미지를 입힙니다.",
   "스피드 타입 스컬의 개수에 따라 이 아이템의 효과로 발생하는 추가 데미지가 (25%/75%) 증폭됩니다.",
   "뼈 각인 효과 발동 시 15초간 기본공격 시전 속도가 100% 증가합니다."
  ],
  "variantOf": "신속의 뼈",
  "dlc": false
 },
 {
  "name": "여진",
  "grade": "unique",
  "engravings": [
   "난투",
   "현기증"
  ],
  "description": [
   "적에게 기절 부여 시 여진을 일으켜 주변 적에게 마법데미지를 입히고",
   "5초간 스킬 쿨다운 속도가 60% 증가합니다. (쿨타임: 1초)"
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "역병의 석상",
  "grade": "unique",
  "engravings": [
   "걸작",
   "독살"
  ],
  "description": [
   "적에게 중독 부여 시 10초간 물리공격력이 20% 증가합니다. (최대 100% 증가)"
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "진 역병의 석상",
  "grade": "unique",
  "engravings": [
   "걸작",
   "독살"
  ],
  "description": [
   "적에게 중독 부여 시 10초간 물리공격력이 25% 증가합니다. (최대 125% 증가)",
   "5초마다 다음 공격이 중독을 부여합니다."
  ],
  "variantOf": "역병의 석상",
  "dlc": false
 },
 {
  "name": "영광의 손",
  "grade": "unique",
  "engravings": [
   "골동품",
   "결투"
  ],
  "description": [
   "최대체력 10당 물리공격력이 4% 증가합니다. (최대 120% 증가)"
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "오염된 핵",
  "grade": "unique",
  "engravings": [
   "고대의 힘",
   "독살"
  ],
  "description": [
   "맵 입장 시 7초마다 받는 데미지가 8%, 물리공격력이 30% 증가합니다. (각각 최대 40%, 150% 증가, 다음 맵 입장 시 초기화)"
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "용기의 뼈",
  "grade": "unique",
  "engravings": [
   "뼈",
   "용기"
  ],
  "description": [
   "5초마다 적에게 물리공격 시 1초간 적에게 입히는 물리데미지가 20% 증폭됩니다.",
   "보유한 파워 타입 스컬의 개수에 따라 이 아이템의 효과로 증가하는 데미지량이 (40%/80%)로 증가합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "영원의 뼈: 용기",
  "grade": "unique",
  "engravings": [
   "뼈",
   "용기"
  ],
  "description": [
   "5초마다 적에게 물리공격 시 1초간 적에게 입히는 물리데미지가 20% 증폭됩니다.",
   "보유한 파워 타입 스컬의 개수에 따라 이 아이템의 효과로 증가하는 데미지량이 (40%/80%)로 증가합니다.",
   "뼈 각인 효과 발동 시 이 아이템 효과의 쿨타임이 즉시 회복되고 다음 효과 발동 시 물리공격력이 추가로 30% 증폭됩니다."
  ],
  "variantOf": "용기의 뼈",
  "dlc": false
 },
 {
  "name": "용사의 성검",
  "grade": "unique",
  "engravings": [
   "무구",
   "추적"
  ],
  "description": [
   "대쉬 시 2초간 물리공격력이 100% 증가합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "유대감의 증거",
  "grade": "unique",
  "engravings": [
   "골동품",
   "돌연변이"
  ],
  "description": [
   "교대 시 12초간 공격속도가 10%, 치명타 확률이 4% 증가합니다. (각각 최대 50%, 20% 증가)"
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "자라난 의지",
  "grade": "unique",
  "engravings": [
   "골동품",
   "강타"
  ],
  "description": [
   "정신집중 시 10의 방어막을 얻고 방어막에 피격 시 2초간 치명타 확률이 50% 증가합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "전사의 강철메이스",
  "grade": "unique",
  "engravings": [
   "무구",
   "현기증"
  ],
  "description": [
   "적에게 기절 부여 시 물리 추가 데미지를 입히고",
   "추가로 10초간 물리공격력이 40% 증가합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "전승자의 돌",
  "grade": "unique",
  "engravings": [
   "가보",
   "지혜"
  ],
  "description": [
   "보스 처치 시 마법공격력이 30% 증가합니다. (최대 150% 증가)"
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "침묵검",
  "grade": "unique",
  "engravings": [
   "암기",
   "결투"
  ],
  "description": [
   "적의 뒤를 공격 시 데미지가 25% 증폭합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "크레타의 황소",
  "grade": "unique",
  "engravings": [
   "보물",
   "추적"
  ],
  "description": [
   "파워 타입 스컬로 스킬 사용 후 대쉬 시 황소의 형상을 이루며 물리데미지를 입히고 대쉬거리가 증가합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "타락 성자의 로브",
  "grade": "unique",
  "engravings": [
   "성물",
   "복수"
  ],
  "description": [
   "현재 체력이 30 이하면 30초마다 30의 방어막을 얻습니다. 이 방어막이 유지되는 동안 치명타 확률이 30% 증가합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "피를 먹는 검",
  "grade": "unique",
  "engravings": [
   "무구",
   "과다출혈"
  ],
  "description": [
   "출혈 발생 시 물리공격력이 1% 증가합니다.(최대 50% 증가) 이 아이템의 효과가 최대치에 도달할 시 치명타 확률이 20% 증가합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "피를 다 먹은 검",
  "grade": "unique",
  "engravings": [
   "무구",
   "과다출혈"
  ],
  "description": [
   "물리공격력이 50% 증가합니다.",
   "치명타 확률이 20% 증가합니다."
  ],
  "variantOf": "피를 먹는 검",
  "dlc": false
 },
 {
  "name": "필살의 검",
  "grade": "unique",
  "engravings": [
   "무구",
   "독살"
  ],
  "description": [
   "적에게 중독 부여 시 맹독 구체가 생성됩니다.",
   "맹독 구체는 3초 뒤 가시를 뻗어 물리데미지를 입히고, 35% 확률로 중독을 부여합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "화약검",
  "grade": "unique",
  "engravings": [
   "무구",
   "난투"
  ],
  "description": [
   "치명타 시 폭발이 일어나 물리데미지를 입힙니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "화염의 궤",
  "grade": "unique",
  "engravings": [
   "마도구",
   "방화"
  ],
  "description": [
   "화상 상태의 적 공격 시 불길이 솟아올라 주변 적에게 마법데미지를 입힙니다. (쿨타임: 1초)"
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "화약화살",
  "grade": "unique",
  "engravings": [
   "불운",
   "난투"
  ],
  "description": [
   "자신의 투사체가 적에게 히트 시 폭발을 일으켜 물리데미지를 입힙니다.(쿨타임:0.3초)"
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "후폭풍",
  "grade": "unique",
  "engravings": [
   "마공학",
   "처형"
  ],
  "description": [
   "아이템으로 적에게 데미지를 입힐 시 5초간 물리공격력이 90% 증가합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "훈장 보관함",
  "grade": "unique",
  "engravings": [
   "보물",
   "용기"
  ],
  "description": [
   "모험가 처치 시 물리공격력이 20% 증가합니다. (최대 140% 증가)"
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "황금갈기 레이피어",
  "grade": "unique",
  "engravings": [
   "전리품",
   "신속"
  ],
  "description": [
   "공격속도가 20% 증가합니다.",
   "3회 째 기본공격마다 주변의 가장 가까운 적에게 금빛 흉터를 시전하여 물리데미지를 입힙니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "무쇠 갑주",
  "grade": "unique",
  "engravings": [
   "요새",
   "신비"
  ],
  "description": [
   "스킬 사용 시 3초간 5의 방어막을 얻습니다.(최대 15)",
   "보유한 방어막 5당 마법공격력이 10% 증가합니다.(최대 50% 증가)"
  ],
  "variantOf": null,
  "dlc": true
 },
 {
  "name": "병법서",
  "grade": "unique",
  "engravings": [
   "가보",
   "신비"
  ],
  "description": [
   "스킬 사용 후 기본공격 시 5초간 물리공격력이 120% 증가합니다.(쿨타임 10초)",
   "적 처치 시 이 아이템의 효과 쿨타임이 3초 감소합니다."
  ],
  "variantOf": null,
  "dlc": true
 },
 {
  "name": "영광의 성배",
  "grade": "unique",
  "engravings": [
   "마도구",
   "신비"
  ],
  "description": [
   "공격속도 10%당 마법공격력이 4% 증가합니다.",
   "이 아이템의 효과가 최대치에 도달할 시 스킬 시전 속도가 20% 증가합니다."
  ],
  "variantOf": null,
  "dlc": true
 },
 {
  "name": "전사의 투지",
  "grade": "unique",
  "engravings": [
   "복수",
   "신비"
  ],
  "description": [
   "피격 시 투쟁심을 1개 얻습니다.",
   "투쟁심이 3개가 모이면 모든 투쟁심을 소모하고 10초간 불길에 휩싸여 주변 적에게 물리데미지를 입히고 물리공격력이 60% 증가합니다.",
   "불길에 휩싸인 동안에는 투쟁심을 획득할 수 없습니다."
  ],
  "variantOf": null,
  "dlc": true
 },
 {
  "name": "진실의 대궁",
  "grade": "unique",
  "engravings": [
   "강타",
   "신비"
  ],
  "description": [
   "스킬 사용 시 8초간 물리공격력이 10% 증가합니다.(최대 60% 증가)",
   "이 아이템의 효과가 최대치에 도달할 시 치명타 확률이 20% 증가합니다."
  ],
  "variantOf": null,
  "dlc": true
 },
 {
  "name": "까마귀 군주의 깃털",
  "grade": "legendary",
  "engravings": [
   "고대의 힘",
   "돌연변이"
  ],
  "description": [
   "교대 시 주변 적들에게 마법데미지를 입히고 소용돌이의 중심으로 끌어당깁니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "무한의 뼈",
  "grade": "legendary",
  "engravings": [
   "뼈",
   "마나 순환"
  ],
  "description": [
   "스킬 사용 시 40% 확률로 해당 스킬의 쿨타임이 초기화 됩니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "영원의 뼈: 무한",
  "grade": "legendary",
  "engravings": [
   "뼈",
   "마나 순환"
  ],
  "description": [
   "스킬 사용 시 40% 확률로 해당 스킬의 쿨타임이 초기화 됩니다.",
   "뼈 각인 효과 발동 시 15초간 이 효과로 스킬 쿨타임이 초기화될 확률이 60%가 됩니다."
  ],
  "variantOf": "무한의 뼈",
  "dlc": false
 },
 {
  "name": "어둠의 정령 셰이드",
  "grade": "legendary",
  "engravings": [
   "동화",
   "난투"
  ],
  "description": [
   "18초마다 주변 임의의 적 에게 어둠의 세례를 일으켜 마법데미지를 입힙니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "빛의 정령 루",
  "grade": "legendary",
  "engravings": [
   "동화",
   "지혜"
  ],
  "description": [
   "빛의 정령 루가 자신을 따라다니며 18초마다 주변 임의의 적에게 빛의 세례를 내려 마법데미지를 입힙니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "실피드의 날개",
  "grade": "legendary",
  "engravings": [
   "추적",
   "비상"
  ],
  "description": [
   "공중에 있을 시 대쉬 거리 및 대쉬 쿨다운 속도가 50% 증가 합니다.",
   "공중에서 10회 대쉬 시 바람의 칼날을 다수 발사하여 마법데미지를 입힙니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "황천 마력 억제기",
  "grade": "legendary",
  "engravings": [
   "마도구",
   "지혜"
  ],
  "description": [
   "마법공격력이 60% 증가합니다. 스킬 쿨다운 속도 증가량 10%당 마법공격력이 6% 증가합니다. (최대 60% 증가)"
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "희망 절단기",
  "grade": "legendary",
  "engravings": [
   "무구",
   "용기"
  ],
  "description": [
   "물리공격력이 60% 증가합니다. 적에게 입힌 물리데미지에 비례하여 5초간 물리공격력이 최대 60%까지 증가합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "가려진 가면",
  "grade": "legendary",
  "engravings": [
   "결투",
   "강타"
  ],
  "description": [
   "치명타 확률이 20% 감소하고 치명타 데미지가 70% 증가합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "키메라의 독니",
  "grade": "legendary",
  "engravings": [
   "고대의 힘",
   "독살"
  ],
  "description": [
   "중독 상태인 적의 현재 체력이 20% 이하면 해당 적은 사망합니다.(모험가 및 보스의 경우 10%)"
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "마검: 키리온",
  "grade": "legendary",
  "engravings": [
   "무구",
   "신속"
  ],
  "description": [
   "물리공격력이 60% 증가합니다.",
   "기본공격 및 대쉬 시 참격이 발생하여 물리데미지를 입힙니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "데모노미콘",
  "grade": "legendary",
  "engravings": [
   "마도구",
   "마나 순환"
  ],
  "description": [
   "마법공격력이 60% 증가합니다.",
   "스킬 4회 사용 시 데모노미콘에 기록된 3개의 마법 중 하나가 10초간 발동됩니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "고통 & 절망",
  "grade": "legendary",
  "engravings": [
   "암기",
   "신속"
  ],
  "description": [
   "공격속도가 40% 증가합니다. 기본공격, 스킬, 또는 대쉬를 사용할 때마다 2초간 공격속도가 2%, 이동속도가 1% 증가합니다. (각각 최대 40%, 20% 증가)"
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "기적의 잔",
  "grade": "legendary",
  "engravings": [
   "과다출혈",
   "성물"
  ],
  "description": [
   "3번째로 발생하는 출혈의 데미지가 400% 증폭 됩니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "다가오는 죽음",
  "grade": "legendary",
  "engravings": [
   "암기",
   "독살"
  ],
  "description": [
   "중독 상태의 적에게 입히는 데미지가 30% 증폭됩니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "다차원 프리즘",
  "grade": "legendary",
  "engravings": [
   "마공학",
   "돌연변이"
  ],
  "description": [
   "교대 시 다차원 프리즘을 소환합니다. (쿨타임: 10초)",
   "다차원 프리즘은 주변에 무작위로 레이저를 쏜 뒤 폭발하여 물리데미지를 입히고 3개의 마공학 부품을 떨어트립니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "대주교의 성서",
  "grade": "legendary",
  "engravings": [
   "성물",
   "지혜"
  ],
  "description": [
   "스킬 사용 시 주변의 가까운 적에게 천벌이 내려 마법데미지를 입힙니다(쿨타임 30초).",
   "천벌은 주변의 가까운 적을 향해 움직이며 천벌에 피격 된 적은 5초간 받는 마법데미지가 5% 증폭됩니다(최대 50% 증폭)"
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "두려움의 갑옷",
  "grade": "legendary",
  "engravings": [
   "요새",
   "현기증"
  ],
  "description": [
   "기절 상태가 종료될 시 충격파가 발생하여 고정데미지를 입힙니다.",
   "충격파의 데미지는 기절 상태의 적에게 입힌 데미지에 비례합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "면류관",
  "grade": "legendary",
  "engravings": [
   "걸작",
   "불운"
  ],
  "description": [
   "치명타 시 추가 물리데미지를 입힙니다.",
   "이 아이템의 효과로 추가 물리데미지를 입히고 5초 내로 다시 치명타 시",
   "추가 물리데미지의 데미지가 10% 증폭 됩니다. (최대 80% 증폭)"
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "핏빛 면류관",
  "grade": "legendary",
  "engravings": [
   "걸작",
   "불운"
  ],
  "description": [
   "치명타 시 가시가 솟아나 주변 적에게 물리데미지를 입힙니다.",
   "이 아이템의 효과로 물리데미지를 입히고 5초 내로 다시 치명타 시 가시의 물리데미지의 데미지가 10% 증폭됩니다. (최대 120% 증폭)"
  ],
  "variantOf": "면류관",
  "dlc": false
 },
 {
  "name": "부두 인형",
  "grade": "legendary",
  "engravings": [
   "마도구",
   "복수"
  ],
  "description": [
   "죽음에 이르는 데미지를 입을 시 50의 체력을 회복하고 죽음을 극복하며 부두 인형이 찢어집니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "찢겨진 부두 인형",
  "grade": "legendary",
  "engravings": [
   "마도구",
   "복수"
  ],
  "description": [
   "마법공격력이 60% 증가합니다."
  ],
  "variantOf": "부두 인형",
  "dlc": false
 },
 {
  "name": "빙하 파괴자",
  "grade": "legendary",
  "engravings": [
   "처형",
   "절대영도"
  ],
  "description": [
   "빙결 상태의 적에게 입히는 데미지가 30% 증폭됩니다.",
   "빙결 상태의 적에게 데미지를 입힐 시 추가 마법데미지를 입힙니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "심판의 날",
  "grade": "legendary",
  "engravings": [
   "난투",
   "처형"
  ],
  "description": [
   "44초마다 아포칼립스가 발동합니다.",
   "아포칼립스: 모든 스킬의 쿨타임이 11초 감소하고 11초 뒤 폭발을 일으켜 고정데미지를 입힙니다.",
   "폭발의 데미지는 아포칼립스 발동 후 폭발이 일어나기 전까지 적에게 입힌 물리데미지에 비례합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "세계수 씨앗",
  "grade": "legendary",
  "engravings": [
   "고대의 힘",
   "마나 순환"
  ],
  "description": [
   "물리공격력 및 마법공격력이 40% 증가하며 교대 시 세계수를 소환합니다. (쿨타임: 60초)",
   "세계수는 20초간 유지되며 그 주변에 있을 시 물리공격력 및 마법공격력이 70% 증가하고 받는 데미지가 20% 감소합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "욕망의 항아리",
  "grade": "legendary",
  "engravings": [
   "보물",
   "골동품"
  ],
  "description": [
   "보유중인 레전더리 등급의 스컬, 정수, 아이템 1개당 물리공격력 및 마법공격력이 30% 증가합니다. (최대 120% 증가) 이 아이템의 효과가 최대치에 도달할 시 임의의 레전더리 등급의 아이템을 1개 얻습니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "저주받은 잔불",
  "grade": "legendary",
  "engravings": [
   "가보",
   "방화"
  ],
  "description": [
   "화상 상태가 해제될 시 잔불이 크게 확산되어 주변 적에게 마법데미지를 입힙니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "짐승왕의 갈기",
  "grade": "legendary",
  "engravings": [
   "고대의 힘",
   "추적"
  ],
  "description": [
   "대쉬 중 접촉한 적에게 짐승왕의 표식을 남깁니다.",
   "표식을 가진 적 공격 시 치명타로 적중하며 추가 물리데미지를 입힌 뒤 표식은 사라집니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "절대반지",
  "grade": "legendary",
  "engravings": [
   "보물",
   "돌연변이"
  ],
  "description": [
   "물리공격력 및 마법공격력이 40% 증가합니다.",
   "공격속도가 30% 증가합니다.",
   "치명타 확률이 10% 증가합니다.",
   "스킬 쿨다운 속도가 50% 증가합니다.",
   "최대체력이 50 증가합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "진홍빛 태양의 여명",
  "grade": "legendary",
  "engravings": [
   "무구",
   "무구"
  ],
  "description": [
   "물리공격력이 100% 증가합니다.",
   "적 공격 시 여명의 진홍빛이 일어나 주변 적에게 물리데미지를 입힙니다. (쿨타임: 50초)"
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "서릿빛 달의 여명",
  "grade": "legendary",
  "engravings": [
   "마도구",
   "마도구"
  ],
  "description": [
   "마법공격력이 100% 증가합니다.",
   "적 공격 시 여명의 서릿빛이 일어나 주변 적에게 마법데미지를 입힙니다. (쿨타임: 50초)"
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "찬란한 여명",
  "grade": "legendary",
  "engravings": [
   "무구",
   "마도구"
  ],
  "description": [
   "물리공격력 및 마법공격력이 80% 증가합니다.",
   "적 공격 시 여명의 빛이 일어나 물리와 마법 중 더 높은 공격력에 따라 주변 적에게 데미지를 입힙니다.(쿨타임 : 50초)"
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "선택받은 마법사의 증표",
  "grade": "legendary",
  "engravings": [
   "마도구",
   "마나 순환"
  ],
  "description": [
   "3개의 불덩어리가 플레이어 주변을 회전하며 마법데미지를 입힙니다.",
   "스킬 사용 시 각각의 불덩어리가 폭발을 일으켜 마법데미지를 입히고 3초간 불덩어리의 회전 속도가 증가합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "선택받은 용사의 서클렛",
  "grade": "legendary",
  "engravings": [
   "골동품",
   "용기"
  ],
  "description": [
   "현재 체력이 15% 이하가 되면 7초간 불굴 상태가 됩니다.(쿨타임: 60초)",
   "불굴 상태일 시 물리공격력이 50% 증폭되고 이동속도가 100% 증가하며 무적 상태가 됩니다.",
   "불굴 상태가 종료될 시 불굴 상태 동안 적에게 입힌 물리데미지에 비례하여 체력을 회복합니다.(최대 30% 회복)"
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "선택받은 전사의 내갑",
  "grade": "legendary",
  "engravings": [
   "요새",
   "골동품"
  ],
  "description": [
   "맵 입장시 20의 방어막을 얻습니다. 보스방 입장시 40의 방어막을 얻습니다.(최대 100)"
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "선택받은 도적의 쌍검",
  "grade": "legendary",
  "engravings": [
   "암기",
   "추적"
  ],
  "description": [
   "적에게 첫 공격시 표식을 남깁니다. 공격받은 적은 행동이 느려지고 공격속도가 100% 증가합니다.",
   "적의 시간이 원래대로 돌아오면, 느려진 동안 입힌 피해에 비례하여 고정 피해를 줍니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "선택받은 사냥꾼의 화살",
  "grade": "legendary",
  "engravings": [
   "가보",
   "강타"
  ],
  "description": [
   "치명타 확률이 25% 증가합니다.",
   "치명타 확률 1%당 물리공격력 및 마법공격력이 2% 증가합니다. (최대 400% 증가)"
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "선택받은 사제의 서적",
  "grade": "legendary",
  "engravings": [
   "성물",
   "처형"
  ],
  "description": [
   "10명의 적 처치시 체력을 1 회복합니다. 체력 회복시 12초간 유지되는 성인의 날개가 현현합니다.",
   "성인의 날개가 현현한 동안 물리공격력 및 마법공격력이 80% 증가하고 이동속도가 50% 증가하며 1초마다 주변 임의의 적에게 천벌을 내립니다.",
   "천벌은 물리와 마법 중 더 높은 공격력에 따라 데미지를 입힙니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "황금왕의 가호",
  "grade": "legendary",
  "engravings": [
   "보물",
   "보물"
  ],
  "description": [
   "보유하고 있는 모든 각인의 개수가 1개 증가합니다. 교대 쿨다운 속도가 30% 증가합니다. 피격 시 해당 데미지를 무효화시키고 5초간 무적 상태가 됩니다. (쿨타임 : 25초)"
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "황금왕의 심판",
  "grade": "legendary",
  "engravings": [
   "보물",
   "보물"
  ],
  "description": [
   "보유하고 있는 모든 각인의 개수가 1개 증가합니다. 물리공격력 및 마법공격력이 100% 증가합니다. 적 공격 시 왕의 일격을 가하여 물리와 마법 중 더 높은 공격력에 따라 데미지를 입힙니다. (쿨타임 : 15초)"
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "황금왕의 은총",
  "grade": "legendary",
  "engravings": [
   "보물",
   "보물"
  ],
  "description": [
   "보유하고 있는 모든 각인의 개수가 1개 증가합니다. 스킬 쿨다운, 공격, 이동 속도가 45% 증가합니다. 스킬 사용 시 해당 스킬의 쿨타임이 75% 반환되고 10초간 공격속도 및 이동속도가 45% 증가합니다(쿨타임 : 15초)"
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "꺾이지 않는 긍지",
  "grade": "legendary",
  "engravings": [
   "결투",
   "신비"
  ],
  "description": [
   "물리공격력 및 마법공격력이 50% 증가합니다.",
   "자신에게 불길이 피어오릅니다.",
   "불길은 적에게 접촉 시 물리 또는 마법 중 더 높은 공격력에 따라 데미지를 입히고",
   "사라지며 3초 뒤 다시 피어오릅니다.",
   "동일한 적에게 5회 연속으로 불길을 옮길 시 해당 적과 자신에게 불기둥이 솟아",
   "올라 주변 적에게 물리 또는 마법 중 더 높은 공격력에 따라 데미지를 입힙니다."
  ],
  "variantOf": null,
  "dlc": true
 },
 {
  "name": "먹구름",
  "grade": "legendary",
  "engravings": [
   "마공학",
   "신비"
  ],
  "description": [
   "스킬 사용 시 충전을 20 얻습니다. (최대 100)",
   "충전은 매초 1씩 감소하며 기본공격 시 보유한 충전만큼의 확률로 주변 임의의 적에게 벼락을 떨어트려 마법데미지를 입힙니다.",
   "충전이 최대치에 도달할 시 7초간 궁극 충전 상태가 되어 충전이 감소하지 않고 벼락이 강화됩니다. (쿨타임: 15초)"
  ],
  "variantOf": null,
  "dlc": true
 },
 {
  "name": "별빛이 깃든 병",
  "grade": "legendary",
  "engravings": [
   "동화",
   "신비"
  ],
  "description": [
   "마법공격력이 55% 증가합니다.",
   "공격속도가 45% 증가합니다.",
   "호수의 정령 니뮤에가 사라지면 호수를 담은 병으로 돌아갑니다."
  ],
  "variantOf": null,
  "dlc": true
 },
 {
  "name": "올리브 나무 곤봉",
  "grade": "legendary",
  "engravings": [
   "용기",
   "신비"
  ],
  "description": [
   "4개의 과업이 주어지며 완수한 과업에 따라 이로운 효과를 얻습니다.",
   "체력 500 상실: 최대 체력 80 증가.",
   "적 100명 처치: 스킬 사용 지점에 지진 발생.",
   "보스 3명 처치: 물리공격력 100% 증가.",
   "죽음 1회 이상 극복: 받는 피해 20% 감소, 모든 피해 20% 증폭. 획득 전 기록도 반영합니다."
  ],
  "variantOf": null,
  "dlc": true
 },
 {
  "name": "전장의 술잔",
  "grade": "legendary",
  "engravings": [
   "걸작",
   "신비"
  ],
  "description": [
   "스킬 사용 후 적에게 기본 공격 시 참격을 일으켜 물리 데미지를 입힙니다.",
   "참격은 체력이 50% 이하인 적에게 50% 더 높은 데미지를 입힙니다."
  ],
  "variantOf": null,
  "dlc": true
 },
 {
  "name": "식지 않는 술잔",
  "grade": "legendary",
  "engravings": [
   "걸작",
   "신비"
  ],
  "description": [
   "스킬 사용 후 적에게 기본 공격 시 참격을 일으켜 물리 데미지를 입힙니다.",
   "참격은 체력이 50% 이하인 적에게 50% 더 높은 데미지를 입힙니다.",
   "주변의 적 수에따라 아래와 같은 효과를 얻습니다.",
   "1명: 참격의 데미지가 50% 증폭 됩니다.",
   "4명 이상: 참격이 더욱 커집니다."
  ],
  "variantOf": "전장의 술잔",
  "dlc": true
 },
 {
  "name": "종막의 마검",
  "grade": "legendary",
  "engravings": [
   "지혜",
   "신비"
  ],
  "description": [
   "공격속도가 35% 증가합니다.",
   "4번째 기본공격 시 검기를 날려 마법데미지를 입힙니다.",
   "4번째로 검기를 날릴 시 한 번에 7개의 검기를 날립니다."
  ],
  "variantOf": null,
  "dlc": true
 },
 {
  "name": "호수의 정령 니뮤에",
  "grade": "legendary",
  "engravings": [
   "동화",
   "절대영도"
  ],
  "description": [
   "마법공격력이 55% 증가합니다.",
   "호수의 정령 니뮤에가 자신을 따라다니며 20초마다 주변 임의의 적에게 진눈깨비를 날려 마법데미지를 입히고 빙결을 부여합니다.",
   "별빛을 담은 병이 사라지면 물의 정령 운디네로 돌아갑니다."
  ],
  "variantOf": null,
  "dlc": true
 },
 {
  "name": "흉조: 갈망의 잔",
  "grade": "omen",
  "engravings": [
   "흉조",
   "걸작"
  ],
  "description": [
   "보유중인 걸작 각인 1개당 물리공격력이 40% 증가합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "흉조: 운명의 잔",
  "grade": "omen",
  "engravings": [
   "흉조",
   "걸작"
  ],
  "description": [
   "보유중인 걸작 각인 1개 당 물리공격력이 60% 증가합니다.",
   "걸작 각인을 가진 아이템을 파괴할 때마다 물리공격력이 50% 증가합니다.(최대 500% 증가)"
  ],
  "variantOf": "흉조: 갈망의 잔",
  "dlc": false
 },
 {
  "name": "흉조: 거부할 수 없는 제안",
  "grade": "omen",
  "engravings": [
   "흉조",
   "용기"
  ],
  "description": [
   "물리공격력이 100% 증가합니다.",
   "1회 이상 죽음을 극복하면 효과가 2배로 적용됩니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "흉조: 광기 어린 작살",
  "grade": "omen",
  "engravings": [
   "흉조",
   "결투"
  ],
  "description": [
   "적 공격 시 표식을 남기며 표식을 가진 적에게 입히는 데미지가 45% 증폭됩니다.",
   "표식은 최대 한 명의 적에게 남길 수 있으며 표식을 가진 적이 사망하기 전까지",
   "다른 적에게 표식을 남길 수 없습니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "흉조: 디셰이어",
  "grade": "omen",
  "engravings": [
   "흉조",
   "동화"
  ],
  "description": [
   "흉조의 정령 디셰이어가 자신을 따라다니며 16초마다 주변의 모든 적에게 흉조의 악몽을 일으켜 마법데미지를 입힙니다.",
   "적에게 정령으로 입히는 데미지가 35% 증폭됩니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "흉조: 망국의 주화",
  "grade": "omen",
  "engravings": [
   "흉조",
   "마나 순환"
  ],
  "description": [
   "플레이어는 '흉', '재' 두 가지 상태가 될 수 있으며 스킬을 사용할 때마다 상태가 변환됩니다.",
   "'흉' 상태일 시 적에게 스킬로 입히는 데미지가 40% 증폭됩니다.",
   "'재' 상태일 시 스킬 쿨다운 속도가 130% 증가합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "흉조: 멸망의 가지",
  "grade": "omen",
  "engravings": [
   "흉조",
   "처형"
  ],
  "description": [
   "적에게 데미지를 입힐수록 멸망의 가지가 자라납니다.",
   "멸망의 가지가 완전한 형태를 이룬 뒤 스킬 사용 시 멸망의 가지가 뻗어나가 주변 적에게 물리와 마법 중 더 높은 공격력에 따라 데미지를 입힙니다.",
   "멸망의 가지는 체력이 30% 이하인 적과 20% 이하인 모험가 및 보스에게 50% 더 높은 데미지를 입힙니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "흉조: 미지의 어둠",
  "grade": "omen",
  "engravings": [
   "흉조",
   "흉조"
  ],
  "description": [
   "물리공격력 및 마법공격력이 250% 증가합니다.",
   "죽음에 이르는 데미지를 입을 시 1의 체력을 회복하고 죽음을 극복하며 3초간 무적 상태가 됩니다.",
   "이 효과는 50명의 적을 처치할 때까지 다시 활성화되지 않습니다.",
   "이 효과가 발동될 때마다 물리공격력 및 마법공격력이 추가로 100% 증가합니다.(최대 400% 증가)"
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "흉조: 붉은 별의 계시록",
  "grade": "omen",
  "engravings": [
   "흉조",
   "난투"
  ],
  "description": [
   "적 공격 시 붉은 별의 영역이 전개됩니다. (쿨타임: 10초)",
   "붉은 별의 영역은 주변의 적을 끌어당기며 2초 뒤에 파국의 빛과 함께 사라집니다.",
   "파국의 빛은 물리와 마법 중 더 높은 공격력에 따라 데미지를 입히며 붉은 별의 영역 안에 있는 적 1명 당 20% 더 높은 데미지를 입힙니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "흉조: 속삭임의 왕홀",
  "grade": "omen",
  "engravings": [
   "흉조",
   "마도구"
  ],
  "description": [
   "5초마다 주변 임의의 적에게 흉조의 가시가 솟아나 마법데미지를 입힙니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "흉조: 신 학살의 검",
  "grade": "omen",
  "engravings": [
   "흉조",
   "암기"
  ],
  "description": [
   "대쉬로 적의 공격을 회피한 뒤 1초 내로 기본공격 시 주변의 가까운 적에게 이동하여 암습을 가해 물리와 마법 중 더 높은 공격력에 따라 데미지를 입힙니다.",
   "암습을 당한 적은 5초간 받는 데미지가 50% 증폭됩니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "흉조: 어둠 파편",
  "grade": "omen",
  "engravings": [
   "흉조",
   "해와 달"
  ],
  "description": [
   "물리공격력 및 마법공격력이 80% 증가합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "흉조: 열세 번째 뼈",
  "grade": "omen",
  "engravings": [
   "흉조",
   "뼈"
  ],
  "description": [
   "보유중인 흉조 각인 1개당 물리공격력 및 마법공격력 이 110% 증가합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "영원의 뼈: 흉조",
  "grade": "omen",
  "engravings": [
   "흉조",
   "뼈"
  ],
  "description": [
   "보유중인 흉조 각인 1개당 물리공격력 및 마법공격력 이 110% 증가합니다.",
   "뼈 각인 효과 발동 후 적 공격 시 흉조의 저주를 가하여 물리와 마법 중 더 높은 공격력에 따라 데미지를 입힙니다.",
   "보유한 흉조 각인 1개당 흉조의 저주 데미지가 13% 증가합니다."
  ],
  "variantOf": "흉조: 열세 번째 뼈",
  "dlc": false
 },
 {
  "name": "흉조: 영혼살해자",
  "grade": "omen",
  "engravings": [
   "흉조",
   "신속"
  ],
  "description": [
   "기본공격 시 영혼살해자를 휘둘러 물리와 마법 중 더 높은 공격력에 따라 데미지를 입힙니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "흉조: 울부짖는 알",
  "grade": "omen",
  "engravings": [
   "흉조",
   "지혜"
  ],
  "description": [
   "마법공격력이 100% 증가합니다.",
   "1회 이상 죽음을 극복하면 효과가 2배로 적용됩니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "흉조: 월식",
  "grade": "omen",
  "engravings": [
   "흉조",
   "마도구"
  ],
  "description": [
   "마법공격력이 180% 증가합니다.",
   "죽음에 이르는 데미지를 입을 시 1의 체력을 회복하고 죽음을 극복하며 3초간 무적 상태가 됩니다.",
   "이 효과는 50명의 적을 처치할 때까지 다시 활성화되지 않습니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "흉조: 일식",
  "grade": "omen",
  "engravings": [
   "흉조",
   "무구"
  ],
  "description": [
   "물리공격력이 180% 증가합니다.",
   "죽음에 이르는 데미지를 입을 시 1의 체력을 회복하고 죽음을 극복하며 3초간 무적 상태가 됩니다.",
   "이 효과는 50명의 적을 처치할 때까지 다시 활성화되지 않습니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "흉조: 잊혀진 자의 우상",
  "grade": "omen",
  "engravings": [
   "흉조",
   "돌연변이"
  ],
  "description": [
   "교대 시 주변의 모든 지면에 흉조의 기운이 드리우며 물리와 마법 중 더 높은 공격력에 따라 데미지를 입힙니다.",
   "흉조의 기운은 교대스킬 판정을 갖습니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "흉조: 죽음의 상징",
  "grade": "omen",
  "engravings": [
   "흉조",
   "불운"
  ],
  "description": [
   "치명타 시 해당 적 주변에 죽음의 화살이 생성되며 죽음의 화살이 5개가 모이면 모든 죽음의 화살이 해당 적을 향해 발사됩니다.",
   "죽음의 화살은 물리와 마법 중 더 높은 공격력에 따라 데미지를 입힙니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "흉조: 타락검",
  "grade": "omen",
  "engravings": [
   "흉조",
   "강타"
  ],
  "description": [
   "스킬 사용 시 10초간 유지되는 타락의 영역을 전개합니다.(쿨타임: 20초)",
   "타락의 영역 내에 있는 적에게 가하는 모든 공격이 치명타로 적중합니다."
  ],
  "variantOf": null,
  "dlc": false
 },
 {
  "name": "흉조: 혼돈",
  "grade": "omen",
  "engravings": [
   "흉조",
   "무구"
  ],
  "description": [
   "기본공격 시 전방의 지면에서 흉조의 가시가 솟아나 물리데미지를 입힙니다.(쿨타임: 3초)"
  ],
  "variantOf": null,
  "dlc": false
 }
];

export const ENGRAVINGS = [
 {
  "name": "강타",
  "category": "능력치 각인",
  "moddable": true,
  "tiers": [
   {
    "kind": "기본",
    "count": 2,
    "effect": [
     "치명타 데미지가 20% 증가합니다."
    ],
    "note": null
   },
   {
    "kind": "기본",
    "count": 4,
    "effect": [
     "치명타 시 30% 확률로 더욱 치명적인 강타를 가합니다."
    ],
    "note": null
   },
   {
    "kind": "개조",
    "count": 4,
    "effect": [
     "치명타 시 10% 확률로 더더욱 치명적인 강타를 가합니다."
    ],
    "note": null
   }
  ]
 },
 {
  "name": "고대의 힘",
  "category": "능력치 각인",
  "moddable": true,
  "tiers": [
   {
    "kind": "기본",
    "count": 1,
    "effect": [
     "정수 쿨다운 속도가 45% 증가합니다."
    ],
    "note": null
   },
   {
    "kind": "기본",
    "count": 3,
    "effect": [
     "정수 사용시 3초간 적에게 입히는 데미지가 25% 증폭됩니다.(쿨타임 : 20초)"
    ],
    "note": null
   },
   {
    "kind": "개조",
    "count": 3,
    "effect": [
     "정수 사용 시 10초간 선조의 불꽃이 자신을 감싸 물리공격력 및 마법공격력이 75% 증가합니다.",
     "선조의 불꽃이 적에게 닿을 시 보유한 정수 쿨타임에 비례하여 물리와 마법 중 더 높은 공격력에 따라 데미지를 입힙니다."
    ],
    "note": null
   }
  ]
 },
 {
  "name": "골동품",
  "category": "능력치 각인",
  "moddable": true,
  "tiers": [
   {
    "kind": "기본",
    "count": 2,
    "effect": [
     "최대체력이 35 증가합니다."
    ],
    "note": null
   },
   {
    "kind": "기본",
    "count": 4,
    "effect": [
     "현재 체력이 70% 이상일 시 받는 데미지가 45% 감소합니다."
    ],
    "note": null
   },
   {
    "kind": "개조",
    "count": 4,
    "effect": [
     "최대체력 10당 물리공격력 및 마법공격력이 3% 증가합니다.(최대 150% 증가)"
    ],
    "note": null
   }
  ]
 },
 {
  "name": "돌연변이",
  "category": "능력치 각인",
  "moddable": true,
  "tiers": [
   {
    "kind": "기본",
    "count": 1,
    "effect": [
     "교대 쿨다운 속도가 45% 증가합니다."
    ],
    "note": null
   },
   {
    "kind": "기본",
    "count": 3,
    "effect": [
     "현재 스컬의 등급에 따라 교대스킬로 적에게 입히는 피해가 증폭 됩니다.(35% / 45%/ 55%/ 65%)"
    ],
    "note": null
   },
   {
    "kind": "개조",
    "count": 3,
    "effect": [
     "교대 시 15초간 물리공격력 및 마법공격력이 25% 증가하고 공격속도가 15% 증가합니다. (각각 최대 125%, 75% 증가)",
     "교대 시 25% 확률로 교대 쿨타임이 초기화됩니다."
    ],
    "note": null
   }
  ]
 },
 {
  "name": "마공학",
  "category": "능력치 각인",
  "moddable": true,
  "tiers": [
   {
    "kind": "기본",
    "count": 1,
    "effect": [
     "스킬 사용 시 마공학 부품이 2개 떨어집니다. 마공학 부품 획득 시 모든 스킬의 쿨타임이 0.5초 감소합니다."
    ],
    "note": null
   },
   {
    "kind": "기본",
    "count": 3,
    "effect": [
     "스킬 시전 속도가 100% 증가합니다. 스킬 사용 시 마공학 부품이 4개 떨어집니다."
    ],
    "note": null
   },
   {
    "kind": "개조",
    "count": 3,
    "effect": [
     "스킬 사용시 30%의 확률로 마공학 부품 대신 마공학 핵이 드랍됩니다.",
     "마공학 핵 획득시 즉시 모든 스킬 쿨타임이 초기화됩니다."
    ],
    "note": null
   }
  ]
 },
 {
  "name": "마나 순환",
  "category": "능력치 각인",
  "moddable": true,
  "tiers": [
   {
    "kind": "기본",
    "count": 2,
    "effect": [
     "스킬 쿨다운 속도가 50% 증가합니다."
    ],
    "note": null
   },
   {
    "kind": "기본",
    "count": 4,
    "effect": [
     "스킬로 적에게 입히는 데미지가 30% 증폭됩니다."
    ],
    "note": null
   },
   {
    "kind": "개조",
    "count": 4,
    "effect": [
     "스킬 사용시 10초간 유지 되는 마나 순환이 발생하여 물리와 마법 중 더 높은 공격력에 따라 데미지를 입힙니다.",
     "마나 순환은 스킬공격 판정을 가지며 중첩되어 발생할 시 데미지가 25% 증가합니다.(최대 200%)"
    ],
    "note": null
   }
  ]
 },
 {
  "name": "마도구",
  "category": "능력치 각인",
  "moddable": true,
  "tiers": [
   {
    "kind": "기본",
    "count": 2,
    "effect": [
     "마법공격력이 45% 증가합니다."
    ],
    "note": null
   },
   {
    "kind": "기본",
    "count": 4,
    "effect": [
     "6초마다 주변 임의의 적에게 운석이 떨어져 마법데미지를 입힙니다."
    ],
    "note": null
   },
   {
    "kind": "기본",
    "count": 6,
    "effect": [
     "5번째로 운석이 떨어질 시 다수의 운석이 떨어집니다."
    ],
    "note": null
   },
   {
    "kind": "개조",
    "count": 6,
    "effect": [
     "5번째로 운석이 떨어질 때 보다 더 많은 운석과 함께 하나의 크고 강력한 운석이 떨어집니다."
    ],
    "note": null
   }
  ]
 },
 {
  "name": "무구",
  "category": "능력치 각인",
  "moddable": true,
  "tiers": [
   {
    "kind": "기본",
    "count": 2,
    "effect": [
     "물리공격력이 45% 증가합니다."
    ],
    "note": null
   },
   {
    "kind": "기본",
    "count": 4,
    "effect": [
     "기본공격시 무구를 휘둘러 물리데미지를 입힙니다. (쿨타임 4초)"
    ],
    "note": null
   },
   {
    "kind": "기본",
    "count": 6,
    "effect": [
     "3번째로 휘두르는 무구가 강화됩니다."
    ],
    "note": null
   },
   {
    "kind": "개조",
    "count": 6,
    "effect": [
     "3번째 강화 공격이 더 강화됩니다"
    ],
    "note": null
   }
  ]
 },
 {
  "name": "불운",
  "category": "능력치 각인",
  "moddable": true,
  "tiers": [
   {
    "kind": "기본",
    "count": 2,
    "effect": [
     "치명타 확률이 15% 증가합니다."
    ],
    "note": null
   },
   {
    "kind": "기본",
    "count": 4,
    "effect": [
     "치명타 시 7초간 적에게 가하는 공격이 치명타로 적중합니다. (쿨타임: 25초)"
    ],
    "note": null
   },
   {
    "kind": "개조",
    "count": 4,
    "effect": [
     "불운 각인 4개의 효과의 지속시간이 15초로 늘어납니다."
    ],
    "note": null
   }
  ]
 },
 {
  "name": "신속",
  "category": "능력치 각인",
  "moddable": true,
  "tiers": [
   {
    "kind": "기본",
    "count": 2,
    "effect": [
     "기본 공격 또는 대쉬 시 5초간 공격속도가 6%증가하고 기본 공격으로 적에게 입히는 데미지가 3% 증폭 됩니다.(최대 30% 증가, 15% 증폭)"
    ],
    "note": null
   },
   {
    "kind": "기본",
    "count": 4,
    "effect": [
     "기본공격을 2초안에 5회 시전시 연격이 발생하여 물리와 마법 중 더 높은 공격력에 따라 데미지를 입힙니다(쿨타임 : 2초) 연격은 기본 공격 판정을 갖습니다."
    ],
    "note": null
   },
   {
    "kind": "개조",
    "count": 4,
    "effect": [
     "연격이 더 강해집니다."
    ],
    "note": null
   }
  ]
 },
 {
  "name": "용기",
  "category": "능력치 각인",
  "moddable": true,
  "tiers": [
   {
    "kind": "기본",
    "count": 2,
    "effect": [
     "물리공격력이 20% 증폭됩니다."
    ],
    "note": null
   },
   {
    "kind": "기본",
    "count": 4,
    "effect": [
     "적에게 물리데미지를 입힐 시 물리공격력이 10초간 45% 증폭됩니다.(쿨타임 20초)"
    ],
    "note": null
   },
   {
    "kind": "개조",
    "count": 4,
    "effect": [
     "용기 각인 4개 효과가 쿨다운되는 동안 물리공격력이 최대 30%까지 서서히 증폭됩니다."
    ],
    "note": null
   }
  ]
 },
 {
  "name": "지혜",
  "category": "능력치 각인",
  "moddable": true,
  "tiers": [
   {
    "kind": "기본",
    "count": 2,
    "effect": [
     "마법공격력이 20% 증폭됩니다."
    ],
    "note": null
   },
   {
    "kind": "기본",
    "count": 4,
    "effect": [
     "적에게 마법데미지를 입힐 시 10초간 마법공격력이 45% 증폭됩니다. (쿨타임: 20초)"
    ],
    "note": null
   },
   {
    "kind": "개조",
    "count": 4,
    "effect": [
     "지혜 각인 4개 효과가 쿨다운되는 동안 마법공격력이 최대 30%까지 서서히 증폭됩니다."
    ],
    "note": null
   }
  ]
 },
 {
  "name": "신비",
  "category": "능력치 각인",
  "moddable": true,
  "tiers": [
   {
    "kind": "기본",
    "count": 2,
    "effect": [
     "20초간 유지되는 임의의 권능을 얻습니다.",
     "힘의 권능: 물리공격력 및 마법공격력이 60% 증가합니다.",
     "속도의 권능: 스킬 쿨다운 40%, 공격속도 40%, 이동속도가 20% 증가합니다.",
     "정신의 권능: 2초마다 주변 임의의 적에게 정신의 파동이 발생하여 물리와 마법 중 더 높은 공격력에 따라 데미지를 입힙니다."
    ],
    "note": null
   },
   {
    "kind": "기본",
    "count": 4,
    "effect": [
     "권능을 얻을 때 광명을 비추어 주변 넓은 범위의 적에게 물리와 마법 중 더 높은 공격력에 따라 데미지를 입힙니다.",
     "광명에 피격된 적은 10초간 받는 데미지가 20% 증폭됩니다."
    ],
    "note": null
   },
   {
    "kind": "개조",
    "count": 4,
    "effect": [
     "3번째로 권능을 얻을 때마다 해당 권능의 효과가 2배가 되고 광명이 강화됩니다."
    ],
    "note": null
   }
  ]
 },
 {
  "name": "죄",
  "category": "능력치 각인",
  "moddable": false,
  "tiers": [
   {
    "kind": "기본",
    "count": 1,
    "effect": [
     "적에게 입히는 데미지가 10% 감소 합니다. 적에게 입히는 모든 데미지가 물리와 마법 중 더 높은 공격력에 따라 변합니다."
    ],
    "note": null
   }
  ]
 },
 {
  "name": "흉조",
  "category": "능력치 각인",
  "moddable": false,
  "tiers": [
   {
    "kind": "기본",
    "count": 1,
    "effect": [
     "받는 데미지가 50% 증가 합니다."
    ],
    "note": null
   },
   {
    "kind": "기본",
    "count": 2,
    "effect": [
     "최대 체력이 50% 감소합니다."
    ],
    "note": null
   },
   {
    "kind": "기본",
    "count": 3,
    "effect": [
     "피격으로 체력에 1 이상의 피해를 입을 시 즉사합니다."
    ],
    "note": null
   }
  ]
 },
 {
  "name": "과다출혈",
  "category": "상태이상 각인",
  "moddable": true,
  "tiers": [
   {
    "kind": "기본",
    "count": 1,
    "effect": [
     "기본공격 시 참격으로 전방의 적에게 상처를 부여합니다. (쿨타임: 3초)"
    ],
    "note": null
   },
   {
    "kind": "기본",
    "count": 2,
    "effect": [
     "출혈의 데미지가 60% 증폭됩니다."
    ],
    "note": null
   },
   {
    "kind": "기본",
    "count": 4,
    "effect": [
     "출혈이 치명타로 적중할 수 있게 됩니다."
    ],
    "note": null
   },
   {
    "kind": "개조",
    "count": 4,
    "effect": [
     "35% 확률로 더 센 출혈"
    ],
    "note": null
   }
  ]
 },
 {
  "name": "독살",
  "category": "상태이상 각인",
  "moddable": true,
  "tiers": [
   {
    "kind": "기본",
    "count": 1,
    "effect": [
     "스킬 사용 시 독극물을 퍼트려 주변 적에게 중독을 부여합니다. (쿨타임: 8초)"
    ],
    "note": null
   },
   {
    "kind": "기본",
    "count": 2,
    "effect": [
     "중독 데미지가 발생하는 시간 간격이 감소합니다."
    ],
    "note": null
   },
   {
    "kind": "기본",
    "count": 4,
    "effect": [
     "중독 데미지가 발생하는 시간 간격이 더욱 감소합니다."
    ],
    "note": null
   },
   {
    "kind": "개조",
    "count": 4,
    "effect": [
     "간격이 더 줄어듭니다."
    ],
    "note": null
   }
  ]
 },
 {
  "name": "방화",
  "category": "상태이상 각인",
  "moddable": true,
  "tiers": [
   {
    "kind": "기본",
    "count": 1,
    "effect": [
     "스킬 사용 시 화염구를 발사해 피격된 적에게 화상을 부여합니다. (쿨타임: 10초)"
    ],
    "note": null
   },
   {
    "kind": "기본",
    "count": 2,
    "effect": [
     "화상 상태의 적이 화상으로 주변의 다른 적에게 입히는 데미지가 50% 증폭됩니다."
    ],
    "note": null
   },
   {
    "kind": "기본",
    "count": 4,
    "effect": [
     "화상 상태가 해제될 시 화염 폭풍이 일어나 넓은 범위의 적에게 마법데미지를 입히고 30% 확률로 화상을 부여합니다. (쿨타임: 1초)"
    ],
    "note": null
   },
   {
    "kind": "개조",
    "count": 4,
    "effect": [
     "화상 3중첩 상태시 화염폭발이 일어나 마법데미지를 입힙니다."
    ],
    "note": null
   }
  ]
 },
 {
  "name": "절대영도",
  "category": "상태이상 각인",
  "moddable": true,
  "tiers": [
   {
    "kind": "기본",
    "count": 1,
    "effect": [
     "기본공격 시 지면에서 얼음이 솟아올라 주변 적에게 빙결을 부여합니다. (쿨타임: 15초)"
    ],
    "note": null
   },
   {
    "kind": "기본",
    "count": 2,
    "effect": [
     "빙결의 지속시간이 2초 증가합니다."
    ],
    "note": null
   },
   {
    "kind": "기본",
    "count": 4,
    "effect": [
     "빙결 상태의 적 공격 시 빙결이 해제되는데 필요한 타수가 2 증가하고 빙결이 해제된 적은 5초간 받는 데미지가 15% 증폭 됩니다."
    ],
    "note": null
   },
   {
    "kind": "개조",
    "count": 4,
    "effect": [
     "빙결 해제 시 추가 마법 데미지를 줌"
    ],
    "note": null
   }
  ]
 },
 {
  "name": "현기증",
  "category": "상태이상 각인",
  "moddable": true,
  "tiers": [
   {
    "kind": "기본",
    "count": 1,
    "effect": [
     "스킬 사용 시 충격파를 일으켜 주변 적에게 기절을 부여합니다. (쿨타임: 18초)"
    ],
    "note": null
   },
   {
    "kind": "기본",
    "count": 2,
    "effect": [
     "기절의 지속시간이 1초 증가합니다."
    ],
    "note": null
   },
   {
    "kind": "기본",
    "count": 4,
    "effect": [
     "기절 상태의 적에게 입히는 데미지가 50% 증폭됩니다."
    ],
    "note": null
   },
   {
    "kind": "개조",
    "count": 4,
    "effect": [
     "기절의 지속시간이 1초 더 증가합니다."
    ],
    "note": null
   }
  ]
 },
 {
  "name": "걸작",
  "category": "특수능력 각인(공격)",
  "moddable": false,
  "tiers": [
   {
    "kind": "기본",
    "count": 3,
    "effect": [
     "적에게 물리데미지를 입힐 시 10초간 물리공격력이 70% 증가합니다. (쿨타임: 20초)"
    ],
    "note": null
   },
   {
    "kind": "기본",
    "count": 5,
    "effect": [
     "걸작 각인을 갖는 아이템이 강화됩니다."
    ],
    "note": null
   }
  ]
 },
 {
  "name": "결투",
  "category": "특수능력 각인(공격)",
  "moddable": true,
  "tiers": [
   {
    "kind": "기본",
    "count": 2,
    "effect": [
     "적 공격시 해당 적에게 입히는 데미지가 1.5% 증폭됩니다. (최대 15% 증폭)"
    ],
    "note": null
   },
   {
    "kind": "기본",
    "count": 4,
    "effect": [
     "적에게 입히는 데미지가 최대 45%까지 증폭될 수 있습니다."
    ],
    "note": null
   },
   {
    "kind": "개조",
    "count": 4,
    "effect": [
     "이 효과가 최대치로 적용 된 적 공격 시 7초간 해당 적에게 입히는 데미지가 45% 추가로 증폭됩니다. (쿨타임: 7초)"
    ],
    "note": null
   }
  ]
 },
 {
  "name": "난투",
  "category": "특수능력 각인(공격)",
  "moddable": true,
  "tiers": [
   {
    "kind": "기본",
    "count": 2,
    "effect": [
     "적 공격 시 파동이 발생하여 물리와 마법 중 더 높은 공격력에 따라 주변 적에게 데미지를 입힙니다.",
     "파동은 동일한 대상에게 1초에 3회 발생할 수 있습니다."
    ],
    "note": null
   },
   {
    "kind": "기본",
    "count": 4,
    "effect": [
     "5번째로 발동 되는 파동이 강화 됩니다."
    ],
    "note": null
   },
   {
    "kind": "개조",
    "count": 4,
    "effect": [
     "강화된 파동에 피격된 적은 1.5초간 느려지며 받는 데미지가 30% 증폭됩니다."
    ],
    "note": null
   }
  ]
 },
 {
  "name": "동화",
  "category": "특수능력 각인(공격)",
  "moddable": true,
  "tiers": [
   {
    "kind": "기본",
    "count": 3,
    "effect": [
     "보유한 정령 1체당 모든 정령들의 쿨다운 속도가 20% 상승합니다."
    ],
    "note": null
   },
   {
    "kind": "기본",
    "count": 5,
    "effect": [
     "정령왕 오베론을 소환합니다."
    ],
    "note": null
   },
   {
    "kind": "개조",
    "count": 5,
    "effect": [
     "오베론이 해방되어 진정한 모습을 드러냅니다."
    ],
    "note": null
   }
  ]
 },
 {
  "name": "복수",
  "category": "특수능력 각인(공격)",
  "moddable": true,
  "tiers": [
   {
    "kind": "기본",
    "count": 2,
    "effect": [
     "피격 후 2초내로 적 공격 시 복수하여 물리와 마법 중 더 높은 공격력에 따라 추가 데미지를 입히고 직전에 자신이 입은 데미지의 75%를 회복합니다. (쿨타임: 3초)"
    ],
    "note": null
   },
   {
    "kind": "기본",
    "count": 4,
    "effect": [
     "복수 시 4초간 잃은 체력 10당 받는 데미지가 1% 감소하며 적에게 입히는 데미지가 3% 증폭 됩니다. (최대 15%감소, 45% 증폭"
    ],
    "note": null
   },
   {
    "kind": "개조",
    "count": 4,
    "effect": [
     "대쉬로 적의 공격을 회피했을 때에도 복수할 수 있게 됩니다.",
     "단, 대쉬로 적의 공격을 회피하여 복수할 경우에는 체력을 회복하지 않습니다."
    ],
    "note": null
   }
  ]
 },
 {
  "name": "비상",
  "category": "특수능력 각인(공격)",
  "moddable": true,
  "tiers": [
   {
    "kind": "기본",
    "count": 2,
    "effect": [
     "공중에 있을 시 치명타 확률이 20% 증가합니다."
    ],
    "note": null
   },
   {
    "kind": "기본",
    "count": 4,
    "effect": [
     "공중에 있을 시 적에게 입히는 데미지가 40% 증폭됩니다."
    ],
    "note": null
   },
   {
    "kind": "개조",
    "count": 4,
    "effect": [
     "공중에 머무른 시간이 5초 이상 누적된 후 스킬 사용 시 제자리에 회오리를 일으켜 물리와 마법 중 더 높은 공격력에 따라 데미지를 입힙니다."
    ],
    "note": null
   }
  ]
 },
 {
  "name": "암기",
  "category": "특수능력 각인(공격)",
  "moddable": true,
  "tiers": [
   {
    "kind": "기본",
    "count": 2,
    "effect": [
     "적에게 첫 공격 시 1초간 유지되는 표식을 남깁니다.",
     "(모험가 및 보스의 경우 5초)",
     "표식을 가진 적에게 입히는 데미지가 35% 증폭됩니다."
    ],
    "note": null
   },
   {
    "kind": "기본",
    "count": 4,
    "effect": [
     "표식을 가진 적에게 가하는 공격이 치명타로 적중합니다."
    ],
    "note": null
   },
   {
    "kind": "개조",
    "count": 4,
    "effect": [
     "표식이 사라지고 35초가 지나면 다시 표식을 새길 수 있습니다."
    ],
    "note": null
   }
  ]
 },
 {
  "name": "전리품",
  "category": "특수능력 각인(공격)",
  "moddable": true,
  "tiers": [
   {
    "kind": "기본",
    "count": 2,
    "effect": [
     "교대 시 지면에 칼레온의 깃발을 꽃습니다.",
     "깃발 주변에 있을 시 물리공격력 및 마법공격력이 35% 증가합니다."
    ],
    "note": null
   },
   {
    "kind": "개조",
    "count": 2,
    "effect": [
     "깃발 아래에서 공격력 20% 증폭. 물리공격력과 마법공격력 중 높은 쪽의 공격력을 기반으로 총공세를 가함."
    ],
    "note": null
   }
  ]
 },
 {
  "name": "처형",
  "category": "특수능력 각인(공격)",
  "moddable": true,
  "tiers": [
   {
    "kind": "기본",
    "count": 2,
    "effect": [
     "현재 체력이 60% 이하인 적에게 표식을 남깁니다.",
     "표식을 가진 적에게 입히는 데미지가 15% 증폭됩니다."
    ],
    "note": null
   },
   {
    "kind": "기본",
    "count": 4,
    "effect": [
     "표식을 가진 적의 체력이 30% 이하라면 해당 적에게 입히는 피해가 60% 증폭하며 모든 공격이 치명타로 적중합니다."
    ],
    "note": null
   },
   {
    "kind": "개조",
    "count": 4,
    "effect": [
     "적의 현재 체력이 15% 감소할 때마다 해당 적에게 입히는 데미지가 10% 증폭됩니다."
    ],
    "note": null
   }
  ]
 },
 {
  "name": "해와 달",
  "category": "특수능력 각인(공격)",
  "moddable": false,
  "tiers": [
   {
    "kind": "기본",
    "count": 2,
    "effect": [
     "해와 달이 만나 찬란한 여명이 나타납니다."
    ],
    "note": null
   }
  ]
 },
 {
  "name": "가보",
  "category": "특수능력 각인(방어)",
  "moddable": true,
  "tiers": [
   {
    "kind": "기본",
    "count": 2,
    "effect": [
     "신기루 상태가 되어 피격 시 회피하고 신기루 상태가 해제됩니다.(쿨타임 30초)"
    ],
    "note": null
   },
   {
    "kind": "기본",
    "count": 4,
    "effect": [
     "신기루 상태일 시 적에게 입히는 데미지가 45% 증폭됩니다."
    ],
    "note": null
   },
   {
    "kind": "개조",
    "count": 4,
    "effect": [
     "신기루 상태일시 자신의 잔상이 생겨 함께 공격해 자신이 입힌 데미지의 35%만큼 추가데미지를 입힙니다.",
     "신기루 상태에서 2회 피격시 신기루가 해제 됩니다."
    ],
    "note": null
   }
  ]
 },
 {
  "name": "성물",
  "category": "특수능력 각인(방어)",
  "moddable": true,
  "tiers": [
   {
    "kind": "기본",
    "count": 2,
    "effect": [
     "회복구슬 획득 시 체력을 추가로 3 회복합니다."
    ],
    "note": null
   },
   {
    "kind": "기본",
    "count": 4,
    "effect": [
     "체력을 회복하면 10초간 적 공격 시 신의 분노를 내립니다.",
     "신의 분노는 최대체력 50당 적의 남은 체력의 1%만큼 고정데미지를 입힙니다. (최대 10%)",
     "신의 분노는 동일한 대상에게 5초에 1번 발생할 수 있습니다."
    ],
    "note": null
   },
   {
    "kind": "개조",
    "count": 4,
    "effect": [
     "최대체력 10당 스킬 쿨다운 속도가 3% 증가합니다. (최대 150% 증가)",
     "15초마다 체력을 3 회복합니다."
    ],
    "note": null
   }
  ]
 },
 {
  "name": "요새",
  "category": "특수능력 각인(방어)",
  "moddable": true,
  "tiers": [
   {
    "kind": "기본",
    "count": 2,
    "effect": [
     "35초마다 10의 방어막을 얻습니다."
    ],
    "note": null
   },
   {
    "kind": "기본",
    "count": 4,
    "effect": [
     "방어막을 가지고 있는 상태일 시 받는 데미지가 50% 감소합니다."
    ],
    "note": null
   },
   {
    "kind": "개조",
    "count": 4,
    "effect": [
     "보유한 방어막에 비례하여 물리·마법 공격력이 증가합니다. 최대 200% 증가."
    ],
    "note": "방어막 5당 증가량은 원문 표기 오류로 확인 필요."
   }
  ]
 },
 {
  "name": "추적",
  "category": "특수능력 각인(방어)",
  "moddable": true,
  "tiers": [
   {
    "kind": "기본",
    "count": 2,
    "effect": [
     "대쉬 쿨다운 속도가 40% 증가합니다."
    ],
    "note": null
   },
   {
    "kind": "기본",
    "count": 4,
    "effect": [
     "대쉬 시 3초간 적에게 입히는 데미지가 30% 증폭됩니다."
    ],
    "note": null
   },
   {
    "kind": "개조",
    "count": 4,
    "effect": [
     "대쉬 7회 시 10초간 물리공격력 및 마법공격력이 150% 증가하고 공격속도 및 이동속도가 100% 증가합니다."
    ],
    "note": null
   }
  ]
 },
 {
  "name": "뼈",
  "category": "특수능력 각인(방어)",
  "moddable": true,
  "tiers": [
   {
    "kind": "기본",
    "count": 2,
    "effect": [
     "3번째로 교대할 시 교대 쿨타임이 초기화 되고 3초간 무적 상태가 됩니다."
    ],
    "note": null
   },
   {
    "kind": "개조",
    "count": 2,
    "effect": [
     "보유한 뼈마다 각자 효과를 부여합니다"
    ],
    "note": null
   }
  ]
 },
 {
  "name": "보물",
  "category": "특수능력 각인(방어)",
  "moddable": true,
  "tiers": [
   {
    "kind": "기본",
    "count": 2,
    "effect": [
     "전투 중 보물을 가진 적을 발견할 수 있습니다."
    ],
    "note": null
   },
   {
    "kind": "기본",
    "count": 4,
    "effect": [
     "이 각인의 효과로 발견할 수 있는 보물상자에서 얻을 수 있는 보상의 종류가 늘어납니다."
    ],
    "note": null
   },
   {
    "kind": "개조",
    "count": 4,
    "effect": [
     "보유한 보물 각인 효과 1개당 적에게 입히는 데미지가 5% 증폭됩니다. 이 효과가 활성화시 황금왕의 상자가 나타납니다."
    ],
    "note": null
   }
  ]
 }
];
