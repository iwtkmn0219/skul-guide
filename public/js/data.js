// 원문 「스컬별 스킬 추천」(디시 스컬 마이너 갤러리 no=57295) 전사.
// 문구는 원문 그대로 둔다(맞춤법 교정 금지). 원문 줄: docs/superpowers/specs/2026-11-08-skul-skill-source.txt

/** @typedef {{
 *   id: string,
 *   no: number,
 *   name: string,
 *   grade: 'common'|'rare'|'unique'|'legendary',
 *   mark: '★'|'◆'|null,
 *   fixedSkill: string|null,
 *   builds: Array<{ label: string|null, slots: string[][], notes: string[] }>,
 *   pool: null | Array<{ type: '즉발형'|'지속형'|'증폭기', skills: Array<{ name: string, value: string, stars: 0|1|2 }> }>,
 *   notes: string[]
 * }} Skull */

export const GRADES = [
  { id: 'common', label: '일반' },
  { id: 'rare', label: '레어' },
  { id: 'unique', label: '유니크' },
  { id: 'legendary', label: '레전더리' },
];

export const SOURCE = {
  url: 'https://gall.dcinside.com/mgallery/board/view/?id=skul&no=57295',
  title: '스컬별 스킬 추천',
  author: '정도',
  updated: ['25.02.05', '26.01.26'],
  headline: '보스 비중이 크니 참고',
};

/** @type {Skull[]} */
export const SKULLS = [
  // 일반
  {
    id: 'skul', no: 1, name: '스컬(리틀본)', grade: 'common', mark: null, fixedSkill: null,
    builds: [], pool: null, notes: [],
  },
  {
    id: 'skeleton-sword', no: 2, name: '스켈레톤-검', grade: 'common', mark: null, fixedSkill: null,
    builds: [
      { label: null, slots: [['녹슨 찌르기'], ['톱날베기']], notes: ['이 두 스킬이 모션이 깔끔한 편'] },
    ],
    pool: null, notes: [],
  },
  {
    id: 'skeleton-spear', no: 3, name: '스켈레톤-창', grade: 'common', mark: null, fixedSkill: null,
    builds: [
      {
        label: null, slots: [['돌격!'], ['아무거나']], notes: [
          '초반 추적템 나올 때 까지 견인해줄 돌격!만 챙겨주고',
          '아무거나 들어도 됨',
          '계속돌격!은 대시무적 사라지니까 감안하고 선택하기',
        ],
      },
    ],
    pool: null, notes: [],
  },
  {
    id: 'skeleton-shield', no: 4, name: '스켈레톤-방패', grade: 'common', mark: null, fixedSkill: null,
    builds: [
      {
        label: null, slots: [['방패가속'], ['방패찍기']], notes: [
          '방패치기는 성능은 나쁘지 않으나',
          '패링 특유의 수동성 때문에 비추',
          '방패돌진은 딜레이+강제이동이 거슬려서 비추함',
          '이거 쓸 시간에 평타 더 박는게 맞음',
        ],
      },
    ],
    pool: null, notes: [],
  },
  {
    id: 'werewolf', no: 5, name: '웨어울프', grade: 'common', mark: null, fixedSkill: null,
    builds: [
      {
        label: '물리', slots: [['사냥'], ['짐승의 도약']], notes: [
          '사냥은 증폭용으로 어떠한 경우든지 꼭 필요하고',
          '짐승의 도약은 물리 스킬이 사냥 빼면 얘 뿐이라 울며 겨자먹기로 써야함',
          '그래도 필드에선 도움이 되는 편이고 보스에선 무적 활용해서 딜하기 괜찮음',
        ],
      },
      {
        label: '마딜', slots: [['사냥'], ['포식', '찢기']], notes: [
          '포식은 긴쿨 강한딜',
          '찢기는 짧쿨 약한딜',
          '거기서 거기니까 취향껏',
        ],
      },
    ],
    pool: null, notes: [],
  },
  {
    id: 'recruit', no: 6, name: '칼레온 신병', grade: 'common', mark: null, fixedSkill: null,
    builds: [
      {
        label: null, slots: [['궁병'], ['중갑병']], notes: [
          '자폭으로 교대 돌려서 병사뽑는게 제일 중요한 스컬이라',
          '스킬 중요도는 그리 높지 않음',
          '사거리가 절망적인 보병만 피해주면 됨',
        ],
      },
    ],
    pool: null, notes: [],
  },
  {
    id: 'thief', no: 7, name: '좀도둑', grade: 'common', mark: null, fixedSkill: null,
    builds: [
      {
        label: null, slots: [['금화 던지기'], ['뒷구르기']], notes: [
          '금화던지기가 쿨대비 딜이 센편이고 타수도 높아서 메인 딜링 스킬로 제일 적합하고',
          '뒷구르기는 유니크일 때는 모션 중 무적, 레전일 때 무적 존 생성인 상급 생존기라',
          '이 두 스킬이 공수밸런스 좋은 조합임',
          '뒷치기+주머니찢기도 재밌는 스킬들이라 써보면 좋을듯',
        ],
      },
    ],
    pool: null, notes: [],
  },
  {
    id: 'ent-skul', no: 8, name: '엔트 스컬', grade: 'common', mark: null, fixedSkill: null,
    builds: [
      {
        label: null, slots: [['급성장'], ['뿌리내리기']], notes: [
          '급성장은 극딜, 뿌리내리기는 무적&잡몹딜',
          '최대한 이 두개로 맞춰야함',
        ],
      },
    ],
    pool: null, notes: [],
  },
  {
    id: 'stone-monkey', no: 9, name: '돌원숭', grade: 'common', mark: '◆', fixedSkill: null,
    builds: [
      {
        label: null, slots: [['건곤일격'], ['쾌속봉침']], notes: [
          '이 두 개가 깔끔함',
          '여의봉이나 여래선풍이 위에 두 스킬보다 세고 타수도 높긴한데',
          '딜레이가 심한편이라 생각을 잘 해보고 선택해야 함',
        ],
      },
    ],
    pool: null, notes: [],
  },
  {
    id: 'grave-digger', no: 10, name: '무덤지기', grade: 'common', mark: '◆', fixedSkill: null,
    builds: [
      {
        label: null, slots: [['리어왕'], ['맥베스']], notes: [
          '맥베스는 오셀로로 대체가능',
          '도리어 필드는 맥베스보다 오셀로가 더 좋음',
          '햄릿만 피하자',
        ],
      },
    ],
    pool: null, notes: [],
  },
  {
    id: 'wizard', no: 11, name: '마법사', grade: 'common', mark: null, fixedSkill: null,
    builds: [
      {
        label: null, slots: [['익스플로전'], ['아무거나']], notes: [
          '코스트 적게 들어가는 익스플로전 난사하는 게',
          '성능이 두루두루 좋게 나옴',
          '나머지 한칸은 원거리로 때릴 수 있는 파이어볼이나 파이어 애로우가 무난',
        ],
      },
    ],
    pool: null, notes: [],
  },
  {
    id: 'spartan', no: 12, name: '노예', grade: 'common', mark: '★', fixedSkill: null,
    builds: [
      {
        label: null, slots: [['잔혹한일격'], ['심장추적자']], notes: [
          '완벽패링-잔혹한일격을 꾸준히 박아야 그나마 성능이 나옴',
        ],
      },
    ],
    pool: null, notes: [],
  },
  {
    id: 'thor', no: 13, name: '바이킹', grade: 'common', mark: '★', fixedSkill: null,
    builds: [
      {
        label: null, slots: [['투척망치'], ['땅부수기']], notes: [
          '딜레이가 적은 조합이라 스킬난사하기 좋음',
          '천둥 많이 뽑는다는 느낌으로',
        ],
      },
    ],
    pool: null, notes: [],
  },

  // 레어
  {
    id: 'mummy', no: 1, name: '미라', grade: 'rare', mark: null, fixedSkill: null,
    builds: [
      { label: null, slots: [['미라볼'], ['미라폭탄']], notes: ['어지간하면 이 둘로 고정'] },
    ],
    pool: null, notes: [],
  },
  {
    id: 'gargoyle', no: 2, name: '가고일', grade: 'rare', mark: null, fixedSkill: null,
    builds: [
      { label: null, slots: [['석화'], ['가고일의 눈']], notes: ['돌풍,폭풍은 사용난이도가 너무 높음'] },
    ],
    pool: null, notes: [],
  },
  {
    id: 'glacial-skull', no: 3, name: '빙하의 스컬', grade: 'rare', mark: null, fixedSkill: null,
    builds: [
      {
        label: null, slots: [['빙하돌진'], ['빙산']], notes: [
          '빙하가 보통 폭탄이랑 같이 쓰이기 때문에 딜레이 짧은 게 이득인 경우가 많은데',
          '아이스필드는 선후딜 있고, 빙하의 칼날은 차징기라',
          '요 두 스킬이 그나마 빠르고 강한 조합임',
          '빙하의 칼날, 아이스필드도 쓰기 나름인지라 써보는 거 추천함',
        ],
      },
    ],
    pool: null, notes: [],
  },
  {
    id: 'minotaurus', no: 4, name: '미노타우로스', grade: 'rare', mark: null, fixedSkill: null,
    builds: [
      { label: null, slots: [['둔기강타'], ['박치기']], notes: ['기절달린 둔기강타 챙겨 주는 게 좋음'] },
    ],
    pool: null, notes: [],
  },
  {
    id: 'warrior', no: 5, name: '워리어', grade: 'rare', mark: null, fixedSkill: null,
    builds: [
      {
        label: null, slots: [['혼신의 일격'], ['라이징슬래시']], notes: [
          '무난한 스킬 조합임',
          '라이징으로 맵밀고 혼신으로 극딜하기',
        ],
      },
      {
        label: null, slots: [['강타'], ['라이징슬래시']], notes: [
          '이 조합이 가장 좋지 않나 싶음',
          '강타가 무적달린 돌격스킬이라',
          '정직하게 정면만 치는 혼신보다 잡몹전에서 훨신 안정적임',
          '보스딜도 강타&라이징으로 충분한 정도여서',
          '잡몹전에 좀 더 힘주는 게 게임 끌어나가는 데에 편했음',
          '또 히든,황제에서 다른 스킬보다 강타가 증폭 먹이기 편해서',
          '채용할 가치가 있음',
          '개인적으로는 혼신, 라이징, 강타 중에 아무거나 조합해서 쓰는 중임',
          '제압은 애매함',
          '딜 자체는 혼신>>강타>제압=라이징',
        ],
      },
    ],
    pool: null, notes: [],
  },
  {
    id: 'hunter', no: 6, name: '헌터', grade: 'rare', mark: null, fixedSkill: null,
    builds: [
      { label: '추가타 빌드', slots: [['멀티플샷'], ['고정사격']], notes: [] },
      { label: '강타 빌드', slots: [['멀티플샷'], ['피어스샷']], notes: [] },
    ],
    pool: null, notes: [],
  },
  {
    id: 'ghost-rider', no: 7, name: '라이더', grade: 'rare', mark: null, fixedSkill: '헬바이크',
    builds: [
      {
        label: null, slots: [['헬바이크'], ['플레임 체인']], notes: [
          '솔직히 아무거나 괜찮음',
          '플레임부츠는 레전더리에서 조작감 구려지는 거 감안해서 선택',
        ],
      },
    ],
    pool: null, notes: [],
  },
  {
    id: 'genie', no: 8, name: '진', grade: 'rare', mark: null, fixedSkill: null,
    builds: [
      {
        label: null, slots: [['요정검술'], ['요정태클']], notes: [
          '이 조합이 제일 셈',
          '요정램프는 딜로스가 심해서 비추',
          '요정스매쉬는 타수도 낮고 딜도 그닥',
        ],
      },
    ],
    pool: null, notes: [],
  },
  {
    id: 'clown', no: 9, name: '광대', grade: 'rare', mark: null, fixedSkill: null,
    builds: [
      {
        label: null, slots: [['하이라이트'], ['깜짝나이프']], notes: [
          '물리위주 빌드면 이 조합으로 고정이고',
          '마공위주 빌드면 깜짝나이프를 한손에 둘로 대체 가능함',
        ],
      },
    ],
    pool: null, notes: [],
  },
  {
    id: 'bomb-skul', no: 10, name: '스켈레톤-폭탄병', grade: 'rare', mark: null, fixedSkill: null,
    builds: [
      {
        label: null, slots: [['자폭'], ['아무거나']], notes: [
          '즉발교대에 폭탄딜이 주 목적이라 자폭만 챙기면 됨',
          '진실의 대궁이나 마공학 스태프, 마나팔찌 같이',
          '스킬을 많이,자주 써야하는 경우라면',
          '점화나 소형폭탄도 같이 뽑아주셈',
          '딜상승이 목적이라면',
        ],
      },
      {
        label: null, slots: [['자폭'], ['소형폭탄']], notes: [
          '반드시 이 조합으로 가야함',
          '점화가 버그로 딜상승이 아얘 없는 수준',
        ],
      },
    ],
    pool: null, notes: [],
  },
  {
    id: 'aqua-skull', no: 11, name: '워터 스컬', grade: 'rare', mark: null, fixedSkill: null,
    builds: [
      {
        label: null, slots: [['용오름'], ['입수']], notes: [
          '입수가 무적기 치고 딜이 좋은 편임',
          '숨 쉴 틈도 없이 딜 박고 싶으면 자연의 호수도 괜찮은 듯',
          '밀물은 비추',
        ],
      },
    ],
    pool: null, notes: [],
  },
  {
    id: 'alchemist', no: 12, name: '연금술사', grade: 'rare', mark: null, fixedSkill: '불안정한소환',
    builds: [
      {
        label: null, slots: [['불안정한소환'], ['마비', '화염', '오염물질']], notes: [
          '세개중에 택1 하면됨',
          '신경마비플라스크는 기절부여',
          '화염플라스크, 오염물질플라스크는 추가타격',
          '개인적으로는 신경마비 선호함',
        ],
      },
    ],
    pool: null, notes: [],
  },
  {
    id: 'ghoul', no: 13, name: '구울', grade: 'rare', mark: null, fixedSkill: null,
    builds: [
      {
        label: null, slots: [['흡입(물리증폭)'], ['크게썰기(공속증가)']], notes: [
          '크게 썰기 대신 대압살(치명확률)도 고를만 함',
          '흡입은 필수',
        ],
      },
    ],
    pool: null, notes: [],
  },
  {
    id: 'guan-yu', no: 14, name: '무관', grade: 'rare', mark: '★', fixedSkill: null,
    builds: [
      {
        label: null, slots: [['파죽지세'], ['만부부당']], notes: [
          '만부부당 효과는 영웅무쌍격에 적용이 안되고',
          '파죽지세 효과는 모든 무쌍격에 적용 돼서',
          '만부부당보다는 파죽지세를 반드시 챙겨줘야함',
          '만부부당도 챙기는 게 좋긴 한데',
          '필드 생각해서 일기당천이랑 바꿔도 괜찮을 듯',
        ],
      },
    ],
    pool: null, notes: [],
  },

  // 유니크
  {
    id: 'rock-star', no: 1, name: '락스타', grade: 'unique', mark: null, fixedSkill: '앰프',
    builds: [
      { label: null, slots: [['앰프'], ['클라이막스']], notes: [] },
    ],
    pool: null, notes: [],
  },
  {
    id: 'samurai', no: 2, name: '사무라이', grade: 'unique', mark: null, fixedSkill: '일섬',
    builds: [
      {
        label: null, slots: [['일섬'], ['초속베기']], notes: [
          '일섬을 제외한 다른 스킬들이 다 고만고만한 편이라 맘에 드는 거 선택하면 됨',
          '초속베기가 두루두루 무난하고',
          '필드에선 회전베기도 괜찮음',
          '패링은 흘려베기',
        ],
      },
    ],
    pool: null, notes: [],
  },
  {
    id: 'ninja', no: 3, name: '닌자', grade: 'unique', mark: null, fixedSkill: null,
    builds: [
      {
        label: null, slots: [['대차륜수리검'], ['환영난무']], notes: [
          '무적+극딜 다 챙기는 조합임',
          '표창 컨셉으로 갈 땐 대차륜+칼날만개 조합 하면 됨 재밌음',
        ],
      },
    ],
    pool: null, notes: [],
  },
  {
    id: 'dark-paladin', no: 4, name: '다크 팔라딘', grade: 'unique', mark: null, fixedSkill: null,
    builds: [
      {
        label: null, slots: [['다크차치'], ['다크러시', '다크웨이브']], notes: [
          '다크러시는 보스에 이점이 있고',
          '다크웨이브는 필드에 이점이 있음',
          '딜차이는',
          '보않검다크러시>차징다크웨이브>다크러시>논차징다크웨이브',
        ],
      },
    ],
    pool: null, notes: [],
  },
  {
    id: 'berserker', no: 5, name: '버서커', grade: 'unique', mark: null, fixedSkill: '악마의뼈',
    builds: [
      {
        label: null, slots: [['악마의뼈'], ['매드액스']], notes: [
          '다른 스킬들이 키다운이나 연타형인데',
          '매드액스로 짧게 한번 치고 평타 때려 박는게 딜이 제일 강함',
          '레이지 태클도 딜은 괜찮은 편',
        ],
      },
    ],
    pool: null, notes: [],
  },
  {
    id: 'predator', no: 6, name: '약탈자', grade: 'unique', mark: null, fixedSkill: null,
    builds: [
      { label: null, slots: [['난도질'], ['훨윈드']], notes: ['다른 스킬들은 강제이동 때문에 하자가 좀 있는 편'] },
    ],
    pool: null, notes: [],
  },
  {
    id: 'living-armor', no: 7, name: '리빙아머', grade: 'unique', mark: null, fixedSkill: null,
    builds: [
      {
        label: null, slots: [['소울 번'], ['아무거나']], notes: [
          '보스도 소울번으로 패고 필드도 소울번으로 패기 때문에',
          '소울번만 챙겨주면 됨',
        ],
      },
    ],
    pool: null, notes: [],
  },
  {
    id: 'prisoner', no: 8, name: '죄수', grade: 'unique', mark: null, fixedSkill: null,
    builds: [],
    pool: [
      {
        type: '즉발형', skills: [
          { name: '장검', value: '1타', stars: 1 },
          { name: '중형쇠뇌', value: '7타', stars: 1 },
          { name: '기병창', value: '1타', stars: 0 },
          { name: '전광석화', value: '2타', stars: 0 },
          { name: '위상변화기', value: '2타', stars: 0 },
          { name: '피의검', value: '풀히트시 6타', stars: 1 },
        ],
      },
      {
        type: '지속형', skills: [
          { name: '도축기', value: '30~50타', stars: 1 },
          { name: '이중자동쇠뇌', value: '32타', stars: 2 },
          { name: '쾌속쇠뇌', value: '21타(키다운스킬)', stars: 0 },
        ],
      },
      {
        type: '증폭기', skills: [
          { name: '선봉대의 방패', value: '증폭40%', stars: 0 },
          { name: '늑대 덫', value: '30%', stars: 2 },
        ],
      },
    ],
    notes: [
      '얘는 원하는 스킬을 마음대로 고를 수 있는 구조가 아님',
      '이 중에서 주는 대로 잘 골라서 쓰면 됨',
      '별표는 추천픽',
      '패링 하고 싶으면 방패스킬 들면 되고',
      '마딜 스킬은 비추함',
    ],
  },
  {
    id: 'high-warlock', no: 9, name: '대마도사', grade: 'unique', mark: null, fixedSkill: null,
    builds: [
      {
        label: null, slots: [['어비스 스파이크'], ['어비스 오브']], notes: [
          '보않검 활용해서 평타를 포함해 타수로 팰때 쓰는 스킬 조합임',
        ],
      },
      {
        label: null, slots: [['어비스 메테오'], ['어비스 레이저']], notes: [
          '한방 폭딜 노릴 때 쓰는 조합임',
          '여기가 사실 더 정석적인 조합인듯',
        ],
      },
    ],
    pool: null, notes: [],
  },
  {
    id: 'hercules', no: 10, name: '고행자', grade: 'unique', mark: '★', fixedSkill: null,
    builds: [
      {
        label: null, slots: [['사자사냥'], ['황소저지']], notes: [
          '멧돼지 쫒기도 괜찮음',
          '히드라도 딜은 세서 좋긴 한데',
          '무한무적 유지하기는 힘드니 감안해서 선택',
        ],
      },
    ],
    pool: null, notes: [],
  },

  // 레전더리
  {
    id: 'grim-reaper', no: 1, name: '그림리퍼', grade: 'legendary', mark: null, fixedSkill: null,
    builds: [
      {
        label: null, slots: [['수확'], ['명계의균열']], notes: [
          '어지간 하면 이 둘로 고정',
          '길로틴도 좋음',
        ],
      },
    ],
    pool: null, notes: [],
  },
  {
    id: 'fighter', no: 2, name: '챔피언', grade: 'legendary', mark: null, fixedSkill: null,
    builds: [
      {
        label: null, slots: [['콤비네이션'], ['아무거나']], notes: [
          '어짜피 보스 드가면 콤비네이션만 쓰기 때문에 아무거나 ok',
          '필드에선 순보가 괜찮은 편',
        ],
      },
    ],
    pool: null, notes: [],
  },
  {
    id: 'yaksha', no: 3, name: '야차', grade: 'legendary', mark: null, fixedSkill: null,
    builds: [
      {
        label: null, slots: [['야차정권'], ['금강일격']], notes: [
          '부동야차도 괜찮음',
          '악귀멸살은 혼자 결이 달라서 비추',
          '라고 생각했는데 악귀멸살 깡딜이 생각보다 많이 세서',
          '선택 할 가치가 있음',
        ],
      },
      {
        label: null, slots: [['야차정권'], ['악귀멸살']], notes: [
          '이 조합이 딜이 가장 잘 나와서 추천함',
          '다만 스킬시전속도가 높아지면(마공학3 등)',
          '악귀멸살 9타를 다 박기가 힘들어진다는 애로사항이 있음',
          '야차정권+금각일격도 나쁘지않음',
        ],
      },
    ],
    pool: null, notes: [],
  },
  {
    id: 'arch-lich', no: 4, name: '아크리치', grade: 'legendary', mark: null, fixedSkill: null,
    builds: [
      {
        label: null, slots: [['영혼약탈'], ['망자의감옥', '죽음의 한기']], notes: [
          '죽음의 한기가 쿨짧고 타수많고 딜살짝 더 세긴한데',
          '스킬 범위에 하자가 좀 있는 편임',
          '죽음의 행진은 대형보스 상대로는 좋은데',
          '중,소형 보스들한테는 딜 기댓값이 낮음',
        ],
      },
    ],
    pool: null, notes: [],
  },
  {
    id: 'gambler', no: 5, name: '겜블러', grade: 'legendary', mark: null, fixedSkill: null,
    builds: [
      {
        label: null, slots: [['운명의룰렛'], ['블랙잭']], notes: [
          '이 두 개가 그나마그나마 딜 기댓값이 높음',
          '사실 거기서 거기라 대충 멋있어 보이는 거 집어도 됨',
        ],
      },
    ],
    pool: null, notes: [],
  },
  {
    id: 'davy-jones', no: 6, name: '데비존스', grade: 'legendary', mark: '◆', fixedSkill: null,
    builds: [
      {
        label: '셋 중 두 개', slots: [['포격하라!', '백병전!', '닻을 내려라!']], notes: [
          '중에 두 개 섞는 게 제일 무난함',
          '닻을 내려라!는 용기의뼈랑 영혼의 일격들고 재미 볼 때 좋음',
          '대신에 기본딜은 제일 약함',
          '사격준비!는 딜 고점은 아주 높은데 맞추기가 많이 힘든편',
        ],
      },
    ],
    pool: null, notes: [],
  },
  {
    id: 'king-arthur', no: 7, name: '잊혀진 왕', grade: 'legendary', mark: '★', fixedSkill: null,
    builds: [
      { label: '게이지', slots: [['파란의검']], notes: [] },
      { label: '타수', slots: [['인도의검', '운명의검']], notes: [] },
      {
        label: '깔끔', slots: [['신뢰의검']], notes: [
          '알아서 대충 조합 하면 됨',
          '진짜 별 차이 없음',
        ],
      },
    ],
    pool: null, notes: [],
  },
  {
    id: 'dominator', no: 8, name: '지배자', grade: 'legendary', mark: '◆', fixedSkill: null,
    builds: [
      { label: null, slots: [['아무거나']], notes: ['변신 평타가 메인이라 아무거나 써도 다 좋음'] },
      { label: null, slots: [['학살'], ['도륙']], notes: [] },
      { label: null, slots: [['학살'], ['선별', '갈증']], notes: [] },
      {
        label: null, slots: [['도륙'], ['선별', '갈증']], notes: [
          '모르겠으면 이런 식으로 이동기 2개(선별,갈증)를 동시에 드는 것만 피해주셈',
        ],
      },
    ],
    pool: null, notes: [],
  },
];
