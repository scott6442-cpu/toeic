// ==========================================================
//  Inline Dictionary for example-sentence word lookups
//  Covers common English words NOT in the 1500 TOEIC vocab
//  + simple stemmer to map inflected forms → root
// ==========================================================

// Irregular verb/noun forms → root mapping
const STEM_MAP = {
  // be
  "am":"be","is":"be","are":"be","was":"be","were":"be","been":"be","being":"be",
  // have
  "has":"have","had":"have","having":"have",
  // do
  "does":"do","did":"do","doing":"do","done":"do",
  // go
  "goes":"go","went":"go","gone":"go","going":"go",
  // come
  "came":"come","coming":"come",
  // take
  "took":"take","taken":"take","taking":"take",
  // make
  "made":"make","making":"make",
  // give
  "gave":"give","given":"give","giving":"give",
  // get
  "got":"get","gotten":"get","getting":"get",
  // know
  "knew":"know","known":"know","knowing":"know",
  // think
  "thought":"think","thinking":"think",
  // say
  "said":"say","saying":"say",
  // see
  "saw":"see","seen":"see","seeing":"see",
  // find
  "found":"find","finding":"find",
  // run
  "ran":"run","running":"run",
  // set
  "setting":"set",
  // put
  "putting":"put",
  // keep
  "kept":"keep","keeping":"keep",
  // let
  "letting":"let",
  // begin
  "began":"begin","begun":"begin","beginning":"begin",
  // show
  "showed":"show","shown":"show","showing":"show",
  // tell
  "told":"tell","telling":"tell",
  // write
  "wrote":"write","written":"write","writing":"write",
  // read (past)
  // "read":"read" — same form
  // leave
  "left":"leave","leaving":"leave",
  // feel
  "felt":"feel","feeling":"feel",
  // bring
  "brought":"bring","bringing":"bring",
  // build
  "built":"build","building":"build",
  // buy
  "bought":"buy","buying":"buy",
  // send
  "sent":"send","sending":"send",
  // spend
  "spent":"spend","spending":"spend",
  // hold
  "held":"hold","holding":"hold",
  // stand
  "stood":"stand","standing":"stand",
  // lead
  "led":"lead","leading":"lead",
  // meet
  "met":"meet","meeting":"meet",
  // pay
  "paid":"pay","paying":"pay",
  // sit
  "sat":"sit","sitting":"sit",
  // speak
  "spoke":"speak","spoken":"speak","speaking":"speak",
  // lose
  "lost":"lose","losing":"lose",
  // win
  "won":"win","winning":"win",
  // choose
  "chose":"choose","chosen":"choose","choosing":"choose",
  // grow
  "grew":"grow","grown":"grow","growing":"grow",
  // draw
  "drew":"draw","drawn":"draw","drawing":"draw",
  // break
  "broke":"break","broken":"break","breaking":"break",
  // drive
  "drove":"drive","driven":"drive","driving":"drive",
  // sell
  "sold":"sell","selling":"sell",
  // cut
  "cutting":"cut",
  // rise
  "rose":"rise","risen":"rise","rising":"rise",
  // fall
  "fell":"fall","fallen":"fall","falling":"fall",
  // lay
  "laid":"lay","laying":"lay",
  // lie
  "lay":"lie","lain":"lie","lying":"lie",
  // catch
  "caught":"catch","catching":"catch",
  // become
  "became":"become","becoming":"become",
  // teach
  "taught":"teach","teaching":"teach",
  // throw
  "threw":"throw","thrown":"throw","throwing":"throw",
  // wear
  "wore":"wear","worn":"wear","wearing":"wear",
  // eat
  "ate":"eat","eaten":"eat","eating":"eat",
  // fly
  "flew":"fly","flown":"fly","flying":"fly",
  // fight
  "fought":"fight","fighting":"fight",
  // forget
  "forgot":"forget","forgotten":"forget","forgetting":"forget",
  // prove
  "proved":"prove","proven":"prove","proving":"prove",
  // seek
  "sought":"seek","seeking":"seek",
  // swing
  "swung":"swing","swinging":"swing",
  // overcome
  "overcame":"overcome","overcoming":"overcome",
  // children
  "children":"child",
  // men/women
  "men":"man","women":"woman",
  // people
  "people":"person",
  // companies
  "companies":"company",
  // countries
  "countries":"country",
  // cities
  "cities":"city",
  // families
  "families":"family",
  // babies
  "babies":"baby",
  // currencies
  "currencies":"currency",
  // factories
  "factories":"factory",
  // industries
  "industries":"industry",
  // strategies
  "strategies":"strategy",
  // policies
  "policies":"policy",
  // stories
  "stories":"story",
  // activities
  "activities":"activity",
  // opportunities
  "opportunities":"opportunity",
  // categories
  "categories":"category",
  // better
  "better":"good","best":"good",
  // worse
  "worse":"bad","worst":"bad",
  // more
  "more":"much","most":"much",
  // further
  "further":"far","furthest":"far",
  // less
  "fewer":"few",
};

// Simple suffix-based stemmer: try to find root form
function stemWord(word) {
  const w = word.toLowerCase();
  // Check explicit map first
  if (STEM_MAP[w]) return STEM_MAP[w];
  // Try common suffixes
  const suffixes = [
    // verb inflections
    {end:"ied", rep:"y"},       // carried → carry
    {end:"ies", rep:"y"},       // carries → carry
    {end:"ying", rep:"y"},      // carrying → carry (not quite, but close)
    {end:"ied", rep:"ie"},      // tied → tie
    {end:"ting", rep:"t"},      // cutting → cut (doubled consonant)
    {end:"ning", rep:"n"},      // running → run
    {end:"ming", rep:"m"},      // swimming → swim
    {end:"ping", rep:"p"},      // shipping → ship
    {end:"bing", rep:"b"},      // grabbing → grab
    {end:"ding", rep:"d"},      // adding → add
    {end:"ging", rep:"g"},      // digging → dig
    {end:"sing", rep:"s"},      // processing → process... no
    {end:"zing", rep:"ze"},     // analyzing → analyze
    {end:"cing", rep:"ce"},     // producing → produce
    {end:"ving", rep:"ve"},     // improving → improve
    {end:"ting", rep:"te"},     // operating → operate
    {end:"ring", rep:"re"},     // requiring → require
    {end:"ing", rep:"e"},       // making → make
    {end:"ing", rep:""},        // working → work
    {end:"ation", rep:"ate"},   // operation → operate
    {end:"ation", rep:"e"},     // exploration → explore
    {end:"ation", rep:""},      // information → inform
    {end:"ment", rep:""},       // management → manage
    {end:"ness", rep:""},       // business → busy... not always
    {end:"ally", rep:"al"},     // dramatically → dramatic (→al)
    {end:"ily", rep:"y"},       // easily → easy
    {end:"ly", rep:""},         // quickly → quick
    {end:"ful", rep:""},        // successful → success
    {end:"less", rep:""},       // homeless → home
    {end:"ous", rep:""},        // famous → fame... not always
    {end:"ive", rep:""},        // competitive → compet... not always
    {end:"ed", rep:"e"},        // created → create
    {end:"ed", rep:""},         // worked → work
    {end:"es", rep:""},         // processes → process
    {end:"s", rep:""},          // products → product
  ];

  for (const {end, rep} of suffixes) {
    if (w.endsWith(end) && w.length > end.length + 2) {
      const root = w.slice(0, -end.length) + rep;
      if (root.length >= 3) return root;
    }
  }
  return w;
}

// Common English words dictionary (Korean meanings)
// Covers ~400 most frequent words in TOEIC example sentences
const INLINE_DICT = {
  // Articles / Pronouns / Determiners
  "the":"(정관사) 그",
  "a":"(부정관사) 하나의",
  "an":"(부정관사) 하나의",
  "this":"이것, 이",
  "that":"저것, 저",
  "these":"이것들",
  "those":"저것들",
  "it":"그것",
  "its":"그것의",
  "you":"너, 당신",
  "your":"너의, 당신의",
  "we":"우리",
  "our":"우리의",
  "they":"그들",
  "their":"그들의",
  "she":"그녀",
  "her":"그녀의, 그녀를",
  "his":"그의",
  "him":"그를",
  "who":"누구",
  "which":"어느, ~하는",
  "what":"무엇",
  "my":"나의",
  "me":"나를",

  // Prepositions / Conjunctions
  "for":"~을 위해, ~동안",
  "with":"~와 함께",
  "from":"~로부터",
  "and":"그리고",
  "but":"그러나",
  "not":"~아닌",
  "into":"~안으로",
  "over":"~위에, ~이상",
  "after":"~후에",
  "before":"~전에",
  "during":"~동안",
  "between":"~사이에",
  "across":"~를 가로질러",
  "through":"~을 통해",
  "within":"~이내에",
  "about":"~에 대해",
  "than":"~보다",
  "until":"~까지",
  "since":"~이후로",
  "upon":"~위에",
  "without":"~없이",
  "toward":"~을 향해",
  "towards":"~을 향해",
  "among":"~사이에 (셋 이상)",
  "beyond":"~을 넘어서",
  "despite":"~에도 불구하고",

  // Common Verbs (base forms)
  "be":"~이다, 있다",
  "have":"가지다",
  "do":"하다",
  "say":"말하다",
  "go":"가다",
  "get":"얻다, 받다",
  "make":"만들다",
  "know":"알다",
  "think":"생각하다",
  "take":"가져가다, 취하다",
  "come":"오다",
  "see":"보다",
  "find":"찾다",
  "give":"주다",
  "tell":"말하다",
  "may":"~할 수 있다 (허가)",
  "will":"~할 것이다",
  "can":"~할 수 있다",
  "could":"~할 수 있었다",
  "would":"~할 것이다",
  "should":"~해야 한다",
  "must":"반드시 ~해야 한다",
  "shall":"~할 것이다",
  "might":"~일지도 모른다",
  "need":"필요하다",
  "want":"원하다",
  "use":"사용하다",
  "try":"시도하다",
  "help":"돕다",
  "show":"보여주다",
  "call":"부르다, 전화하다",
  "keep":"유지하다, 지키다",
  "let":"~하게 하다",
  "begin":"시작하다",
  "seem":"~처럼 보이다",
  "leave":"떠나다, 두다",
  "run":"운영하다, 달리다",
  "read":"읽다",
  "set":"설정하다, 정하다",
  "put":"놓다, 두다",
  "feel":"느끼다",
  "bring":"가져오다",
  "build":"짓다, 구축하다",
  "buy":"사다",
  "send":"보내다",
  "spend":"쓰다 (돈/시간)",
  "hold":"잡다, 개최하다",
  "stand":"서다, 견디다",
  "lead":"이끌다, 선도하다",
  "meet":"만나다, 충족하다",
  "pay":"지불하다",
  "sit":"앉다",
  "speak":"말하다",
  "lose":"잃다",
  "win":"이기다",
  "choose":"선택하다",
  "grow":"성장하다",
  "draw":"그리다, 끌어당기다",
  "break":"부수다, 깨다",
  "drive":"운전하다, 주도하다",
  "sell":"팔다",
  "cut":"자르다, 삭감하다",
  "rise":"오르다, 상승하다",
  "fall":"떨어지다, 감소하다",
  "lay":"놓다, 배치하다",
  "catch":"잡다, 따라잡다",
  "become":"되다",
  "teach":"가르치다",
  "write":"쓰다",
  "open":"열다, 개방하다",
  "close":"닫다, 마감하다",
  "move":"움직이다, 이동하다",
  "live":"살다",
  "pass":"지나가다, 통과하다",
  "turn":"돌다, 변하다",
  "add":"추가하다",
  "change":"바꾸다, 변화",
  "follow":"따르다",
  "stop":"멈추다",
  "start":"시작하다",
  "reach":"도달하다",
  "serve":"제공하다, 봉사하다",
  "include":"포함하다",
  "continue":"계속하다",
  "allow":"허용하다",
  "require":"요구하다",
  "remain":"남아있다",
  "receive":"받다",
  "provide":"제공하다",
  "offer":"제공하다, 제안하다",
  "consider":"고려하다",
  "expect":"기대하다",
  "support":"지원하다",
  "ensure":"보장하다",
  "develop":"개발하다",
  "improve":"개선하다",
  "establish":"설립하다",
  "create":"만들다, 창출하다",
  "report":"보고하다",
  "reduce":"줄이다",
  "increase":"증가하다, 증가",
  "maintain":"유지하다",
  "determine":"결정하다",
  "complete":"완료하다",
  "achieve":"달성하다",
  "sign":"서명하다, 기호",
  "cost":"비용이 들다, 비용",
  "prevent":"방지하다",
  "feature":"특징으로 하다",
  "visit":"방문하다",
  "prepare":"준비하다",
  "carry":"나르다",
  "travel":"여행하다",
  "cover":"다루다, 덮다",
  "apply":"적용하다, 지원하다",
  "arrange":"준비하다, 배열하다",
  "announce":"발표하다",
  "assign":"할당하다, 배정하다",
  "manage":"관리하다",
  "recommend":"추천하다",
  "confirm":"확인하다",
  "submit":"제출하다",
  "handle":"처리하다, 다루다",
  "record":"기록하다, 기록",
  "address":"다루다, 주소",

  // Common Nouns
  "company":"회사",
  "year":"해, 년",
  "time":"시간, 때",
  "team":"팀",
  "customer":"고객",
  "product":"제품",
  "market":"시장",
  "employee":"직원",
  "service":"서비스",
  "industry":"산업, 업계",
  "firm":"회사, 기업",
  "office":"사무실",
  "project":"프로젝트",
  "business":"사업, 비즈니스",
  "meeting":"회의",
  "process":"과정, 절차",
  "cost":"비용",
  "client":"고객",
  "hotel":"호텔",
  "policy":"정책",
  "month":"월, 달",
  "department":"부서",
  "week":"주",
  "report":"보고서",
  "program":"프로그램",
  "data":"데이터",
  "sale":"판매",
  "investment":"투자",
  "budget":"예산",
  "research":"연구",
  "line":"라인, 노선",
  "day":"일, 날",
  "part":"부분",
  "world":"세계",
  "city":"도시",
  "country":"국가",
  "life":"삶",
  "family":"가족",
  "child":"아이",
  "person":"사람",
  "place":"장소",
  "room":"방",
  "water":"물",
  "area":"지역",
  "right":"권리, 올바른",
  "case":"경우, 사건",
  "fact":"사실",
  "system":"시스템",
  "plan":"계획",
  "number":"숫자, 번호",
  "group":"그룹",
  "question":"질문",
  "problem":"문제",
  "point":"점, 요점",
  "result":"결과",
  "level":"수준",
  "order":"주문, 순서",
  "law":"법",
  "price":"가격",
  "rate":"요금, 비율",
  "experience":"경험",
  "change":"변화",
  "power":"힘, 전력",
  "value":"가치",
  "building":"건물",
  "land":"토지",
  "information":"정보",
  "goal":"목표",
  "position":"위치, 직책",
  "opportunity":"기회",
  "material":"재료",
  "condition":"조건, 상태",
  "standard":"기준",
  "decision":"결정",
  "skill":"기술",
  "worker":"근로자",
  "factory":"공장",
  "production":"생산",
  "manager":"관리자",
  "morning":"아침",
  "evening":"저녁",
  "afternoon":"오후",
  "quarter":"분기",
  "season":"시즌, 계절",
  "hour":"시간",

  // Common Adjectives
  "new":"새로운",
  "all":"모든",
  "each":"각각의",
  "every":"모든",
  "several":"여러 개의",
  "many":"많은",
  "much":"많은",
  "few":"적은",
  "some":"일부의",
  "other":"다른",
  "more":"더 많은",
  "most":"가장 많은",
  "first":"첫 번째의",
  "last":"마지막의",
  "next":"다음의",
  "old":"오래된",
  "good":"좋은",
  "bad":"나쁜",
  "great":"위대한, 훌륭한",
  "small":"작은",
  "large":"큰",
  "big":"큰",
  "long":"긴",
  "high":"높은",
  "low":"낮은",
  "full":"가득 찬",
  "different":"다른",
  "important":"중요한",
  "strong":"강한",
  "major":"주요한",
  "local":"지역의",
  "modern":"현대의",
  "digital":"디지털의",
  "financial":"재무의",
  "technical":"기술적인",
  "essential":"필수적인",
  "entire":"전체의",
  "annual":"연간의",
  "monthly":"월간의",
  "daily":"일일의",
  "total":"전체의",
  "public":"공공의",
  "private":"사적인",
  "professional":"전문적인",
  "international":"국제적인",
  "global":"세계적인",
  "top":"최고의",
  "special":"특별한",
  "senior":"선임의",
  "available":"이용 가능한",
  "significant":"중요한",
  "successful":"성공적인",
  "recent":"최근의",
  "potential":"잠재적인",
  "current":"현재의",
  "effective":"효과적인",
  "specific":"특정한",
  "necessary":"필수적인",
  "valuable":"가치 있는",
  "strict":"엄격한",
  "formal":"공식적인",
  "responsible":"책임이 있는",
  "clear":"명확한",
  "critical":"중요한, 비판적인",
  "additional":"추가적인",
  "comprehensive":"포괄적인",
  "advanced":"고급의",
  "unique":"독특한",
  "outstanding":"뛰어난",
  "remarkable":"주목할 만한",
  "genuine":"진정한",
  "luxury":"럭셔리, 호화로운",

  // Common Adverbs
  "also":"또한",
  "only":"오직, 단지",
  "very":"매우",
  "just":"방금, 단지",
  "well":"잘",
  "still":"여전히",
  "already":"이미",
  "even":"심지어",
  "now":"지금",
  "then":"그때, 그러면",
  "always":"항상",
  "never":"결코 ~않다",
  "often":"자주",
  "usually":"보통",
  "really":"정말로",
  "too":"너무, 또한",
  "almost":"거의",
  "nearly":"거의",
  "quite":"꽤",
  "soon":"곧",
  "here":"여기",
  "there":"거기",
  "today":"오늘",
  "tomorrow":"내일",
  "yesterday":"어제",
  "ahead":"앞에",
  "directly":"직접",
  "significantly":"상당히",
  "carefully":"신중하게",
  "rapidly":"빠르게",
  "extremely":"극도로",
  "highly":"매우, 높이",
  "widely":"널리",
  "particularly":"특히",
  "successfully":"성공적으로",
  "currently":"현재",
  "immediately":"즉시",
  "easily":"쉽게",
  "quickly":"빠르게",
  "properly":"적절하게",
  "regularly":"정기적으로",
  "clearly":"명확하게",
  "recently":"최근에",
  "consistently":"일관되게",
  "precisely":"정확하게",
  "thoroughly":"철저하게",
  "dramatically":"극적으로",
  "approximately":"대략",
  "personally":"개인적으로",
  "independently":"독립적으로",
  "prominently":"눈에 띄게",
  "genuinely":"진심으로",
  "exceptionally":"예외적으로",
  "permanently":"영구적으로",

  // Other common words
  "please":"제발, 부디",
  "percent":"퍼센트",
  "million":"백만",
  "billion":"10억",
  "thousand":"천",
  "hundred":"백",
  "dollar":"달러",
  "per":"~당",
  "ago":"~전에",
  "able":"~할 수 있는",
  "likely":"~할 것 같은",
  "due":"~때문의, ~예정인",
  "based":"~에 기반한",
  "free":"무료의, 자유로운",
  "early":"이른, 일찍",
  "late":"늦은, 늦게",
  "sure":"확실한",
  "ready":"준비된",
  "true":"진실된",
  "real":"진짜의",
  "own":"소유하다, 자신의",
  "such":"그러한",
  "any":"어떤",
  "no":"아니오, ~아닌",
  "yes":"예",
  "how":"어떻게",
  "why":"왜",
  "when":"언제",
  "where":"어디",
};
