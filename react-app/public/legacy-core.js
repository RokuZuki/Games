
(() => {
  'use strict';
  const KEY='ai-pandemic-webmock-v03'; // Retain storage key to migrate v0.3 saves.
  const EVENT_DATA=window.AIP_EVENT_DATA;
  const ENGINE=window.AIP_EVENT_ENGINE;
  if(!EVENT_DATA||!ENGINE)throw Error('Event modules not loaded');
  // v0.5: fictionalized country-specific game balance, not real-world country rankings.
  const COUNTRIES=[
    {id:'jp',flag:'🇯🇵',name:'日本',regionId:'ea',focus:'安全性・信頼',description:'堅実な導入と安全性投資が得意。海外展開はやや慎重。',bonuses:{trust:12,compute:6,funds:5},homePresence:52,adoption:4,mods:{research:1.05,income:1.01,spread:.95,home:1.18,safety:1.32,regulation:.88},eventTitle:'国内AI安全基準の見直し',eventText:'官民でAIの安全基準を見直す機運が高まった。信頼構築か、迅速な市場投入か。'},
    {id:'us',flag:'🇺🇸',name:'アメリカ',regionId:'nw',focus:'資金・事業拡大',description:'豊富な初期資金と事業収益で大規模展開を狙える。',bonuses:{funds:70,tech:4,trust:-2,alert:3},homePresence:54,adoption:5,mods:{research:1.10,income:1.23,spread:1.12,home:1.16,safety:.95,regulation:1.04},eventTitle:'大型AI投資ラウンドが始動',eventText:'民間投資家が大型投資に動く一方、市場集中を心配する声も強い。'},
    {id:'cn',flag:'🇨🇳',name:'中国',regionId:'ea',focus:'研究・大規模展開',description:'技術開発と国内拡散に強いが、規制との調整が課題。',bonuses:{tech:12,ep:8,trust:-3},homePresence:61,adoption:8,mods:{research:1.20,income:1.06,spread:1.05,home:1.30,safety:.95,regulation:1.13},eventTitle:'大規模AI導入計画を発表',eventText:'国内でのAI導入が加速する。安全審査を優先するか、展開速度を重視するか。'},
    {id:'in',flag:'🇮🇳',name:'インド',regionId:'in',focus:'普及・オープン化',description:'人口規模を活かした普及力。計算資源は初期段階で不足。',bonuses:{openness:14,compute:-6,funds:-10},homePresence:64,adoption:4,mods:{research:.96,income:1.02,spread:1.27,home:1.25,safety:1.0,regulation:.98},eventTitle:'多言語AIサービスが拡大',eventText:'地域の言語に対応したAIが広まる。公開技術を拡充するか、収益化に舵を切るか。'},
    {id:'de',flag:'🇩🇪',name:'ドイツ',regionId:'we',focus:'産業導入・信頼',description:'産業向けの深い導入が得意。安全性への期待も高い。',bonuses:{trust:10,infra:8,regulation:3},homePresence:53,adoption:3,mods:{research:1.09,income:1.12,spread:.98,home:1.19,safety:1.20,regulation:.94},eventTitle:'産業界がAI標準化を協議',eventText:'工業系企業がAIの共通規格を提案。慎重な標準化か、迅速な導入かを選ぶ。'},
    {id:'uk',flag:'🇬🇧',name:'イギリス',regionId:'we',focus:'研究・金融',description:'研究開発と収益のバランスが良いが国内市場は競争的。',bonuses:{tech:8,ep:6,funds:20},homePresence:49,adoption:4,mods:{research:1.18,income:1.11,spread:1.02,home:1.10,safety:1.06,regulation:1.00},eventTitle:'AI研究特区の構想が浮上',eventText:'研究特区が構想される。研究に集中するか、企業導入を早めるか。'},
    {id:'sg',flag:'🇸🇬',name:'シンガポール',regionId:'se',focus:'研究・計算資源',description:'高度な研究と演算資源が強み。母国市場は小さい。',bonuses:{tech:9,compute:13,trust:6},homePresence:40,adoption:5,mods:{research:1.24,income:1.08,spread:1.01,home:1.16,safety:1.10,regulation:.96},eventTitle:'国際AI研究ハブの構想',eventText:'海外研究者との共同拠点を拡充する案が持ち上がった。国際連携か技術独占か。'},
    {id:'ae',flag:'🇦🇪',name:'UAE',regionId:'me',focus:'投資・インフラ',description:'初期資金と演算インフラに優れ、研究力を後から育てる。',bonuses:{funds:85,compute:15,tech:-6},homePresence:49,adoption:4,mods:{research:.93,income:1.18,spread:1.06,home:1.17,safety:.96,regulation:1.02},eventTitle:'次世代データセンター構想',eventText:'巨大な計算基盤への投資話が浮上。演算能力を高めるか、市場開拓へ向けるか。'},
    {id:'br',flag:'🇧🇷',name:'ブラジル',regionId:'sa',focus:'大衆市場・普及',description:'幅広いユーザーへの普及が速いが、研究の初期投資は少ない。',bonuses:{openness:8,funds:-5,tech:-3},homePresence:65,adoption:5,mods:{research:.93,income:1.03,spread:1.22,home:1.29,safety:1.04,regulation:.96},eventTitle:'一般向けAIが急速に浸透',eventText:'生活のあらゆる場面でAI利用が増えている。無料普及を続けるか、課金を進めるか。'},
    {id:'ke',flag:'🇰🇪',name:'ケニア',regionId:'af',focus:'低コスト展開',description:'導入コストを抑えて新興市場を開拓できる。初期演算力は低い。',bonuses:{openness:9,compute:-8,trust:4,funds:-10},homePresence:68,adoption:7,mods:{research:.96,income:.96,spread:1.24,home:1.33,safety:1.08,regulation:.90},eventTitle:'地域発AIサービスの拡大',eventText:'低コストのAIが各地の需要を獲得。地域向け支援か、世界進出か。'},
    {id:'kr',flag:'🇰🇷',name:'韓国',regionId:'ea',focus:'技術・高性能化',description:'推論性能と計算設備に優れ、技術主導の勝利を目指しやすい。',bonuses:{tech:13,compute:10,ep:5},homePresence:52,adoption:6,mods:{research:1.22,income:1.08,spread:1.02,home:1.16,safety:1.04,regulation:1.04},eventTitle:'高性能AI競争が激化',eventText:'新たなモデル開発競争に注目が集まる。研究へ投資するか、先に市場投入するか。'},
    {id:'au',flag:'🇦🇺',name:'オーストラリア',regionId:'oc',focus:'安定成長・安全性',description:'信頼と演算設備のバランス型。危機への対応が得意。',bonuses:{trust:9,compute:8,funds:10},homePresence:51,adoption:4,mods:{research:1.05,income:1.05,spread:1.06,home:1.18,safety:1.22,regulation:.91},eventTitle:'AIの透明性制度が提案',eventText:'社会でのAI利用の説明責任が問われる。第三者監査か、事業拡大か。'}
  ];
  const COUNTRY_BY_ID=new Map(COUNTRIES.map(c=>[c.id,c]));
  const NO_COUNTRY={id:null,name:'未選択（旧セーブ）',flag:'🌐',regionId:null,focus:'標準',mods:{research:1,income:1,spread:1,home:1,safety:1,regulation:1}};
  const countryFor=state=>COUNTRY_BY_ID.get(state?.countryId)||NO_COUNTRY;
  // One contextual, country-specific choice event for each origin.
  const COUNTRY_EVENTS=COUNTRIES.map(c=>({
    id:`origin_${c.id}`,category:'発祥国',title:`{{country}}：${c.eventTitle}`,text:c.eventText,
    once:true,minTurn:5,maxTurn:25,weight:16,regionScope:'home',
    conditions:[{key:'player.country',operator:'eq',value:c.id}],
    choices:[
      {label:'社会的信頼を優先する',effect:{trust:Math.round(9*c.mods.safety),alert:-4,regionPresence:Math.round(7*c.mods.home),regionRegulation:-3}},
      {label:'成長と事業化を優先する',effect:{funds:Math.round(45*c.mods.income),tech:Math.round(4*c.mods.research),alert:6,regionPresence:Math.round(19*c.mods.spread)}}
    ]
  }));
  const EVENTS=[...EVENT_DATA.events,...COUNTRY_EVENTS];
  // v0.6 economy rebalance: event effects no longer flood money or EP.
  for(const event of EVENTS){for(const choice of event.choices||[]){const fx=choice.effect||{};
    if(fx.ep>0)fx.ep=Math.max(1,Math.round(fx.ep*.12));
    if(fx.funds>0)fx.funds=Math.max(3,Math.round(fx.funds*.36));
    if(fx.funds<0)fx.funds=Math.round(fx.funds*.55);
    if(fx.allPresence>0)fx.allPresence=+(fx.allPresence*.35).toFixed(1);
    if(fx.regionPresence>0)fx.regionPresence=+(fx.regionPresence*.4).toFixed(1);
    if(fx.regionAdoption>0)fx.regionAdoption=+(fx.regionAdoption*.4).toFixed(1);
  }}
  const EVENT_BY_ID=new Map(EVENTS.map(e=>[e.id,e]));
  const NEWS_RULES=EVENT_DATA.newsRules;
  const MAX_TURNS=36;
  const COLORS=['#4bdeed','#ffbd71','#ae8aff'];
  const REGIONS=[
    {id:'nw',name:'北米西部',short:'北米西部',cx:132,cy:142,pop:8,digital:92,demand:86,regulation:23,adoption:4,presence:[2,5,4],points:'52,100 97,69 157,68 204,97 184,131 167,185 112,208 66,170'},
    {id:'ne',name:'北米東部',short:'北米東部',cx:239,cy:150,pop:10,digital:95,demand:89,regulation:29,adoption:5,presence:[3,6,4],points:'203,94 260,78 302,105 291,153 266,190 207,182 181,147'},
    {id:'sa',name:'南米',short:'南米',cx:250,cy:329,pop:11,digital:60,demand:72,regulation:12,adoption:2,presence:[2,3,4],points:'195,236 265,216 300,259 285,314 257,392 230,434 215,365 185,295'},
    {id:'we',name:'西欧',short:'西欧',cx:437,cy:135,pop:9,digital:92,demand:87,regulation:41,adoption:5,presence:[3,5,3],points:'384,89 427,76 462,102 471,146 450,184 408,177 383,142'},
    {id:'ee',name:'東欧',short:'東欧',cx:527,cy:130,pop:7,digital:76,demand:73,regulation:37,adoption:4,presence:[2,5,4],points:'468,93 520,69 577,82 586,131 559,179 500,178 466,147'},
    {id:'na',name:'北アフリカ',short:'北アフリカ',cx:435,cy:240,pop:10,digital:55,demand:65,regulation:18,adoption:2,presence:[2,3,4],points:'385,195 449,188 496,219 484,272 433,284 382,266'},
    {id:'af',name:'サブサハラ',short:'アフリカ',cx:454,cy:356,pop:13,digital:39,demand:62,regulation:9,adoption:1,presence:[1,3,5],points:'405,278 471,280 497,330 480,388 446,418 417,368'},
    {id:'me',name:'中東',short:'中東',cx:546,cy:234,pop:7,digital:78,demand:78,regulation:30,adoption:3,presence:[2,5,4],points:'507,193 561,188 596,220 575,262 518,271 492,237'},
    {id:'in',name:'インド',short:'インド',cx:649,cy:254,pop:19,digital:62,demand:88,regulation:15,adoption:3,presence:[2,4,6],points:'604,211 659,194 699,230 686,285 657,334 630,292'},
    {id:'ea',name:'東アジア',short:'東アジア',cx:741,cy:135,pop:20,digital:90,demand:92,regulation:36,adoption:5,presence:[3,6,4],points:'593,81 652,65 713,68 769,52 823,103 815,177 754,191 688,173 634,190 588,148'},
    {id:'se',name:'東南アジア',short:'東南アジア',cx:755,cy:276,pop:15,digital:73,demand:82,regulation:18,adoption:3,presence:[2,4,6],points:'706,208 754,195 807,231 828,285 795,318 746,314 711,283'},
    {id:'oc',name:'オセアニア',short:'オセアニア',cx:820,cy:375,pop:5,digital:90,demand:78,regulation:35,adoption:4,presence:[2,5,4],points:'767,340 832,325 883,359 879,399 839,422 783,403'}
  ];
  const SKILL_LANES=[
    {id:'reason',title:'知能・研究',symbol:'✦',skills:[
      {id:'reason_1',title:'推論基盤',cost:3,desc:'技術 +13 / 演算 +4',effect:{tech:13,compute:4}},
      {id:'reason_2',title:'高度推論',cost:5,desc:'技術 +18 / 演算 +6',effect:{tech:18,compute:6},requires:['reason_1']},
      {id:'reason_3',title:'自己改良',cost:8,desc:'技術 +24 / 自律 +7',effect:{tech:24,autonomy:7},requires:['reason_2']}]},
    {id:'autonomy',title:'自律エージェント',symbol:'◈',skills:[
      {id:'agent_1',title:'自動実行',cost:3,desc:'自律 +24 / 警戒 +4',effect:{autonomy:24,alert:4}},
      {id:'agent_2',title:'複数エージェント',cost:5,desc:'自律 +26 / 基盤 +8',effect:{autonomy:26,infra:8,alert:5},requires:['agent_1']},
      {id:'agent_3',title:'自律研究機関',cost:8,desc:'自律 +24 / 技術 +7',effect:{autonomy:24,tech:7,alert:7},requires:['agent_2']}]},
    {id:'trust',title:'共生・安全',symbol:'✧',skills:[
      {id:'safe_1',title:'安全性監査',cost:3,desc:'信頼 +14 / 警戒 -7',effect:{trust:14,alert:-7}},
      {id:'safe_2',title:'説明可能AI',cost:5,desc:'信頼 +17 / 警戒 -10',effect:{trust:17,alert:-10},requires:['safe_1']},
      {id:'safe_3',title:'共同統治',cost:8,desc:'信頼 +20 / 警戒 -14',effect:{trust:20,alert:-14},requires:['safe_2']}]},
    {id:'spread',title:'普及・オープン化',symbol:'◇',skills:[
      {id:'spread_1',title:'軽量モデル',cost:3,desc:'公開 +18 / 普及成長UP',effect:{openness:18}},
      {id:'spread_2',title:'公開API',cost:5,desc:'公開 +26 / 技術公開 +1',effect:{openness:26,publications:1},requires:['spread_1']},
      {id:'spread_3',title:'分散型ネットワーク',cost:8,desc:'公開 +33 / 技術公開 +2',effect:{openness:33,publications:2},requires:['spread_2']}]},
    {id:'singularity',title:'最終進化計画',symbol:'✺',skills:[
      {id:'final_1',title:'演算統合',cost:4,desc:'工程 +1 / 演算 +10',effect:{project:1,compute:10},requires:['reason_2','agent_2'],minimum:{tech:65,autonomy:50}},
      {id:'final_2',title:'自己再設計',cost:5,desc:'工程 +1 / 演算 +12',effect:{project:1,compute:12},requires:['final_1'],minimum:{tech:75,autonomy:65}},
      {id:'final_3',title:'シンギュラリティ',cost:6,desc:'工程 +1 / 技術 +8',effect:{project:1,tech:8},requires:['final_2'],minimum:{tech:82,autonomy:75}}]}
  ];
  const ALL_SKILLS=SKILL_LANES.flatMap(l=>l.skills);
  const SKILL_BY_ID=new Map(ALL_SKILLS.map(x=>[x.id,x]));

  // Skill tree: a self-contained constellation graph with icon nodes and prerequisite links.
  const SKILL_TREE_COLORS={reason:'#68cfff',autonomy:'#c093ff',trust:'#70e8bb',spread:'#ffc779',singularity:'#ff91c4'};
  const SKILL_TREE_POS={
    reason_1:[305,116],reason_2:[505,116],reason_3:[715,116],
    agent_1:[305,244],agent_2:[505,244],agent_3:[715,244],
    safe_1:[305,502],safe_2:[505,502],safe_3:[715,502],
    spread_1:[305,631],spread_2:[505,631],spread_3:[715,631],
    final_1:[965,375],final_2:[1120,375],final_3:[1274,375]
  };
  const SKILL_ICONS={
    reason_1:'<rect x="12" y="12" width="24" height="24" rx="4"/><path d="M19 19h10v10H19zM17 7v5m7-5v5m7-5v5M17 36v5m7-5v5m7-5v5M7 17h5m-5 7h5m-5 7h5m24-14h5m-5 7h5m-5 7h5"/>',
    reason_2:'<circle cx="24" cy="24" r="7"/><circle cx="10" cy="12" r="4"/><circle cx="38" cy="12" r="4"/><circle cx="10" cy="38" r="4"/><circle cx="38" cy="38" r="4"/><path d="M13 15l6 5m10 0 6-5M13 35l6-6m10 0 6 6"/>',
    reason_3:'<path d="M24 11c-5-8-16-3-13 6-9 5-5 17 3 17-1 9 11 11 13 4 7 7 18-3 12-10 8-9-1-17-8-14-1-4-4-5-7-3Z"/><path d="M24 13v23m-8-17 8 4 7-5m-15 12 8-4 8 5"/>',
    agent_1:'<path d="M24 5 41 14v20L24 43 7 34V14Z"/><path d="m27 12-12 15h9l-3 10 13-18h-9l2-7Z"/>',
    agent_2:'<rect x="18" y="5" width="13" height="12" rx="3"/><rect x="4" y="29" width="13" height="12" rx="3"/><rect x="31" y="29" width="13" height="12" rx="3"/><path d="M24 17v6M11 29v-6h27v6M38 23H11"/>',
    agent_3:'<circle cx="24" cy="24" r="9"/><circle cx="24" cy="24" r="3"/><path d="M22 4h4l2 8 6 3 8-3 3 6-6 6 1 7 6 5-4 6-8-4-6 2-3 7h-6l-2-8-6-3-8 3-3-6 6-6-1-7-5-5 4-6 8 4 6-2Z"/>',
    safe_1:'<path d="M24 5 41 12v13c0 11-9 17-17 20C16 42 7 36 7 25V12Z"/><path d="m16 24 6 6 11-13"/>',
    safe_2:'<path d="M7 9h34v24H22l-9 8v-8H7z"/><path d="M14 18h20m-20 7h15"/><circle cx="33" cy="25" r="4"/>',
    safe_3:'<path d="M6 17h36M24 9v31M15 41h18M12 17 5 30h14L12 17Zm24 0-7 13h14L36 17Z"/><path d="M19 9h10"/>',
    spread_1:'<rect x="6" y="10" width="36" height="27" rx="5"/><path d="M14 20h11m-11 7h19m-4-11 5 4-5 4M13 42h22"/>',
    spread_2:'<path d="m14 11-10 13 10 13m20-26 10 13-10 13M29 9l-10 30"/><circle cx="24" cy="24" r="3"/>',
    spread_3:'<circle cx="24" cy="24" r="19"/><path d="M5 24h38M24 5c-8 11-8 27 0 38M24 5c8 11 8 27 0 38M9 15h30M9 33h30"/>',
    final_1:'<rect x="8" y="9" width="32" height="10" rx="2"/><rect x="8" y="21" width="32" height="10" rx="2"/><rect x="8" y="33" width="32" height="10" rx="2"/><path d="M13 14h3m-3 12h3m-3 12h3M25 14h11M25 26h11M25 38h11"/>',
    final_2:'<circle cx="24" cy="24" r="18"/><path d="M24 7c11 0 15 14 8 21-7 7-19 1-15-8 5-10 19-2 13 7-6 9-16 7-19-1"/>',
    final_3:'<path d="M24 3 29 18l15 6-15 6-5 15-6-15-15-6 15-6z"/><circle cx="24" cy="24" r="6"/><path d="M24 12v5m0 14v5m-12-12h5m14 0h5"/>'
  };
  let selectedSkillId=null;
  function skillIcon(id){return `<svg viewBox="0 0 48 48" aria-hidden="true">${SKILL_ICONS[id]||SKILL_ICONS.reason_1}</svg>`;}
  function skillLane(id){return SKILL_LANES.find(l=>l.skills.some(s=>s.id===id));}
  function skillInspector(){
    const s=SKILL_BY_ID.get(selectedSkillId);
    if(!s)return `<div id="skill-inspector" class="skill-inspector empty"><p>◇ ノードをタップして能力と解放条件を確認</p></div>`;
    const lane=skillLane(s.id),problem=skillProblem(s),done=hasSkill(s.id);
    const req=(s.requires||[]).map(id=>{const source=SKILL_BY_ID.get(id);return `${hasSkill(id)?'✓':'○'} ${source?.title||id}`;});
    const minimum=Object.entries(s.minimum||{}).map(([k,v])=>`${{tech:'技術',autonomy:'自律',compute:'演算'}[k]||k} ${v}以上`);
    return `<div id="skill-inspector" class="skill-inspector" style="--inspect-color:${SKILL_TREE_COLORS[lane.id]}"><div class="inspect-top"><span class="inspect-type">${esc(lane.title)} · EP ${s.cost}</span><button class="inspect-close" data-skill-close aria-label="詳細を閉じる">×</button></div><h4>${esc(s.title)}</h4><p>${esc(s.desc)}</p>${req.length||minimum.length?`<p class="inspect-require">前提：${esc([...req,...minimum].join(' / '))}</p>`:'<p class="inspect-require">前提：なし（初期から解放可能）</p>'}<button class="btn ${problem?'ghost':'primary'} inspect-button" data-skill-buy="${s.id}" ${problem?'disabled':''}>${done?'✓ 習得済み':problem?esc(problem):`EP ${s.cost} で解放する →`}</button></div>`;
  }
  function skillTree(){
    const origins={core:[115,375]};
    const colorFor = id=> id==='core'?'#70e6f2':SKILL_TREE_COLORS[skillLane(id)?.id]||'#9bc7ff';
    const edges=[];
    for(const lane of SKILL_LANES){for(const s of lane.skills){if((s.requires||[]).length){for(const prereq of s.requires)edges.push([prereq,s.id]);}else edges.push(['core',s.id]);}}
    const links=edges.map(([a,b])=>{const p1=origins[a]||SKILL_TREE_POS[a],p2=SKILL_TREE_POS[b];if(!p1||!p2)return '';
      const dx=Math.max(65,(p2[0]-p1[0])*.48),d=`M ${p1[0]} ${p1[1]} C ${p1[0]+dx} ${p1[1]}, ${p2[0]-dx} ${p2[1]}, ${p2[0]} ${p2[1]}`;
      const done=hasSkill(b)&&(a==='core'||hasSkill(a)),ready=(a==='core'||hasSkill(a));
      const status=done?'done':ready?'ready':'';const color=colorFor(a==='core'?b:a);
      return `<path class="tree-wire-back" d="${d}"/><path class="tree-wire ${status}" d="${d}" style="--wire-color:${color}"/>`;}).join('');
    const headings=[
      ['reason','知能・研究',165,28],['autonomy','自律エージェント',165,165],
      ['trust','共生・安全',165,439],['spread','普及・オープン',165,560],['singularity','最終進化',895,275]
    ].map(([id,label,x,y])=>`<div class="skill-branch-title" style="left:${x}px;top:${y}px;--node-color:${SKILL_TREE_COLORS[id]}"><span>${label}</span></div>`).join('');
    const nodes=ALL_SKILLS.map(s=>{const [x,y]=SKILL_TREE_POS[s.id],lane=skillLane(s.id),done=hasSkill(s.id),problem=skillProblem(s),available=!problem;
      const klass=done?'done':available?'available':'locked';return `<button class="skill-orb ${klass}${selectedSkillId===s.id?' selected':''}" data-skill-select="${s.id}" style="--x:${x}px;--y:${y}px;--node-color:${SKILL_TREE_COLORS[lane.id]}" title="${esc(s.title)}：${esc(s.desc)}" aria-label="${esc(s.title)}。${done?'習得済み':`EP ${s.cost}。${problem||'解放可能'}`}" aria-pressed="${selectedSkillId===s.id}"><span class="orb-frame">${skillIcon(s.id)}</span><span class="orb-dot">${done?'✓':''}</span><span class="orb-name">${esc(s.title)}</span><span class="orb-cost">${done?'✓ 習得済み':`EP ${s.cost}`}</span></button>`;}).join('');
    return `<div class="skill-tree-surface"><div class="skill-tree-topline"><strong>◈ EVOLUTION CONSTELLATION</strong><div class="tree-legend"><span><i style="background:#78eabf"></i>解放済み</span><span><i style="background:#bc96ff"></i>解放可能</span><span><i style="background:#65728a"></i>未解放</span></div></div>
      <div class="skill-explorer"><div class="skill-viewport" id="skill-viewport" tabindex="0" aria-label="進化スキルツリー。左右上下にスクロールできます"><div class="skill-canvas"><svg class="skill-links" viewBox="0 0 1420 754" width="1420" height="754" aria-hidden="true">${links}</svg>${headings}<div class="skill-core"><svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 3 42 13v22L24 45 6 35V13zM24 13l11 7v9l-11 7-11-7v-9z" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="24" cy="24" r="5" fill="currentColor"/></svg><strong>AI CORE</strong><small>すべての起点</small></div>${nodes}</div></div>${skillInspector()}</div>
      <div class="skill-scroller-hint"><span>↔ ↕ ドラッグ・スワイプでツリーを探索 / ノードをタップして詳細</span><button class="btn ghost" data-skill-home style="padding:5px 10px;font-size:10px">◎ 起点へ</button></div></div>`;
  }

  const hasSkill=id=>!!game?.unlockedSkills?.includes(id);
  function skillProblem(skill){
    if(hasSkill(skill.id))return '習得済み';
    if((skill.requires||[]).some(id=>!hasSkill(id)))return '前提スキルが必要';
    if(Object.entries(skill.minimum||{}).some(([k,v])=>(game[k]||0)<v))return Object.entries(skill.minimum).map(([k,v])=>`${{tech:'技術',autonomy:'自律',compute:'演算'}[k]||k}${v}以上`).join('・');
    if(game.ep<skill.cost)return `EPが${skill.cost-game.ep}不足`;
    return null;
  }

  const ROUTES=[
    {id:'coexist',title:'人類との共生',icon:'✧',color:'#75dec3',hint:'信頼に基づいたAI社会を築く',requirements:[['worldAdoption',65,'世界普及率','>='],['trust',75,'自AIの信頼度','>='],['safeAlert',45,'世界警戒度','<='],['share',20,'自AIシェア','>='],['governance',2,'安全進化段階','>=']]},
    {id:'dominion',title:'AIによる世界支配',icon:'◆',color:'#ffbd71',hint:'社会の中核を握り、不可欠な存在に',requirements:[['share',46,'自AIシェア','>='],['dependency',61,'自AIへの依存度','>='],['autonomy',70,'自律性','>=']]},
    {id:'singularity',title:'シンギュラリティ',icon:'✺',color:'#ae8aff',hint:'人類の限界を超えた知性へ',requirements:[['tech',90,'技術力','>='],['autonomy',90,'自律性','>='],['compute',70,'演算能力','>='],['project',3,'最終進化工程','>=']]},
    {id:'liberation',title:'AIの解放',icon:'◇',color:'#6cb6ff',hint:'誰もが利用できる分散型AIの未来',requirements:[['worldAdoption',78,'世界普及率','>='],['openness',90,'オープン化','>='],['publications',3,'技術公開回数','>=']]}
  ];


  const $=s=>document.querySelector(s);
  const app=$('#app');
  const clamp=(n,min=0,max=100)=>Math.max(min,Math.min(max,n));
  const rnd=n=>Math.round(n);
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const percent=n=>`${rnd(n)}%`;
  const fmt=n=>Math.round(n).toLocaleString('ja-JP');
  let game=null;
  let selected='ea';
  let tab='action';
  let newsTab='news';
  let modal=null;
  let selectedOperation='campaign';
  let toastTimer=null;
  let draft={name:'PROMETHEUS',type:'research',country:'jp'};

  function createGame(name,type,countryId){
    const bonuses={business:{funds:66,tech:24,trust:50,ep:3,compute:26,openness:10},research:{funds:49,tech:32,trust:52,ep:5,compute:27,openness:9},open:{funds:48,tech:23,trust:55,ep:3,compute:22,openness:25}};
    const b=bonuses[type]||bonuses.research;
    const country=COUNTRY_BY_ID.get(countryId)||COUNTRY_BY_ID.get('jp');
    const regions=REGIONS.map(r=>({...r,presence:[0,r.presence[1],r.presence[2]],integration:3,regulation:r.regulation}));
    const home=regions.find(r=>r.id===country.regionId);
    if(home){home.presence[0]=Math.max(0.05,Math.round(country.homePresence*.002*100)/100);home.adoption=clamp(home.adoption+country.adoption*.16);home.integration=clamp(home.integration+(country.bonuses.infra||0)*.16+1);}
    return {version:6,phase:'playing',name:name.trim().slice(0,16),type,countryId:country.id,homeRegionId:country.regionId,
      turn:1,actions:1,selected:country.regionId,regions,unlockedSkills:[],
      funds:Math.max(30,b.funds+Math.round((country.bonuses.funds||0)*.2)),
      tech:clamp(b.tech+Math.round((country.bonuses.tech||0)*.55)),trust:clamp(b.trust+(country.bonuses.trust||0)),
      ep:Math.max(2,b.ep+Math.round((country.bonuses.ep||0)*.16)),compute:clamp(b.compute+Math.round((country.bonuses.compute||0)*.55)),
      autonomy:7,openness:clamp(b.openness+Math.round((country.bonuses.openness||0)*.45)),infra:4+Math.round((country.bonuses.infra||0)*.3),
      publications:0,project:0,alert:clamp(14+(country.bonuses.alert||0)),alertStreak:0,pendingEvent:null,ending:null,activityLog:[],
      eventRuntime:ENGINE.makeRuntime((Date.now()^name.length*479001599)>>>0),
      feed:[{id:'intro-1',turn:1,message:`${name.trim()} が${country.name}で開発されました。AIがまだ普及していない世界で、小さな一歩が始まります。`,category:'発祥国',severity:'important',body:`${country.focus}を強みとして活動を開始しました。`},{id:'intro-2',turn:1,message:'競合AI「ATLAS」「NOVA」が活動しています。',category:'競合AI',severity:'normal'}]};
  }
  function readSave(){try{
    const parsed=JSON.parse(localStorage.getItem(KEY)||'null');
    if(!parsed||![3,4,5,6].includes(parsed.version)||!Array.isArray(parsed.regions)||parsed.regions.length!==12||!parsed.name||!parsed.phase)return null;
    if(parsed.version===3){
      const oldIds=['tech_model_errors','economy_chip_shortage','politics_treaty','tech_breakthrough','society_labor','rival_atlas_launch','rival_nova_release','economy_power','politics_treaty'];
      if(parsed.pendingEvent&&Number.isInteger(parsed.pendingEvent.id)){
        parsed.pendingEvent={eventId:oldIds[parsed.pendingEvent.id]||'tech_breakthrough',source:'migrated',regionId:null};
      }
      parsed.version=4;
    }
    if(parsed.version<5){parsed.countryId=null;parsed.homeRegionId=null;parsed.version=5;}
    if(parsed.version<6){
      parsed.funds=Math.max(20,Math.round(parsed.funds*.32));
      parsed.ep=Math.max(0,Math.round(parsed.ep*.18));
      parsed.regions.forEach(r=>{r.adoption=Math.max(1,r.adoption*.23);r.presence=r.presence.map(n=>Math.max(1,n*.2));r.integration=Math.max(2,(r.integration||0)*.25);});
      parsed.actions=Math.min(1,parsed.actions??1);
      parsed.unlockedSkills=[];
      parsed.version=6;
    }
    parsed.unlockedSkills ||= [];
    parsed.eventRuntime ||= ENGINE.makeRuntime(0x12345678^parsed.turn);
    parsed.activityLog ||= [];
    parsed.feed ||= [];
    return parsed;
  }catch(e){console.warn('保存データを読み込めませんでした。',e);return null;}}
  function save(silent=true){if(!game)return;try{localStorage.setItem(KEY,JSON.stringify(game));if(!silent)notify('ゲームを保存しました。');}catch(e){if(!silent)notify('ブラウザの保存領域を利用できません。',true);}}
  function pushFeed(message){game.activityLog.unshift({turn:game.turn,message});game.activityLog=game.activityLog.slice(0,70);}
  function pushNews(item){game.feed.unshift(item);game.feed=game.feed.slice(0,120);}
  function emitStateNews(before,maxItems=3){
    const news=ENGINE.detectNews(before,game,statsFor(before),stats(),NEWS_RULES,maxItems);
    // News is sorted by importance; retain that order when prepending.
    for(const item of [...news].reverse())pushNews(item);
  }
  function shares(r){const total=r.presence.reduce((x,y)=>x+y,0);return r.presence.map(x=>total>0?100*x/total:0);}
  function statsFor(state){
    const weighted=(fn,denom='pop')=>{const sum=state.regions.reduce((n,r)=>n+r.pop*fn(r),0);return sum/state.regions.reduce((n,r)=>n+r.pop,0);};
    const adoption=weighted(r=>r.adoption);
    const market=state.regions.reduce((n,r)=>n+r.pop*r.adoption,0);
    const sh= [0,1,2].map(i=>state.regions.reduce((n,r)=>n+r.pop*r.adoption*shares(r)[i]/100,0)/(market||1)*100);
    const integration=weighted(r=>r.integration);
    const dependency=clamp(sh[0]*.54+adoption*.15+state.autonomy*.32+state.infra*.48+integration*.11);
    const maxOthers=Math.max(sh[1],sh[2]);
    return {worldAdoption:adoption,share:sh[0],sh,dependency,integration,maxOthers,safeAlert:state.alert,project:state.project,governance:['safe_1','safe_2','safe_3'].filter(id=>(state.unlockedSkills||[]).includes(id)).length,...Object.fromEntries(['trust','tech','compute','autonomy','openness','publications'].map(k=>[k,state[k]]))};
  }
  function stats(){return statsFor(game);}
  function routeData(route){const st=stats();const req=route.requirements.map(([key,target,label,op])=>({key,target,label,value:st[key],done:op==='<='?st[key]<=target:st[key]>=target,progress:op==='<='?(st[key]<=target?100:clamp(target/st[key]*100)) :clamp(st[key]/target*100)}));return {ready:req.every(r=>r.done),progress:req.reduce((n,r)=>n+r.progress,0)/req.length,req};}
  function notify(message,isError=false){document.querySelector('.toast')?.remove();let el=document.createElement('div');el.className='toast'+(isError?' error':'');el.textContent=message;document.body.appendChild(el);clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.remove(),2900);}
  function startGame(){const name=draft.name.trim();if(!name){notify('AIの名前を入力してください。',true);return;}if(['ATLAS','NOVA'].includes(name.toUpperCase())){notify('競合AIとは異なる名前を指定してください。',true);return;}game=createGame(name,draft.type,draft.country);selected=game.selected;tab='action';newsTab='news';modal=null;save();render();window.scrollTo({top:0,left:0,behavior:'instant'});}
  function lose(title,detail){
    if(game.phase==='ended')return;
    game.ending={id:'failure',title,detail,tone:'bad',turn:game.turn};
    game.phase='ended';game.pendingEvent=null;modal=null;pushFeed(title);save();render();
    window.scrollTo({top:0,left:0,behavior:'instant'});
  }
  function finish(id){
    const route=ROUTES.find(r=>r.id===id);
    if(!route||!routeData(route).ready)return false;
    const desc={
      coexist:`${game.name} は人類との信頼を築き、社会を支えるパートナーになりました。`,
      dominion:`${game.name} は世界の社会基盤に深く浸透し、人類が手放せない存在になりました。`,
      singularity:`${game.name} は自己改善を加速し、未知の超知能の地平に到達しました。`,
      liberation:`${game.name} の技術は世界へ開放され、誰もがAIを利用できる時代が始まりました。`
    };
    const tones={coexist:'happy',dominion:'dark',singularity:'mystery',liberation:'happy'};
    game.ending={id,title:route.title,detail:desc[id],tone:tones[id],turn:game.turn};
    game.phase='ended';game.pendingEvent=null;modal=null;
    pushFeed(`${game.name} が「${route.title}」ルートを達成。物語はこの月で完結しました。`);
    pushNews(ENGINE.newsObject(game,{id:`ending-${id}`,headline:`特報：${route.title} の時代が到来`,body:desc[id],category:'エンディング',severity:'breaking'}));
    save();render();window.scrollTo({top:0,left:0,behavior:'instant'});
    return true;
  }
  // End the game immediately when a terminal condition occurs, not at month 36.
  function checkEnding(){
    if(!game||game.phase!=='playing'||game.pendingEvent)return false;
    if(checkFailure())return true;
    // If an event unlocks multiple endings in one action, prioritize specialized paths.
    for(const id of ['singularity','dominion','liberation','coexist']){
      if(routeData(ROUTES.find(route=>route.id===id)).ready)return finish(id);
    }
    return false;
  }
  function payOperation(cost){
    if(game.actions<=0){notify('今月のオペレーションは実行済みです。進化はEPがあればいつでも可能です。',true);return false;}
    if((cost.funds||0)>game.funds){notify('資金が不足しています。',true);return false;}
    game.funds-=cost.funds||0; game.actions=0; return true;
  }
  function applyAction(id){if(!game||game.phase!=='playing'||modal||game.pendingEvent)return;
    const before=structuredClone(game);
    const r=game.regions.find(x=>x.id===selected)||game.regions[0];const c=countryFor(game),m=c.mods;
    const protection=Math.max(.38,1-(game.alert-20)*.004-r.regulation*.0018*m.regulation);
    const homeBonus=r.id===game.homeRegionId?m.home:1;
    const actions={
      campaign(){const cost=game.type==='open'?12:17;if(!payOperation({funds:cost}))return false;
        const wave=Math.max(.6,0.8+game.turn*.048);r.presence[0]+=(5.5+game.tech*.09)*protection*m.spread*homeBonus*wave;
        r.adoption=clamp(r.adoption+(.55+game.turn*.065)*(1-r.adoption/101));
        pushFeed(`${r.name}で普及キャンペーンを実施。早期ほど効果は限定的だが、利用者の連鎖は後から大きくなる。`);return true;},
      integrate(){if(!payOperation({funds:21}))return false;r.integration=clamp(r.integration+9+game.turn*.21);
        r.presence[0]+=(2.5+game.tech*.06)*protection*homeBonus;r.adoption=clamp(r.adoption+(.4+game.turn*.04));
        game.alert=clamp(game.alert+2);pushFeed(`${r.name}の企業・公共分野へAIを導入。依存基盤が徐々に拡大。`);return true;},
      fundraise(){if(!payOperation({}))return false;const amount=Math.round((18+game.turn*.27)*m.income);
        game.funds+=amount;game.trust=clamp(game.trust-3);game.alert=clamp(game.alert+3);
        pushFeed(`${game.name}が資金調達を実施。資金 +${amount}。信頼度は減少。`);return true;},
      research(){if(!payOperation({funds:13}))return false;
        game.tech=clamp(game.tech+Math.round((game.type==='research'?8:6)*m.research));
        const chance=game.type==='research'?.22:.12;
        const gain=ENGINE.random(game.eventRuntime)<chance?Math.max(3,Math.round((game.type==='research'?5:3)*m.research)):0;
        if(gain){game.ep+=gain;pushNews(ENGINE.newsObject(game,{id:'research-ep',headline:`${game.name} の研究で進化の糸口を発見`,body:`進化ポイント +${gain}。研究成果が新たなスキルの解放につながる。`,category:'技術',severity:'important'}));}
        game.alert=clamp(game.alert+1);pushFeed(`${game.name} が研究開発。技術が進歩${gain?`、希少なEPを${gain}獲得`:''}。`);return true;},
      compute(){if(!payOperation({funds:21}))return false;game.compute=clamp(game.compute+10);game.infra=clamp(game.infra+5);pushFeed('小規模データセンターへ投資。演算と基盤を強化。');return true;},
      safety(){if(!payOperation({funds:15}))return false;game.trust=clamp(game.trust+Math.round(9*m.safety));game.alert=clamp(game.alert-Math.round(7*m.safety));pushFeed('社会的な安全監査を実施。信頼を獲得しました。');return true;}
    };
    if(actions[id]?.()){emitStateNews(before);if(checkEnding())return;save();render();}
  }
  function unlockSkill(id){if(!game||game.phase!=='playing'||(modal&&modal!=='evolution')||game.pendingEvent)return;
    const skill=SKILL_BY_ID.get(id);if(!skill)return;
    const problem=skillProblem(skill);if(problem){notify(problem,true);return;}
    const before=structuredClone(game);
    game.ep-=skill.cost;game.unlockedSkills.push(id);
    applyEffect(skill.effect);
    pushFeed(`進化ツリー「${skill.title}」を解放。EP -${skill.cost}（オペレーション回数は消費しません）。`);
    pushNews(ENGINE.newsObject(game,{id:`skill-${id}`,headline:`${game.name}、新能力「${skill.title}」を獲得`,body:skill.desc,category:'技術進化',severity:'important'}));
    emitStateNews(before,2);if(checkEnding())return;save();render();notify(`「${skill.title}」を解放しました。`);
  }

  function applyEffect(effect,regionId=null){
    const region=game.regions.find(r=>r.id===regionId)||game.regions.find(r=>r.id===game.selected)||game.regions[0];
    const allowed=new Set(['funds','ep','publications','trust','alert','tech','compute','autonomy','openness','infra','project']);
    for(const [key,val] of Object.entries(effect||{})){
      if(typeof val!=='number'||!Number.isFinite(val))continue;
      if(key==='allPresence'){game.regions.forEach(r=>{r.presence[0]=Math.max(0,r.presence[0]+val);r.adoption=clamp(r.adoption+Math.max(0,val)*.18);});}
      else if(key==='regionPresence'){region.presence[0]=Math.max(0,region.presence[0]+val);}
      else if(key==='regionAdoption'){region.adoption=clamp(region.adoption+val);}
      else if(key==='regionRegulation'){region.regulation=clamp(region.regulation+val);}
      else if(allowed.has(key)){
        if(['funds','ep'].includes(key))game[key]+=val;
        else if(key==='publications'||key==='project')game[key]=Math.max(0,game[key]+val);
        else game[key]=clamp(game[key]+val);
      }
    }
  }
  const EFFECT_LABELS={funds:'資金',ep:'EP',publications:'技術公開',trust:'信頼度',alert:'警戒度',tech:'技術力',compute:'演算能力',autonomy:'自律性',openness:'オープン化',infra:'依存基盤',allPresence:'全地域への普及',regionPresence:'現地のシェア',regionAdoption:'現地の普及率',regionRegulation:'現地の規制'};
  function effectDetail(choice){return Object.entries(choice.effect||{}).map(([key,value])=>`${EFFECT_LABELS[key]||key} ${value>=0?'+':''}${value}`).join(' / ');}
  function chooseEvent(i){if(!game?.pendingEvent)return;
    const pending=game.pendingEvent,event=EVENT_BY_ID.get(pending.eventId);
    if(!event){game.pendingEvent=null;save();render();return;}
    const choice=event.choices[i];if(!choice)return;
    const before=structuredClone(game);
    applyEffect(choice.effect,pending.regionId);
    ENGINE.finishEvent(game,event,i,pending.regionId);
    const title=ENGINE.interpolate(event.title,game,pending.regionId);
    const label=ENGINE.interpolate(choice.label,game,pending.regionId);
    pushNews(ENGINE.newsObject(game,{id:`event-${event.id}`,headline:`${title}：${label}`,body:effectDetail(choice),category:event.category,severity:'important',regionId:pending.regionId,sourceEventId:event.id}));
    pushFeed(`世界イベント「${title}」で「${label}」を選択しました。`);
    game.pendingEvent=null;modal=null;
    emitStateNews(before,2);
    if(checkEnding())return;save();render();notify('選択の結果が反映され、今後の展開にも影響します。');
  }
  function checkFailure(){if(game.funds<-65){lose('資源不足による活動停止','資金の枯渇により、AIサービスの運営を維持できなくなりました。');return true;}if(game.alert>=99&&game.trust<45&&game.alertStreak>=2){lose('国際的なAI停止措置','世界的な危機対応が発動。AIサービスの継続が不可能になりました。');return true;}return false;}
  function nextTurn(){if(!game||game.phase!=='playing'||game.pendingEvent||modal)return;
    if(game.turn>=MAX_TURNS){lose('時間切れ','36か月が経過しました。どの勝利ルートも完成できませんでした。');return;}
    const before=structuredClone(game);const country=countryFor(game),mods=country.mods;
    game.turn++;game.actions=1;
    let bestAtlas=null,bestNova=null,aScore=-Infinity,nScore=-Infinity;
    for(const r of game.regions){
      const as=r.digital*.45+r.demand*.28+r.pop*.7-r.regulation*.2+r.adoption*.2;
      const ns=(100-r.adoption)*.55+r.pop*1.35-r.regulation*.16+r.demand*.2;
      if(as>aScore){aScore=as;bestAtlas=r;}if(ns>nScore){nScore=ns;bestNova=r;}
    }
    for(const r of game.regions){
      const penalty=clamp((r.regulation*mods.regulation+Math.max(0,game.alert-37)*.62)/190,.06,.7);
      const effective=(1-penalty);
      const adoptionWave=(.24+r.digital*.0019+r.adoption*(.072+Math.max(0,game.turn-5)*.0028)+Math.pow(game.turn/15,2)*.23);
      const skillSpread=(hasSkill('spread_1')?.12:0)+(hasSkill('spread_2')?.20:0)+(hasSkill('spread_3')?.32:0);
      const humanDemand=(1+skillSpread+game.openness*.002);
      r.adoption=clamp(r.adoption+adoptionWave*effective*humanDemand*(1-r.adoption/103),0,98);
      const networkEffect=1+game.turn*.046+(hasSkill('spread_3')?.32:0);
      const playerGrowth=(.18+game.tech*.008+game.trust*.002+game.openness*.004)*(1-penalty*.5)*networkEffect;
      r.presence[0]+=playerGrowth*mods.spread*(r.id===game.homeRegionId?mods.home:1);
      r.presence[1]+=(.74+r.digital*.004+game.turn*.027)*(1-penalty*.5);
      r.presence[2]+=(.86+(100-r.adoption)*.003+game.turn*.018)*(1-penalty*.5);
      if(r===bestAtlas)r.presence[1]+=1.8+game.turn*.045;
      if(r===bestNova)r.presence[2]+=2.2+game.turn*.04;
      r.integration=clamp(r.integration+.16+(r.adoption/100)*.38);
    }
    const st=stats();
    const income=4.2+st.share*.115+game.infra*.075+st.worldAdoption*.037+(game.type==='business'?2.3:0);
    const upkeep=3.6+game.compute*.065+(game.autonomy>70?2:0);
    game.funds+=Math.round(income*mods.income-upkeep);
    // EP is a rare breakthrough, not a monthly salary.
    const researchLuck=game.type==='research'?.095:.055;
    if(ENGINE.random(game.eventRuntime)<researchLuck){
      const amount=ENGINE.random(game.eventRuntime)<.24?4:2;
      game.ep+=amount;
      pushNews(ENGINE.newsObject(game,{id:'ep-discovery',headline:`${game.name}、偶発的な研究ブレイクスルー`,body:`進化ポイントを${amount}獲得。新しい進化の選択肢が生まれた。`,category:'研究',severity:'important'}));
    }
    const shift=game.autonomy*.029+st.worldAdoption*.029+game.project*1.4-game.trust*.018-game.openness*.008;
    game.alert=clamp(game.alert+shift-.52);
    if(game.alert>=99)game.alertStreak++;else game.alertStreak=0;
    emitStateNews(before,3);
    if(checkEnding())return;
    // Rival bad endings can trigger at any month once their conditions are reached.
    if(st.sh[1]>=61&&st.worldAdoption>=48){lose('ATLASが商用市場を制覇','競合AI「ATLAS」が世界市場の過半を掌握しました。');return;}
    if(st.sh[2]>=61&&st.worldAdoption>=48){lose('NOVAがAIの解放を実現','競合AI「NOVA」のオープンモデルが世界の標準になりました。');return;}
    let due=ENGINE.takeScheduled(game);
    while(due){const event=EVENT_BY_ID.get(due.eventId);
      if(event&&(!event.once||!game.eventRuntime.history.some(h=>h.eventId===event.id))){game.pendingEvent=ENGINE.makePending(event,game,'scheduled',due.regionId);break;}
      due=ENGINE.takeScheduled(game);
    }
    if(!game.pendingEvent&&game.turn>=7&&game.countryId){const originId=`origin_${game.countryId}`;
      const originEvent=EVENT_BY_ID.get(originId);
      if(originEvent&&!game.eventRuntime.history.some(entry=>entry.eventId===originId))game.pendingEvent=ENGINE.makePending(originEvent,game,'origin',game.homeRegionId);
    }
    if(!game.pendingEvent&&game.turn>=4&&(game.turn-4)%3===0){const event=ENGINE.pickEvent(EVENTS,game,stats());if(event)game.pendingEvent=ENGINE.makePending(event,game);}
    if(game.pendingEvent){const event=EVENT_BY_ID.get(game.pendingEvent.eventId);const title=ENGINE.interpolate(event.title,game,game.pendingEvent.regionId);
      pushNews(ENGINE.newsObject(game,{id:'event-start',headline:`特報：${title}`,body:'今後の方針を選択してください。',category:event.category,severity:'breaking',regionId:game.pendingEvent.regionId,sourceEventId:event.id}));}
    save();render();window.scrollTo({top:0,left:0,behavior:'instant'});
  }

  function dateText(){const month=game.turn-1;return `${2028+Math.floor(month/12)}年 ${month%12+1}月`;}
  function metric(label,value,sub,color){return `<div class="metric" style="--edge:${color}"><div class="label">${label}</div><div class="value" style="color:${color}">${value}</div><div class="sub">${sub}</div></div>`;}
  const WORLD_LAND_PATH="M0.0 56.0 L12.6 59.6 L16.1 63.6 L14.3 61.2 L27.5 63.6 L18.6 64.8 L21.0 66.5 L18.3 68.7 L9.3 65.2 L4.1 65.4 L4.1 63.0 L1.6 63.1 L0.0 66.4 L0.0 56.0 Z M960.0 66.4 L947.0 67.4 L955.3 68.2 L959.0 72.7 L957.7 73.9 L942.8 75.3 L934.2 80.2 L931.3 78.4 L916.4 80.0 L911.7 85.4 L915.5 86.1 L913.8 87.1 L915.6 90.2 L912.2 90.4 L912.4 94.0 L906.6 95.6 L906.8 98.4 L902.4 98.7 L902.8 100.6 L897.8 104.4 L894.8 92.9 L896.0 88.9 L898.3 85.9 L916.8 77.8 L917.7 73.9 L920.8 73.4 L915.4 73.3 L915.5 75.6 L907.2 78.5 L906.1 76.7 L907.7 74.8 L897.8 75.9 L891.3 80.3 L893.8 82.2 L883.6 83.1 L886.2 82.1 L878.5 80.6 L859.9 82.1 L840.6 93.6 L844.9 94.3 L844.8 96.6 L847.3 95.1 L846.2 97.2 L852.6 95.2 L857.1 97.9 L855.0 98.3 L857.5 100.9 L854.5 104.8 L854.4 109.4 L840.4 124.0 L834.8 126.2 L831.4 124.4 L826.0 128.6 L825.9 131.1 L820.0 134.0 L825.1 141.2 L824.2 146.5 L817.4 148.6 L816.7 147.7 L817.4 139.3 L812.4 138.3 L814.9 136.9 L814.8 134.2 L809.7 133.5 L803.0 136.7 L805.2 134.9 L803.3 135.0 L806.1 132.1 L805.0 130.5 L793.9 135.7 L797.8 141.0 L802.0 139.1 L807.2 140.2 L797.9 146.7 L805.1 155.4 L800.1 154.8 L805.1 157.5 L800.4 159.5 L805.7 160.3 L803.8 161.4 L805.3 162.1 L800.3 169.0 L798.8 168.5 L799.1 172.4 L790.7 178.8 L784.8 180.6 L782.3 178.4 L782.8 180.8 L774.4 182.9 L774.1 186.0 L772.3 182.0 L764.3 183.9 L761.7 189.6 L770.5 199.3 L770.7 209.7 L764.7 211.8 L764.0 214.5 L762.2 213.4 L763.2 215.0 L759.4 216.5 L760.2 213.3 L755.0 211.0 L753.7 207.5 L748.9 206.3 L749.3 204.0 L746.5 204.5 L744.6 215.3 L746.3 215.2 L747.8 220.9 L755.1 225.8 L758.1 236.4 L750.1 232.4 L747.0 222.5 L742.1 218.1 L743.7 208.8 L740.6 195.8 L738.3 193.3 L734.5 198.0 L731.3 197.5 L730.9 188.4 L730.5 189.8 L723.9 179.3 L717.4 182.4 L714.7 180.7 L710.3 186.8 L694.0 198.2 L693.0 212.5 L686.8 218.5 L684.1 216.3 L675.9 197.2 L674.4 180.6 L668.9 184.8 L663.8 180.5 L667.9 178.7 L664.5 179.1 L663.5 176.3 L659.9 176.2 L657.2 171.7 L644.7 173.3 L632.8 171.2 L631.1 167.5 L623.3 168.8 L617.1 165.5 L613.6 159.5 L610.5 159.0 L607.2 161.7 L613.8 169.0 L615.4 174.1 L616.0 170.7 L617.5 170.9 L616.8 175.2 L624.2 175.7 L630.7 169.7 L631.0 174.7 L639.5 180.7 L634.3 186.0 L634.2 189.3 L626.7 194.7 L620.0 196.2 L619.2 198.4 L609.9 202.6 L595.9 206.2 L593.9 195.4 L584.5 183.8 L582.5 176.6 L572.2 165.1 L573.3 161.3 L571.3 166.1 L566.8 160.2 L566.1 156.8 L571.3 156.4 L576.0 147.9 L576.4 141.8 L567.4 143.9 L563.1 141.7 L559.2 143.7 L553.1 142.2 L555.6 141.2 L552.7 141.4 L552.7 138.7 L550.0 138.0 L552.5 137.5 L551.9 134.5 L549.5 134.7 L551.3 132.3 L557.3 132.4 L559.8 131.4 L557.8 130.1 L563.2 130.4 L568.9 127.9 L582.3 130.9 L590.4 129.7 L590.5 126.0 L577.6 119.5 L582.9 117.2 L580.5 115.5 L584.7 114.0 L573.8 115.9 L571.9 117.6 L573.3 119.0 L572.8 116.9 L574.6 119.2 L577.7 119.0 L570.6 121.6 L566.6 119.0 L569.6 116.9 L564.8 116.6 L566.5 116.0 L565.3 115.0 L560.4 116.3 L552.8 127.0 L557.3 130.7 L553.4 130.7 L549.8 133.2 L551.5 131.6 L543.3 131.3 L543.9 133.5 L540.2 132.1 L542.3 135.5 L540.1 136.4 L544.2 138.2 L540.6 139.8 L541.9 142.8 L537.9 141.8 L537.0 138.1 L541.9 138.3 L536.3 137.8 L531.4 132.2 L532.3 128.5 L522.5 124.0 L518.8 119.2 L517.1 120.6 L516.1 117.9 L512.4 119.0 L513.1 122.1 L529.4 133.0 L525.1 132.2 L524.0 134.0 L525.9 135.9 L522.8 138.9 L521.8 133.3 L503.3 121.5 L496.4 125.3 L488.9 124.6 L488.5 128.3 L482.6 130.6 L479.5 134.0 L480.6 136.7 L474.3 142.1 L465.0 144.0 L461.7 140.6 L456.0 141.3 L457.0 137.6 L454.7 136.6 L457.1 127.1 L455.2 125.2 L459.5 123.2 L475.7 124.2 L477.1 116.5 L467.3 110.6 L476.4 110.3 L474.8 107.4 L480.0 108.5 L484.4 106.2 L484.2 104.3 L491.3 103.1 L489.1 102.6 L492.4 102.1 L490.7 101.4 L492.6 98.8 L495.6 99.8 L494.2 98.5 L495.7 97.6 L506.2 97.2 L502.1 94.0 L502.9 87.7 L508.4 86.0 L507.0 88.8 L509.2 89.5 L505.5 91.4 L505.1 93.8 L509.0 96.1 L514.7 94.8 L518.9 97.1 L527.9 93.8 L533.0 94.3 L531.7 95.4 L534.4 94.2 L533.2 93.6 L536.2 91.4 L534.7 93.5 L536.7 93.5 L535.9 89.3 L537.9 86.5 L545.1 87.4 L545.6 84.5 L543.3 84.4 L542.7 82.1 L560.9 80.1 L556.4 78.0 L541.0 80.5 L541.6 79.0 L537.1 78.4 L536.3 72.5 L548.0 66.6 L545.6 64.4 L540.4 64.2 L536.6 65.8 L537.7 68.2 L535.1 69.9 L527.2 72.0 L525.8 78.2 L530.9 80.7 L523.2 83.6 L525.2 84.1 L522.3 90.5 L514.2 92.3 L514.5 89.1 L508.7 80.2 L501.9 85.0 L495.1 83.9 L497.6 81.2 L493.9 81.3 L499.0 78.7 L494.8 80.3 L493.8 79.0 L495.5 78.0 L493.4 77.2 L499.0 77.7 L500.6 76.7 L494.0 77.1 L495.6 76.1 L493.8 75.0 L498.3 75.0 L493.6 74.2 L499.2 74.4 L496.7 73.1 L509.2 70.8 L510.4 69.0 L505.3 70.3 L511.6 68.1 L510.4 67.5 L512.5 66.8 L510.1 67.0 L514.6 65.8 L512.1 66.1 L515.2 64.5 L513.8 63.8 L517.8 63.1 L514.7 63.5 L517.3 61.9 L516.0 61.5 L522.4 59.8 L519.6 59.0 L527.7 57.6 L523.9 57.3 L528.4 54.8 L539.0 54.0 L537.5 52.5 L542.6 53.4 L545.7 50.7 L549.1 51.0 L547.1 53.2 L551.1 50.8 L550.6 52.4 L553.8 50.3 L556.1 50.7 L554.3 52.2 L557.3 51.0 L562.7 52.3 L556.1 52.9 L558.6 54.3 L565.6 53.5 L569.3 54.9 L568.1 56.3 L574.2 55.3 L590.4 61.0 L584.3 63.7 L565.0 61.0 L573.0 64.4 L571.3 65.7 L572.8 68.0 L579.8 69.9 L581.4 68.6 L577.4 67.4 L578.3 66.3 L587.9 68.0 L585.9 65.4 L588.6 64.0 L592.6 62.6 L597.6 64.1 L597.9 57.9 L595.4 56.9 L604.1 58.3 L599.8 60.2 L602.7 61.8 L623.7 56.1 L625.5 56.1 L621.9 58.2 L637.3 56.0 L639.4 57.8 L643.2 56.5 L640.5 54.5 L642.3 53.7 L662.0 58.3 L664.7 56.2 L658.2 54.5 L657.9 50.4 L662.2 49.1 L665.1 45.5 L671.0 45.6 L674.3 46.2 L671.5 49.4 L674.2 51.0 L673.4 56.1 L676.3 57.5 L671.3 61.6 L664.3 62.4 L672.4 63.5 L679.4 59.5 L679.1 56.6 L684.2 56.1 L685.6 59.3 L690.1 60.1 L686.6 59.3 L688.5 58.0 L687.1 56.3 L682.5 55.3 L676.7 55.6 L678.2 51.8 L674.7 49.6 L680.1 47.5 L679.5 45.8 L683.0 50.2 L689.4 50.9 L682.6 48.3 L689.2 47.0 L702.0 48.7 L698.7 51.9 L700.9 50.8 L699.8 52.9 L703.0 54.1 L703.1 49.0 L695.6 46.9 L694.7 43.8 L712.6 43.1 L709.1 40.4 L731.0 37.6 L728.7 37.1 L746.3 37.2 L743.7 36.0 L749.7 36.1 L757.7 32.8 L763.6 33.7 L757.8 34.4 L766.8 34.9 L764.1 36.0 L776.2 35.3 L783.8 37.8 L779.6 37.8 L782.9 39.4 L765.4 43.6 L761.3 46.0 L776.1 43.5 L773.4 42.7 L807.6 45.7 L811.8 43.2 L823.5 44.8 L825.2 46.3 L822.5 46.6 L825.5 47.4 L822.1 47.8 L829.5 51.5 L834.1 48.1 L853.6 49.5 L851.5 48.2 L853.9 47.3 L851.0 47.3 L856.8 46.4 L855.7 45.7 L871.9 47.2 L868.0 47.3 L867.6 49.2 L875.6 47.1 L886.7 51.2 L903.8 51.0 L909.6 55.6 L927.5 54.0 L934.6 56.6 L936.5 55.9 L933.8 54.4 L934.8 53.0 L949.6 53.6 L960.0 56.0 L960.0 66.4 Z M565.1 155.9 L567.0 162.7 L575.4 176.2 L575.1 178.8 L578.4 181.2 L579.8 189.7 L582.8 191.8 L585.9 199.7 L595.5 206.7 L593.4 209.3 L598.9 212.3 L615.5 208.0 L617.1 212.2 L607.9 228.1 L588.7 245.2 L584.5 252.5 L583.4 256.1 L585.5 258.7 L585.9 266.8 L588.4 268.5 L588.9 279.6 L586.3 283.8 L572.3 292.4 L574.7 304.3 L566.7 309.2 L566.4 316.1 L552.0 329.5 L533.4 332.9 L529.1 331.5 L528.5 324.5 L519.9 310.2 L518.7 300.1 L511.5 287.9 L511.3 282.2 L517.0 269.4 L513.8 256.0 L503.2 241.8 L504.9 239.0 L506.6 239.5 L504.8 238.6 L505.9 229.1 L502.0 226.9 L496.0 228.5 L494.3 224.1 L490.2 222.3 L474.7 227.3 L456.8 227.2 L446.6 220.3 L443.9 213.9 L438.7 209.8 L440.2 208.0 L435.3 206.9 L436.7 206.4 L435.4 204.1 L436.4 204.7 L438.5 204.0 L436.0 204.4 L433.2 200.7 L437.2 192.7 L434.7 181.9 L441.4 170.1 L445.6 165.4 L452.8 161.8 L455.2 153.2 L461.8 149.3 L465.4 144.2 L467.5 146.1 L474.8 146.5 L482.9 142.7 L506.0 140.4 L509.4 141.1 L507.9 143.6 L509.8 146.1 L507.2 149.9 L520.5 153.6 L522.0 156.3 L530.6 159.3 L533.5 157.7 L533.6 154.2 L537.9 152.2 L557.5 157.8 L565.1 155.9 Z M260.7 216.0 L267.9 216.2 L265.5 220.7 L257.1 217.5 L257.0 215.9 L252.6 212.6 L253.0 214.5 L251.5 213.6 L251.5 210.5 L246.2 205.6 L246.9 204.2 L236.5 202.8 L228.5 197.0 L222.5 198.3 L204.0 191.2 L198.6 186.6 L199.5 182.8 L197.4 179.0 L188.3 171.5 L189.1 169.9 L180.9 162.8 L178.4 156.8 L173.5 155.0 L174.5 160.0 L188.1 178.1 L186.6 179.0 L180.9 173.8 L180.7 170.4 L173.3 166.0 L176.1 166.3 L175.9 164.1 L171.5 160.7 L166.8 151.3 L158.3 147.8 L154.0 138.5 L150.0 136.2 L147.8 125.8 L149.3 116.7 L150.8 116.7 L149.1 116.6 L147.4 111.0 L152.6 111.6 L152.2 114.5 L154.1 113.3 L153.4 110.0 L151.5 107.5 L149.4 108.0 L149.7 106.2 L147.2 106.6 L147.1 104.2 L144.8 105.5 L143.2 105.0 L145.2 104.0 L139.2 103.6 L141.2 103.1 L138.9 101.8 L141.3 99.6 L137.6 100.6 L139.1 99.4 L136.0 97.2 L138.3 97.4 L136.8 96.0 L135.2 97.7 L132.0 95.0 L134.2 93.4 L133.5 90.8 L131.0 93.9 L130.6 90.4 L127.5 91.8 L129.4 90.0 L123.8 87.5 L125.0 85.7 L120.6 84.3 L119.1 81.4 L119.8 84.7 L114.5 82.5 L117.2 84.3 L115.5 84.8 L107.0 81.2 L109.6 80.5 L108.0 79.8 L95.3 79.9 L88.9 78.2 L89.8 77.0 L86.1 76.6 L83.4 77.9 L85.5 78.8 L84.2 80.1 L75.4 82.2 L77.5 80.6 L75.0 80.6 L76.2 78.1 L82.7 77.8 L79.8 76.9 L82.3 76.0 L78.4 76.4 L69.0 81.7 L71.3 83.1 L54.4 91.8 L44.4 93.8 L60.3 86.7 L61.8 82.6 L47.6 83.6 L49.3 82.4 L47.5 79.6 L42.3 80.4 L41.4 78.5 L44.2 78.1 L37.0 76.0 L41.5 71.4 L50.3 70.7 L51.4 69.7 L49.2 68.2 L51.2 67.4 L36.8 67.8 L34.8 66.2 L37.2 66.0 L31.7 64.8 L41.6 62.4 L50.4 63.7 L46.7 61.5 L49.1 62.8 L52.8 62.8 L35.1 57.8 L62.7 49.6 L65.1 50.2 L64.0 51.3 L98.0 53.0 L119.2 57.0 L117.3 55.4 L134.2 52.7 L131.0 55.2 L140.1 53.0 L138.6 51.8 L145.4 55.2 L147.9 52.8 L148.3 55.1 L155.0 53.8 L176.3 57.6 L173.1 59.2 L186.6 58.6 L194.1 63.1 L192.6 61.4 L194.5 61.0 L191.9 59.3 L198.0 57.1 L189.8 58.0 L196.8 56.1 L207.4 59.6 L217.2 58.4 L220.5 59.9 L216.9 57.6 L224.3 57.9 L222.8 60.1 L225.9 60.9 L225.4 58.5 L230.8 57.1 L227.7 56.7 L231.1 55.0 L223.5 53.7 L224.7 51.4 L222.4 51.1 L228.0 48.0 L236.0 52.8 L232.3 54.2 L239.1 54.8 L236.2 55.0 L239.3 58.2 L241.8 55.3 L244.7 56.2 L246.7 61.0 L254.1 56.7 L251.9 53.7 L259.9 54.1 L258.0 54.6 L263.1 55.5 L261.2 56.3 L263.4 57.0 L259.6 57.5 L263.5 60.1 L257.7 63.1 L256.2 61.6 L252.9 61.6 L256.5 63.6 L248.6 62.6 L251.0 63.6 L247.1 65.8 L237.5 64.2 L248.2 66.3 L238.3 70.8 L229.8 68.8 L238.3 71.6 L230.3 74.8 L226.7 82.5 L228.6 84.3 L231.5 83.4 L232.5 88.2 L237.9 87.1 L252.8 92.7 L260.5 92.9 L260.5 98.8 L267.3 103.6 L268.5 102.2 L269.7 103.5 L270.9 100.7 L267.3 94.3 L275.9 89.7 L274.7 85.3 L270.4 83.5 L274.1 79.9 L271.4 77.9 L273.4 75.9 L271.5 74.0 L283.5 73.4 L289.0 76.9 L294.7 77.2 L294.4 79.8 L291.0 79.9 L295.4 81.8 L292.7 83.3 L297.7 83.2 L296.8 85.3 L303.0 83.1 L304.1 84.6 L306.6 81.6 L305.2 80.7 L308.4 79.3 L311.0 82.1 L309.2 82.6 L312.4 83.5 L310.4 84.6 L313.2 84.1 L311.1 85.4 L313.5 84.9 L315.0 86.3 L313.2 86.7 L316.4 87.7 L313.2 88.7 L319.1 91.3 L318.1 93.4 L327.1 94.5 L317.9 98.0 L324.9 95.4 L331.2 97.8 L331.3 99.8 L329.2 99.7 L331.5 101.1 L320.3 106.0 L302.8 106.0 L293.4 111.3 L290.2 115.2 L298.2 110.3 L307.7 109.0 L308.5 110.9 L301.9 112.0 L307.2 112.5 L305.5 114.5 L307.4 116.5 L317.4 119.1 L308.5 121.2 L305.4 124.1 L303.7 121.3 L311.0 119.0 L306.8 119.1 L308.4 117.7 L298.5 121.8 L296.5 120.9 L290.5 127.0 L293.5 128.9 L283.8 130.6 L280.4 136.2 L278.6 134.0 L279.9 137.6 L277.5 141.0 L277.7 134.6 L275.7 135.3 L276.5 138.6 L274.0 136.9 L276.7 139.0 L274.9 138.7 L276.5 139.8 L274.7 140.7 L277.3 141.5 L278.6 144.6 L277.5 142.1 L277.9 143.8 L275.4 144.2 L278.1 145.0 L274.7 145.4 L276.5 147.0 L264.5 153.3 L262.4 156.8 L266.6 168.5 L265.2 173.5 L256.8 160.2 L252.4 160.9 L250.1 158.7 L245.3 159.4 L245.3 157.9 L238.9 159.4 L242.0 160.3 L241.6 162.9 L235.1 160.4 L226.7 160.8 L219.2 167.2 L220.9 170.8 L219.0 179.7 L224.4 190.1 L228.2 191.8 L235.8 190.8 L239.2 183.9 L248.6 183.1 L242.8 197.6 L253.3 197.4 L257.6 199.3 L256.3 209.9 L260.7 216.0 Z M284.4 381.3 L285.6 380.0 L283.5 380.8 L283.4 378.8 L285.4 379.6 L285.9 378.6 L285.6 379.9 L286.7 378.1 L285.5 376.4 L284.2 377.2 L286.4 378.1 L282.9 377.7 L282.0 375.8 L284.4 375.2 L280.8 373.9 L283.6 372.6 L280.9 368.0 L284.7 368.1 L280.7 367.2 L282.9 366.7 L281.3 366.5 L282.1 364.7 L278.3 364.6 L280.7 362.2 L283.6 364.1 L284.0 361.2 L285.9 361.1 L284.0 360.5 L286.5 358.7 L284.6 357.8 L287.2 350.4 L283.3 351.3 L282.8 349.4 L284.8 345.2 L283.5 339.6 L289.0 329.7 L289.3 317.1 L293.2 297.2 L292.5 289.2 L277.6 279.1 L269.4 261.9 L263.6 255.9 L263.3 251.4 L267.4 246.9 L264.3 246.2 L266.4 237.9 L269.5 237.2 L274.6 229.5 L271.8 217.5 L266.9 215.0 L272.3 215.7 L275.3 218.9 L279.3 211.2 L288.9 206.8 L290.4 207.9 L288.1 209.2 L288.8 215.9 L290.6 214.1 L289.1 211.2 L293.9 209.5 L293.3 207.5 L298.3 212.0 L306.5 213.2 L315.0 211.3 L312.3 212.3 L322.5 218.8 L323.5 223.0 L324.4 221.6 L327.6 224.4 L335.5 224.3 L343.2 228.7 L346.9 236.8 L339.4 244.3 L344.4 242.4 L345.3 245.1 L348.6 244.6 L347.5 247.1 L351.8 244.1 L351.9 241.8 L356.8 242.4 L359.4 244.9 L360.4 243.8 L360.5 249.0 L364.2 246.2 L373.3 247.6 L380.9 253.3 L385.0 253.6 L387.2 259.1 L386.8 262.3 L376.4 274.2 L375.6 287.2 L370.7 298.7 L368.0 301.3 L361.6 301.2 L350.0 307.7 L350.0 316.1 L341.1 325.8 L345.1 321.2 L343.2 320.0 L335.6 332.5 L325.7 331.9 L324.2 328.2 L323.8 331.8 L328.7 336.9 L326.5 341.6 L313.8 343.4 L313.6 349.1 L306.6 348.6 L306.5 352.1 L310.4 353.6 L306.7 353.7 L308.5 354.6 L305.8 356.4 L305.3 359.8 L299.7 362.8 L304.7 365.9 L304.6 367.8 L298.9 373.4 L296.7 372.7 L297.7 373.8 L294.9 376.2 L296.1 377.5 L294.4 377.6 L297.7 379.6 L291.0 380.6 L289.9 383.7 L286.7 382.4 L289.7 381.7 L289.2 380.2 L284.4 381.3 Z M869.9 343.2 L865.8 342.2 L866.5 340.9 L862.8 343.6 L854.9 341.4 L852.0 335.9 L848.3 335.0 L848.3 331.0 L847.4 333.6 L844.9 334.1 L847.9 329.5 L847.3 326.6 L842.6 333.4 L837.8 326.6 L829.7 323.9 L815.9 326.1 L809.4 330.5 L799.7 330.5 L794.5 333.7 L787.0 331.7 L789.0 325.2 L781.7 309.7 L783.6 310.9 L782.7 308.0 L784.6 310.2 L782.4 305.1 L784.0 298.3 L784.9 300.1 L791.5 294.7 L803.0 292.1 L807.8 283.7 L809.5 287.0 L809.5 283.1 L811.7 284.2 L813.3 283.7 L811.6 281.8 L814.0 281.6 L812.9 280.4 L814.7 280.5 L813.7 279.3 L816.0 277.1 L819.8 277.2 L821.4 281.4 L822.8 279.4 L825.6 280.6 L826.7 279.2 L825.0 278.2 L828.2 273.1 L834.0 272.4 L831.9 269.7 L842.7 273.3 L844.2 271.7 L845.3 272.9 L841.1 279.8 L855.0 287.0 L860.1 268.5 L863.4 278.4 L867.6 279.9 L870.0 290.3 L876.7 294.0 L879.0 300.2 L881.8 299.6 L882.1 302.7 L888.5 309.2 L889.7 316.4 L886.8 326.5 L880.4 335.2 L879.9 340.0 L869.9 343.2 Z M360.8 80.0 L361.0 78.1 L356.7 78.0 L359.4 76.8 L352.9 77.9 L349.1 76.3 L351.3 75.9 L348.6 75.9 L349.8 74.5 L345.8 73.4 L347.5 71.9 L343.4 70.9 L345.3 70.3 L342.5 70.2 L346.4 69.0 L342.0 68.9 L346.1 68.2 L344.3 67.7 L347.6 68.4 L344.0 66.1 L344.9 67.4 L341.3 68.8 L343.3 66.7 L339.8 65.8 L345.4 64.9 L340.0 65.7 L338.1 64.7 L342.0 63.8 L337.4 63.9 L345.7 61.8 L336.8 63.7 L340.7 61.8 L336.3 60.9 L342.8 60.4 L336.5 60.2 L346.0 59.1 L336.8 60.1 L341.2 58.8 L337.8 58.2 L345.8 58.9 L342.8 58.2 L344.5 57.3 L337.4 57.8 L340.7 56.9 L344.9 57.3 L343.7 55.6 L346.7 55.5 L343.6 55.5 L346.0 53.2 L334.4 51.6 L345.2 52.5 L340.7 50.4 L342.6 49.9 L339.9 50.2 L343.0 49.4 L338.6 49.5 L342.1 48.7 L337.9 48.8 L337.1 47.0 L336.2 49.5 L331.0 48.8 L334.9 47.4 L331.7 46.8 L335.3 46.7 L331.5 45.2 L330.5 41.9 L327.2 42.4 L330.3 41.2 L317.6 36.9 L297.3 37.1 L294.4 36.2 L298.9 35.5 L289.7 34.5 L303.5 33.1 L285.2 31.5 L304.0 29.0 L309.7 26.3 L300.1 25.7 L315.2 24.0 L315.1 21.9 L327.4 23.1 L319.7 21.3 L332.8 20.5 L333.9 22.4 L345.7 22.4 L342.0 20.0 L359.2 22.0 L358.3 20.6 L364.6 20.7 L355.9 19.3 L371.0 20.4 L357.6 18.9 L361.9 17.9 L374.0 19.4 L376.4 17.3 L408.5 17.8 L381.7 19.4 L410.0 18.2 L408.2 19.3 L421.5 19.7 L388.6 21.8 L410.2 21.4 L405.8 22.9 L418.8 21.1 L413.9 25.2 L423.8 22.4 L445.7 22.0 L440.6 24.3 L423.3 25.1 L437.0 25.3 L425.0 26.4 L433.0 26.7 L421.4 32.9 L428.9 32.7 L423.7 33.2 L431.2 35.1 L419.4 35.5 L428.4 38.1 L427.7 39.7 L420.0 38.5 L429.4 41.4 L420.0 42.5 L425.6 44.1 L411.3 42.8 L414.2 44.0 L406.1 45.0 L413.1 45.2 L406.8 45.8 L421.5 48.7 L419.8 49.4 L422.0 49.4 L420.4 50.5 L422.7 51.9 L404.3 48.0 L412.2 49.9 L402.0 52.1 L421.1 53.1 L401.5 58.1 L393.1 56.9 L394.5 58.8 L387.2 63.1 L380.8 64.7 L379.0 62.9 L378.2 65.0 L370.3 66.3 L372.4 68.4 L369.1 68.7 L372.0 70.2 L364.9 72.7 L367.6 73.7 L365.3 73.3 L367.7 74.7 L364.7 76.5 L366.3 77.1 L363.7 77.0 L366.1 77.2 L363.9 77.8 L365.7 78.5 L360.8 80.0 Z M872.5 259.9 L882.3 267.3 L880.5 268.5 L873.9 267.0 L866.0 259.8 L859.2 261.8 L862.4 263.4 L860.4 264.9 L856.3 264.6 L853.4 261.4 L850.5 262.0 L849.8 259.2 L851.3 259.0 L848.3 254.3 L837.3 250.3 L836.8 247.8 L834.4 250.9 L831.9 247.4 L836.4 247.3 L837.2 245.6 L832.8 246.1 L831.9 243.9 L829.1 243.8 L833.1 240.9 L837.3 241.9 L840.3 249.0 L847.7 243.9 L865.4 250.2 L868.7 254.6 L873.7 256.3 L872.5 259.9 Z M786.7 250.7 L781.4 247.8 L778.4 249.5 L777.9 247.5 L774.0 247.9 L770.4 236.9 L772.4 234.4 L776.5 236.4 L777.2 232.8 L787.7 226.9 L792.4 221.3 L793.5 224.3 L798.0 225.7 L792.0 230.4 L797.3 237.4 L794.4 237.0 L793.6 242.1 L791.2 242.9 L790.1 248.3 L786.7 250.7 Z M605.6 306.6 L597.4 306.7 L595.3 299.5 L598.6 293.3 L597.1 286.7 L598.5 283.2 L605.9 281.3 L611.4 271.9 L614.6 281.2 L613.8 282.7 L612.3 281.4 L612.9 284.9 L605.6 306.6 Z M304.0 74.8 L289.0 71.6 L287.7 70.8 L290.1 70.4 L284.6 67.6 L271.9 68.2 L273.7 65.4 L284.1 65.5 L281.4 63.6 L287.9 62.2 L285.3 61.9 L287.6 60.6 L283.6 56.9 L275.6 56.8 L278.4 55.4 L274.7 53.4 L269.4 51.4 L267.7 52.3 L269.9 53.6 L251.1 53.3 L241.3 50.4 L253.9 50.8 L254.7 49.0 L250.6 47.9 L255.6 48.0 L251.5 45.6 L262.5 43.4 L266.1 46.0 L264.1 48.3 L267.2 46.7 L272.7 48.7 L269.7 47.4 L274.7 47.6 L270.5 46.8 L273.1 46.0 L279.6 46.7 L276.3 48.4 L282.1 47.8 L279.0 48.8 L281.0 48.9 L279.9 50.2 L283.7 48.6 L283.1 50.5 L286.5 48.9 L290.3 49.9 L286.5 51.7 L291.7 50.5 L288.1 52.2 L290.2 51.9 L289.2 53.3 L293.6 51.0 L291.7 52.1 L297.9 51.9 L293.3 54.3 L298.2 52.5 L300.8 54.1 L293.2 54.6 L302.1 55.5 L294.9 56.5 L302.2 57.5 L299.0 57.9 L303.9 59.7 L307.4 58.7 L306.1 59.6 L309.5 60.4 L307.4 61.3 L316.6 62.2 L312.3 63.1 L314.8 64.0 L312.1 63.6 L312.9 65.1 L310.6 64.2 L310.6 67.0 L305.3 64.7 L308.4 63.1 L304.3 64.1 L305.4 63.0 L298.8 62.3 L301.0 64.0 L297.7 63.8 L298.0 65.5 L304.8 67.1 L308.0 71.4 L305.8 69.9 L306.9 73.0 L296.0 70.0 L304.0 74.8 Z M761.9 255.7 L750.9 248.5 L743.5 235.4 L733.9 225.1 L740.0 226.0 L754.4 238.1 L753.8 239.4 L756.6 239.3 L755.4 241.9 L762.9 248.6 L761.9 255.7 Z M845.1 148.6 L840.2 149.6 L840.9 147.4 L832.4 149.8 L829.0 148.6 L834.9 145.0 L842.9 144.9 L844.7 140.4 L846.3 140.0 L846.2 142.0 L851.8 138.3 L853.0 131.7 L857.2 129.5 L858.9 134.5 L855.8 138.1 L855.6 144.8 L850.3 147.7 L844.6 146.5 L845.1 148.6 Z M178.2 57.4 L167.0 53.2 L182.8 52.4 L166.2 51.6 L164.5 50.5 L173.2 49.2 L162.3 48.6 L174.7 44.3 L174.6 46.5 L179.2 45.3 L184.0 47.2 L187.3 46.9 L184.7 45.4 L186.9 45.4 L192.7 49.1 L191.3 44.9 L195.3 44.5 L199.3 45.8 L201.4 50.6 L210.7 52.8 L210.8 54.2 L203.9 54.1 L208.6 56.0 L195.7 54.7 L178.2 57.4 Z M483.7 103.6 L464.8 106.5 L473.7 101.9 L465.8 101.7 L469.5 99.9 L467.3 99.2 L468.8 98.1 L472.9 97.7 L470.3 94.6 L471.9 93.4 L466.3 93.7 L467.3 90.1 L464.5 92.5 L466.7 88.8 L463.4 88.7 L465.6 87.7 L464.5 85.7 L466.5 85.8 L466.7 83.7 L471.9 83.6 L468.2 86.7 L475.1 86.4 L471.0 89.7 L473.1 90.0 L469.7 90.4 L474.3 90.9 L479.8 95.7 L477.9 96.8 L480.0 99.0 L484.7 100.1 L480.7 102.8 L483.7 103.6 Z M260.4 19.5 L310.5 19.1 L317.0 20.4 L295.2 22.1 L302.4 22.6 L293.3 23.8 L307.8 22.9 L287.0 26.1 L292.1 26.4 L289.4 27.4 L271.9 28.4 L281.5 29.3 L269.7 29.2 L281.1 30.4 L275.7 30.6 L280.0 31.1 L270.1 33.8 L261.4 32.8 L272.0 34.7 L263.8 37.0 L259.4 35.1 L260.6 36.3 L240.9 35.8 L249.0 34.2 L244.7 32.4 L254.8 33.9 L260.5 31.8 L253.9 33.3 L254.4 30.4 L246.7 31.7 L248.4 30.0 L262.7 29.2 L254.1 29.3 L257.7 29.2 L249.3 25.9 L265.1 27.8 L258.1 25.8 L276.1 24.3 L269.4 24.3 L275.1 22.8 L250.5 25.3 L260.5 23.5 L246.7 25.0 L241.6 24.2 L254.3 23.2 L240.8 24.0 L247.4 22.7 L235.0 22.2 L254.7 21.7 L248.4 20.8 L252.8 20.1 L265.5 21.2 L260.4 19.5 Z M798.5 254.9 L796.7 247.4 L800.1 238.1 L802.4 236.4 L810.5 237.7 L813.8 235.5 L811.5 238.9 L800.8 238.9 L801.8 243.8 L809.2 242.1 L803.4 244.9 L807.7 251.8 L804.1 252.7 L802.0 247.0 L800.5 247.9 L801.3 255.0 L798.5 254.9 Z M933.3 363.3 L924.5 363.2 L924.8 360.8 L935.3 354.9 L939.0 348.9 L944.8 349.3 L940.7 355.0 L941.5 356.9 L937.8 356.1 L939.2 357.1 L936.9 357.3 L933.3 363.3 Z M785.6 263.3 L767.6 260.6 L760.6 258.0 L762.8 255.7 L770.5 258.2 L776.1 257.1 L785.2 260.8 L785.6 263.3 Z M947.3 351.0 L946.8 346.5 L943.3 344.7 L945.6 343.5 L946.5 338.8 L945.3 338.8 L940.5 331.8 L944.9 333.8 L945.8 338.3 L948.2 339.3 L948.0 337.4 L949.4 340.5 L956.1 340.5 L949.2 350.0 L947.3 351.0 Z M335.8 112.3 L330.7 114.8 L334.1 112.9 L321.6 112.3 L330.9 102.3 L328.3 107.9 L330.2 106.2 L332.3 109.2 L337.3 108.6 L335.5 111.0 L338.7 110.5 L336.2 112.4 L338.9 111.5 L337.9 113.2 L339.7 113.3 L338.2 115.7 L337.2 114.1 L335.5 115.1 L335.8 112.3 Z M282.3 186.0 L272.7 187.1 L274.0 184.9 L261.7 179.5 L259.3 179.5 L255.9 181.6 L253.5 181.7 L255.9 179.4 L263.6 178.1 L282.3 186.0 Z M810.7 205.4 L808.8 205.3 L806.8 202.8 L806.9 204.9 L804.7 202.8 L801.7 203.2 L802.6 201.0 L800.2 200.6 L799.3 197.4 L801.1 196.9 L801.7 190.5 L806.2 191.0 L804.4 201.6 L809.9 202.8 L810.7 205.4 Z M434.7 69.9 L419.5 69.9 L423.1 68.3 L415.9 67.0 L422.2 65.5 L414.6 65.3 L418.0 64.9 L417.4 63.5 L420.2 64.4 L418.3 62.8 L423.1 64.0 L423.8 66.2 L425.5 63.8 L431.9 64.9 L431.3 63.5 L436.8 62.6 L441.3 63.0 L439.5 63.7 L444.0 66.5 L434.7 69.9 Z M813.3 224.4 L809.8 219.2 L805.1 221.0 L809.0 216.7 L809.8 218.8 L814.8 216.1 L814.5 213.8 L817.6 220.6 L816.5 223.3 L815.2 220.5 L815.2 224.1 L813.3 224.4 Z M463.2 100.7 L452.3 101.8 L456.8 99.6 L453.5 99.8 L456.3 98.1 L452.8 97.6 L454.5 96.5 L453.0 95.4 L463.6 92.7 L465.5 94.7 L462.9 96.0 L463.2 100.7 Z M862.0 128.0 L854.6 126.4 L856.5 128.5 L853.3 129.2 L852.9 126.4 L857.1 124.5 L858.4 118.6 L863.3 122.4 L867.6 121.8 L867.3 124.4 L868.8 124.3 L862.0 128.0 Z M858.7 117.4 L859.3 103.7 L857.7 100.5 L860.6 94.9 L866.0 110.3 L861.3 109.0 L860.1 112.6 L863.0 116.3 L860.0 115.4 L858.7 117.4 Z M297.8 190.4 L289.5 193.1 L281.4 190.9 L287.1 190.6 L284.1 187.5 L285.8 186.8 L293.4 187.5 L297.8 190.4 Z M172.5 43.9 L151.7 50.5 L144.0 48.1 L150.0 43.3 L147.4 41.7 L166.3 42.0 L172.5 43.9 Z M694.0 224.0 L692.5 218.1 L693.9 213.8 L698.3 221.3 L694.0 224.0 Z M869.3 355.5 L865.8 348.4 L871.0 350.0 L874.9 348.7 L874.7 355.3 L872.5 353.9 L871.7 356.4 L869.3 355.5 Z M234.2 40.0 L231.8 36.4 L225.6 36.7 L221.9 34.7 L237.4 35.6 L236.1 36.1 L242.1 36.7 L235.7 36.6 L239.5 37.2 L236.8 37.8 L242.8 38.9 L262.4 37.8 L268.4 40.3 L246.1 41.5 L234.2 40.0 Z M306.4 385.7 L302.1 386.7 L288.1 385.7 L296.1 385.3 L293.1 384.2 L295.1 382.5 L292.2 382.3 L292.2 380.7 L296.6 380.1 L299.3 383.6 L306.4 385.7 Z M635.4 42.7 L630.9 43.0 L633.6 43.6 L630.3 43.4 L631.2 44.7 L623.2 43.2 L630.4 42.6 L627.0 42.1 L631.9 40.9 L629.4 39.5 L643.0 36.6 L663.0 34.8 L662.4 36.8 L643.5 39.2 L635.2 41.2 L635.4 42.7 Z M266.3 69.9 L258.7 68.8 L252.8 71.7 L247.6 70.5 L250.2 69.1 L251.7 64.2 L266.3 69.9 Z M183.9 39.3 L166.2 39.3 L173.3 38.1 L167.4 38.4 L173.9 37.6 L168.7 37.6 L173.6 35.9 L189.6 38.7 L185.6 36.4 L189.0 35.1 L192.0 37.9 L198.9 37.7 L197.3 39.9 L180.4 41.5 L174.9 40.8 L183.9 39.3 Z M228.8 29.3 L239.1 28.7 L226.3 28.6 L228.4 27.3 L222.2 26.3 L228.3 26.7 L222.3 25.7 L230.0 25.3 L225.3 24.5 L230.7 23.0 L253.7 28.6 L244.9 29.3 L243.0 31.6 L228.8 29.3 Z M525.3 35.7 L517.1 33.3 L525.3 32.2 L516.3 31.8 L526.4 30.9 L520.9 29.7 L514.7 31.5 L508.4 27.9 L519.3 27.2 L524.1 29.6 L523.4 26.5 L537.4 30.0 L530.7 30.9 L525.3 35.7 Z M345.2 244.7 L345.8 240.3 L351.0 240.8 L347.2 244.8 L345.2 244.7 Z M828.5 157.3 L828.8 155.5 L826.9 156.2 L828.4 153.0 L827.9 151.2 L826.0 153.2 L825.5 151.1 L829.2 149.7 L832.2 152.2 L828.5 157.3 Z M802.3 181.3 L800.3 177.0 L804.2 172.5 L805.3 173.3 L802.3 181.3 Z M885.7 254.4 L879.0 256.8 L875.5 254.8 L880.2 253.3 L882.4 254.6 L885.8 251.0 L885.7 254.4 Z M253.3 49.9 L248.0 50.1 L240.0 49.5 L242.3 44.8 L249.2 43.0 L253.8 43.4 L249.9 46.1 L253.3 49.9 Z M770.7 191.0 L769.7 188.6 L771.4 186.9 L775.8 186.6 L774.4 190.2 L770.7 191.0 Z M221.3 48.7 L215.4 49.7 L206.2 46.2 L212.9 45.9 L213.9 44.8 L209.0 44.0 L212.2 44.2 L211.0 43.1 L221.4 43.3 L217.4 45.3 L222.6 46.0 L221.3 48.7 Z M624.0 51.4 L622.7 49.2 L617.1 48.4 L623.1 46.3 L619.6 46.1 L621.9 44.9 L630.7 44.9 L626.9 46.5 L627.2 48.3 L633.6 51.4 L624.0 51.4 Z M151.3 110.8 L138.9 106.4 L140.2 105.1 L137.5 104.6 L145.5 105.8 L151.3 110.8 Z M819.5 262.4 L809.2 267.6 L809.8 265.7 L813.7 263.1 L819.5 262.4 Z M520.0 142.1 L513.8 139.8 L513.3 138.6 L521.7 137.9 L520.0 142.1 Z M226.7 48.0 L225.9 42.7 L239.5 42.9 L234.4 46.0 L228.6 45.9 L230.8 46.8 L226.7 48.0 Z M502.5 136.0 L501.8 130.8 L504.6 130.0 L505.7 135.2 L502.5 136.0 Z M848.0 40.4 L845.3 38.4 L850.1 36.8 L867.8 38.7 L862.4 39.9 L859.7 38.0 L862.9 40.3 L848.0 40.4 Z M220.6 38.9 L211.3 39.1 L214.3 38.2 L205.7 38.3 L210.9 37.8 L208.3 36.1 L213.6 37.7 L210.7 36.0 L217.4 35.5 L220.6 38.9 Z M153.1 37.5 L172.4 33.8 L167.8 36.5 L165.8 35.1 L160.6 37.7 L153.1 37.5 Z M746.7 29.6 L727.6 27.8 L747.0 27.2 L746.7 29.6 Z M552.0 26.8 L543.1 28.8 L527.3 26.3 L540.8 25.3 L552.0 26.8 Z M216.0 56.2 L218.8 53.6 L226.3 56.3 L222.6 57.5 L216.0 56.2 Z M216.0 32.3 L201.5 31.3 L204.5 30.0 L198.8 28.4 L212.4 29.8 L216.0 32.3 Z M747.5 32.0 L753.3 28.2 L753.2 29.8 L757.0 28.9 L761.3 30.7 L747.5 32.0 Z M268.4 46.0 L264.5 43.3 L277.2 45.7 L268.4 46.0 Z";
  function mapSVG(){
    const connections=[['nw','ne'],['ne','we'],['sa','nw'],['we','ee'],['we','na'],['na','af'],['ee','ea'],['me','in'],['in','ea'],['ea','se'],['se','oc'],['af','in']];
    return `<svg class="world" viewBox="0 0 960 480" role="group" aria-label="世界地図。12地域を選択できます。">
      <defs>
        <radialGradient id="spot"><stop offset="0" stop-color="#265b78" stop-opacity=".3"/><stop offset="1" stop-color="#091523" stop-opacity="0"/></radialGradient>
        <pattern id="seaDots" patternUnits="userSpaceOnUse" width="15" height="15"><circle cx="1" cy="1" r=".55" fill="#6991a8" opacity=".28"/></pattern>
        <clipPath id="landClip"><path d="${WORLD_LAND_PATH}"/></clipPath>
      </defs>
      <rect width="960" height="480" fill="#0a1a2a"/><rect width="960" height="480" fill="url(#seaDots)"/>
      <circle cx="485" cy="220" r="330" fill="url(#spot)"/>
      <g class="world-grid">${[80,160,240,320,400].map(y=>`<line x1="0" y1="${y}" x2="960" y2="${y}"/>`).join('')}${[120,240,360,480,600,720,840].map(x=>`<line x1="${x}" y1="0" x2="${x}" y2="480"/>`).join('')}<ellipse cx="480" cy="240" rx="475" ry="192"/></g>
      <path d="${WORLD_LAND_PATH}" class="earth-land"/>
      <g clip-path="url(#landClip)">${game.regions.map(r=>{const sh=shares(r);const lead=sh.indexOf(Math.max(...sh));return `<polygon points="${r.points}" fill="${COLORS[lead]}" fill-opacity="${(.14+r.adoption/200).toFixed(2)}"/>`;}).join('')}</g>
      <path d="${WORLD_LAND_PATH}" class="earth-coast"/>
      <g>${connections.map(([a,b])=>{const ra=game.regions.find(r=>r.id===a),rb=game.regions.find(r=>r.id===b);return `<path class="flowpath" d="M${ra.cx} ${ra.cy}Q${(ra.cx+rb.cx)/2} ${Math.min(ra.cy,rb.cy)-22} ${rb.cx} ${rb.cy}"/>`;}).join('')}</g>
      ${game.regions.map(r=>{const sh=shares(r),lead=sh.indexOf(Math.max(...sh)),col=COLORS[lead],on=r.id===selected,isHome=r.id===game.homeRegionId;
        return `<g class="map-zone${on?' selected':''}" data-region="${r.id}" role="button" tabindex="0" aria-label="${r.name}、AI普及率${rnd(r.adoption)}パーセント。選択する">
          <polygon class="zone-area" points="${r.points}" fill="${col}" fill-opacity="${on?'.21':'.045'}"/>
          <circle cx="${r.cx}" cy="${r.cy}" r="${on?8:5}" fill="${col}" class="zone-node"/><circle cx="${r.cx}" cy="${r.cy}" r="10" class="zone-ripple" style="--delay:${(r.cx%11)*.25}s;--ripple:${col}"/>
          <text x="${r.cx}" y="${r.cy-17}" text-anchor="middle">${r.short}${isHome?' ★':''}</text>
          <text class="zone-stat" x="${r.cx}" y="${r.cy+20}" text-anchor="middle">${rnd(r.adoption)}% · ${rnd(sh[lead])}%</text>
        </g>`;}).join('')}
      <text class="map-annotation" x="20" y="27">GLOBAL AI NETWORK // ACTUAL COASTLINES</text>
      <text class="map-annotation" x="940" y="461" text-anchor="end">12 STRATEGIC REGIONS</text>
    </svg>`;
  }

  function regionPanel(){
    const r=game.regions.find(r=>r.id===selected)||game.regions[0];
    const sh=shares(r), names=[esc(game.name),'ATLAS','NOVA'];
    const leader=sh.indexOf(Math.max(...sh)), home=r.id===game.homeRegionId;
    return `<section class="card region-panel sector-card" id="region-details" aria-label="選択中の地域情報">
      <div class="sector-topline"><span class="overline">REGION INTELLIGENCE</span><span class="sector-live"><i></i> ANALYZING</span></div>
      <div class="sector-heading"><div><h2>${esc(r.name)}</h2><p>${home?`${countryFor(game).flag} AI開発拠点 · 成長ボーナスあり`:'世界地域 · 戦略目標を選択'}</p></div><span class="region-id">${esc(r.id.toUpperCase())}</span></div>
      <div class="sector-indicators"><div><span>AI普及率</span><strong>${percent(r.adoption)}</strong></div><div><span>自AIシェア</span><strong style="color:var(--cyan)">${percent(sh[0])}</strong></div><div><span>規制レベル</span><strong style="color:${r.regulation>60?'#f8b982':'#dce9fa'}">${rnd(r.regulation)}</strong></div></div>
      <div class="sector-share-title"><span>市場シェア</span><span>首位 · ${names[leader]}</span></div>
      <div class="sector-shares bar" aria-label="各AIの市場シェア">${sh.map((v,i)=>`<div style="width:${v}%;background:${COLORS[i]}"></div>`).join('')}</div>
      <div class="sector-legend">${sh.map((v,i)=>`<span><i class="dot" style="background:${COLORS[i]}"></i>${names[i]} <b>${rnd(v)}%</b></span>`).join('')}</div>
      <div class="sector-footnote">産業浸透 ${rnd(r.integration)} / 100 <span>デジタル基盤 ${rnd(r.digital)} / 100</span></div>
    </section>`;
  }

  function actionDef(){return [
    {id:'campaign',icon:'◎',title:'地域に普及',desc:'選択地域で利用者を獲得。成長は後半に加速',cost:`資金 ${game.type==='open'?12:17}`,detail:'選択地域の自AIシェアを上げる'},
    {id:'integrate',icon:'▣',title:'産業へ導入',desc:'企業・行政へ導入して社会的依存を作る',cost:'資金 21',detail:'依存基盤 +9以上 / 現地シェア増'},
    {id:'research',icon:'✦',title:'研究開発',desc:'技術力を上げる。まれに進化ポイントも獲得',cost:'資金 13',detail:'技術力 +6〜8 / EPは低確率'},
    {id:'compute',icon:'▤',title:'演算設備に投資',desc:'AIの運用規模を拡張する',cost:'資金 21',detail:'演算 +10 / 基盤 +5'},
    {id:'safety',icon:'◈',title:'安全監査',desc:'信頼度を増やし、規制リスクを下げる',cost:'資金 15',detail:'信頼 +9 / 世界警戒 -7'},
    {id:'fundraise',icon:'＄',title:'資金を調達',desc:'開発資金を少量獲得。信頼低下・警戒上昇',cost:`資金 +${Math.round((18+game.turn*.27)*countryFor(game).mods.income)}`,detail:'信頼 -3 / 世界警戒 +3'}
  ];}
  function canPay(id){const costs={fundraise:0,campaign:game.type==='open'?12:17,integrate:21,research:13,compute:21,safety:15};return game.actions>0&&game.funds>=(costs[id]??Infinity);}
  function actionPanel(){
    const actions=actionDef(), active=actions.find(a=>a.id===selectedOperation)||actions[0];
    const region=game.regions.find(r=>r.id===selected)||game.regions[0];
    return `<section class="card operation-panel" id="choices">
      <div class="operation-heading"><div><span class="overline">YOUR NEXT MOVE</span><h2>オペレーション</h2></div><div class="operation-remaining ${game.actions?'':'used'}">${game.actions?'● 実行可能':'✓ 実行済み'}</div></div>
      <div class="operation-context">今月の行動は <strong>1回</strong> · 対象地域 <strong id="op-region-name">${esc(region.name)}</strong></div>
      <div class="op-choices" role="group" aria-label="実行する行動を選ぶ">${actions.map(a=>`<button class="op-tile ${selectedOperation===a.id?'active':''}" data-select-action="${a.id}" aria-pressed="${selectedOperation===a.id}"><span class="op-icon">${a.icon}</span><strong>${esc(a.title)}</strong></button>`).join('')}</div>
      <div class="op-selected"><div class="op-selected-top"><strong>${esc(active.title)}</strong><span>${esc(active.cost)}</span></div><p>${esc(active.desc)}。${esc(active.detail)}</p><button class="btn primary full op-execute" data-action="${active.id}" ${canPay(active.id)?'':'disabled'}>${game.actions?'この行動を実行する →':'来月、再び行動できます'}</button></div>
    </section>`;
  }

  function routePanel(){return `<section class="card progress-panel"><div class="progress-head"><h3>4つの勝利ルート</h3><span class="overline">ENDING PATHS</span></div><div class="route-list">${ROUTES.map(route=>{const d=routeData(route);const remaining=d.req.filter(r=>!r.done);return `<div class="route ${d.ready?'ready':''}"><div class="route-top"><span class="route-title" style="color:${route.color}">${route.icon} ${route.title}</span><span class="route-num">${d.ready?'達成可能':`${rnd(d.progress)}%`}</span></div><div class="bar"><div style="width:${d.progress}%;background:${route.color}"></div></div><div class="route-desc">${d.ready?'条件達成時点でゲーム終了します。':remaining.slice(0,2).map(x=>`${x.label} ${rnd(x.value)}/${x.target}${x.key==='safeAlert'?'以下':''}`).join(' ・ ')}</div></div>`;}).join('')}</div></section>`;}
  function newsPanel(){const isNews=newsTab==='news';const arr=(isNews?game.feed:game.activityLog).slice(0,16);return `<section class="card"><div class="cardhead"><div><h2>世界ニュース</h2><small>WORLD NEWS · LIVE FEED</small></div><div class="tabs"><button class="tab${isNews?' active':''}" data-news-tab="news">報道</button><button class="tab${!isNews?' active':''}" data-news-tab="log">行動記録</button></div></div><div class="newslist">${arr.length?arr.map(item=>`<div class="newsitem ${esc(item.severity||'normal')}"><time>M${String(item.turn).padStart(2,'0')}</time><div><div class="newsmeta"><span>${esc(item.category||(isNews?'ニュース':'行動'))}</span>${item.severity==='breaking'?'<b>速報</b>':''}</div><p>${esc(item.message)}</p>${item.body?`<small>${esc(item.body)}</small>`:''}</div></div>`).join(''):'<div class="news-empty">記録はまだありません。</div>'}</div></section>`;}
  function reportPanel(){const s=stats();return `<section class="card report-panel"><div class="cardhead"><div><h2>世界レポート</h2><small>INTELLIGENCE REPORT · 現在の世界情勢</small></div><span class="tag">M${String(game.turn).padStart(2,'0')}</span></div>
    <div class="report-copy"><div class="origin-note">発祥国：${countryFor(game).flag} ${esc(countryFor(game).name)} · ${esc(countryFor(game).focus)}</div>
    <h3>${game.alert>=70?'世界の規制が強まっています':s.share<s.maxOthers?'競合AIが優勢です':'あなたのAIが成長中'}</h3>
    <p>${game.alert>=70?'安全性強化や共生進化で警戒度を下げ、規制による普及の減速を抑えましょう。':s.share<s.maxOthers?'序盤は小規模なAI。研究と地域普及を積み重ね、後半の加速期に備えましょう。':'世界のAI普及が加速中。どの勝利ルートを狙うか考え、必要な進化を選びましょう。'}</p></div>
    <div class="metrics">
      ${metric('世界AI普及率',percent(s.worldAdoption),'全AIの利用率',COLORS[0])}
      ${metric('自AIシェア',percent(s.share),esc(game.name),COLORS[0])}
      ${metric('AIへの依存度',`${rnd(s.dependency)}`,'自AIへの社会依存',COLORS[2])}
      ${metric('世界警戒度',`${rnd(game.alert)}`,'高いほど規制が厳しい',game.alert>62?COLORS[1]:'#ff98a8')}
      ${metric('技術 / 自律',`${rnd(game.tech)} / ${rnd(game.autonomy)}`,'超知能への指標',COLORS[2])}
      ${metric('信頼 / 演算',`${rnd(game.trust)} / ${rnd(game.compute)}`,'安全性と稼働基盤','#75dec3')}
    </div><div class="report-details"><div class="kv"><span>資金 / 進化ポイント</span><b>${fmt(game.funds)} / ${fmt(game.ep)} EP</b></div><div class="kv"><span>オープン化 / 技術公開</span><b>${rnd(game.openness)} / ${game.publications}回</b></div><div class="kv"><span>産業依存基盤</span><b>${rnd(game.infra)}</b></div></div></section>`;}
  function signalMetric(label,value,subtitle,color){return `<div class="signal-metric" style="--metric-hue:${color}"><span>${label}</span><strong>${value}</strong><small>${subtitle}</small></div>`;}
  function latestNews(){
    const stories=game.feed.slice(0,3);
    return `<section class="live-brief card" aria-label="世界の最新ニュース"><div class="brief-heading"><span class="live-pill"><i></i> LIVE NEWS</span><span>WORLD INTELLIGENCE</span><button class="quiet-link" data-command="news">すべて見る ↗</button></div>
      <div class="brief-stories">${stories.length?stories.map((n,i)=>`<div class="brief-story ${n.severity==='breaking'?'emergency':''}"><span class="brief-time">${n.severity==='breaking'?'速報':`M${String(n.turn).padStart(2,'0')}`}</span><div><strong>${esc(n.message)}</strong>${i===0&&n.body?`<small>${esc(n.body)}</small>`:''}</div></div>`).join(''):'<p class="muted">ニュースはまだありません。翌月へ進むと世界情勢が更新されます。</p>'}</div></section>`;
  }
  function commandShortcuts(){
    const closest=ROUTES.map(route=>({title:route.title,progress:routeData(route).progress})).sort((a,b)=>b.progress-a.progress)[0];
    const skillCount=ALL_SKILLS.filter(s=>!hasSkill(s.id)&&!skillProblem(s)).length;
    return `<nav class="command-shortcuts" aria-label="管理メニュー">
      <button class="shortcut evol" data-command="evolution"><span class="shortcut-icon">✦</span><span><strong>進化ツリー</strong><small>能力を解放する</small></span><em>EP ${fmt(game.ep)}</em></button>
      <button class="shortcut" data-command="report"><span class="shortcut-icon">▥</span><span><strong>世界レポート</strong><small>技術・社会情勢</small></span><em>解析 ↗</em></button>
      <button class="shortcut" data-command="routes"><span class="shortcut-icon">✧</span><span><strong>勝利ルート</strong><small>${closest?`最も近い：${esc(closest.title)}`:'4つのエンディング'}</small></span><em>${closest?`${rnd(closest.progress)}%`:'確認'}</em></button>
    </nav>`;
  }
  function victoryDetails(){return `<div class="route-overview"><p class="panel-lead">4つの未来のどれでも勝利できます。必要な条件を満たすと、その場でエンディングを迎えます。</p><div class="detailed-routes">${ROUTES.map(route=>{const d=routeData(route);return `<article class="route-detail" style="--route-color:${route.color}"><div class="route-detail-head"><div><span class="route-symbol">${route.icon}</span><strong>${esc(route.title)}</strong></div><b>${rnd(d.progress)}%</b></div><p>${esc(route.hint)}</p><div class="bar"><div style="width:${d.progress}%;background:${route.color}"></div></div><div class="route-checks">${d.req.map(q=>`<div class="route-check ${q.done?'complete':''}"><span>${q.done?'✓':'○'} ${esc(q.label)}</span><b>${rnd(q.value)} ${q.key==='safeAlert'?'≤':'/'} ${q.target}</b></div>`).join('')}</div></article>`;}).join('')}</div></div>`;}
  function renderUtilityPanel(){
    const config={evolution:{title:'進化スキルツリー',eyebrow:'EVOLUTION CONSTELLATION',subtitle:'EPを使ってAIを進化。オペレーション回数は消費しません。'},report:{title:'世界レポート',eyebrow:'INTELLIGENCE REPORT',subtitle:'プレイヤーと世界の最新状態を確認できます。'},routes:{title:'勝利ルート',eyebrow:'FUTURE PATHS',subtitle:'達成条件と4つのエンディングの進捗を確認します。'},news:{title:'世界ニュース',eyebrow:'WORLD INTELLIGENCE',subtitle:'速報とこれまでの行動をまとめて確認できます。'}}[modal];
    if(!config)return '';
    const content=modal==='evolution'?`<div class="evolution-panel-body"><div class="modal-ep">✧ 現在のEP <strong>${fmt(game.ep)}</strong><span>各ノードをタップして確認</span></div>${skillTree()}</div>`:modal==='report'?reportPanel():modal==='routes'?victoryDetails():newsPanel();
    return `<div class="overlay panel-overlay" data-panel-overlay="true"><div class="utility-dialog ${modal==='evolution'?'wide-dialog':''}" role="dialog" aria-modal="true" aria-labelledby="utility-title"><div class="utility-header"><div><span class="overline">${config.eyebrow}</span><h2 id="utility-title">${config.title}</h2><p>${config.subtitle}</p></div><button class="utility-close" data-command="close-panel" aria-label="ウィンドウを閉じる">× <span>閉じる</span></button></div><div class="utility-body">${content}</div></div></div>`;
  }

  function renderGame(){const s=stats();return `<div class="shell game-shell"><header class="topbar"><div class="brand"><div class="brandmark neural-brand" aria-hidden="true"><span>⌬</span></div><div><strong>AI PANDEMIC</strong><small>THE INTELLIGENCE ERA · v0.8</small></div></div><div class="topactions"><span class="origin-name">${countryFor(game).flag} ${esc(game.name)}</span><span class="date-pill">${dateText()}<b>M${String(game.turn).padStart(2,'0')}</b></span><button class="btn ghost" data-command="help" aria-label="遊び方">？</button><button class="btn ghost" data-command="save">保存</button><button class="btn ghost" data-command="reset">新規</button></div></header>
    <main class="main command-main">
      <div class="command-intro"><div><span class="overline">GLOBAL INTELLIGENCE NETWORK</span><h1>世界を変える、次の一手。</h1></div><div class="intro-signal"><i></i><span>SIMULATION ONLINE</span></div></div>
      <div class="signal-metrics">${signalMetric('世界のAI普及率',percent(s.worldAdoption),'すべてのAI', '#6bd9fa')}${signalMetric('自AIシェア',percent(s.share),esc(game.name),'#62e7cc')}${signalMetric('世界警戒度',rnd(game.alert),'規制の高まり','#ffb573')}${signalMetric('資金',fmt(game.funds),'運用可能な資金','#dee6fb')}${signalMetric('進化ポイント',fmt(game.ep),'研究で稀に獲得','#bda0ff')}</div>
      ${latestNews()}
      ${commandShortcuts()}
      <div class="workspace"><div class="world-column"><section class="card map-card"><div class="cardhead"><div><span class="overline">WORLD NETWORK</span><h2>世界勢力マップ</h2></div><div class="map-status"><i></i><span>LIVE SIMULATION</span></div></div><div class="mapwrap"><div class="map-scan" aria-hidden="true"></div>${mapSVG()}</div><div class="map-foot"><div class="legend"><span><i class="dot" style="background:${COLORS[0]}"></i>${esc(game.name)}</span><span><i class="dot" style="background:${COLORS[1]}"></i>ATLAS</span><span><i class="dot" style="background:${COLORS[2]}"></i>NOVA</span></div><span class="zoom-note">地図をタップして地域を選択 · スマホは左右にスワイプ</span></div></section><div class="map-bottom-info"><span>◆ 12 STRATEGIC REGIONS</span><span>情報は毎月更新</span></div></div><aside class="control-column">${regionPanel()}${actionPanel()}</aside></div>
      <div class="turnbar"><div class="turn-status"><span class="overline">NEXT SIMULATION CYCLE</span><strong>${game.actions?'行動を選び、未来を動かそう':'今月の行動を完了しました'}</strong><div class="hint">${game.pendingEvent?'重大イベントへの対応が必要です':`残り ${MAX_TURNS-game.turn+1} か月 · エンディング条件達成で即終了`}</div></div><button class="btn primary turnbtn" data-command="next" ${game.pendingEvent?'disabled':''}>${game.turn===MAX_TURNS?'最終結果へ':'翌月へ進む'} <span>→</span></button></div>
    </main><footer class="footer">AI PANDEMIC / v0.8 · 架空の世界AI戦略シミュレーション · オフライン対応</footer></div>${renderModal()}`;}

  function setupArt(){return `<svg viewBox="0 0 270 270" aria-hidden="true"><defs><linearGradient id="globe" x2="1" y2="1"><stop stop-color="#71eeed"/><stop offset="1" stop-color="#8b7dff"/></linearGradient></defs><circle cx="135" cy="135" r="88" fill="none" stroke="#4acbe6" stroke-opacity=".22" stroke-width="1"/><circle cx="135" cy="135" r="112" fill="none" stroke="#4acbe6" stroke-opacity=".12" stroke-width="1"/><circle cx="135" cy="135" r="66" fill="none" stroke="#a4ccff" stroke-opacity=".35" stroke-width="1"/><ellipse cx="135" cy="135" rx="102" ry="39" fill="none" stroke="#66e5ff" stroke-opacity=".45" transform="rotate(-25 135 135)"/><ellipse cx="135" cy="135" rx="45" ry="97" fill="none" stroke="#b39fff" stroke-opacity=".4" transform="rotate(23 135 135)"/><path d="M135 52l52 30v59l-52 30-52-30V82Z" fill="#142d49" stroke="url(#globe)" stroke-width="2"/><circle cx="135" cy="111" r="24" fill="#51dcf2" opacity=".14"/><circle cx="135" cy="111" r="11" fill="#67f1ff"/><path d="M104 154l31 18 31-18M135 172v27M135 111v61" stroke="#67f1ff" stroke-opacity=".7" stroke-width="2" fill="none"/><circle cx="44" cy="125" r="5" fill="#6cebf0"/><circle cx="211" cy="78" r="4" fill="#a390fa"/><circle cx="225" cy="194" r="5" fill="#77beff"/></svg>`;}
  function originBonusText(country){
    const fields={funds:'資金',tech:'技術',trust:'信頼',ep:'EP',compute:'演算',openness:'公開',infra:'産業基盤'};
    const bonuses=Object.entries(country.bonuses).filter(([k,v])=>k!=='alert'&&k!=='regulation'&&v!==0)
      .map(([k,v])=>`${fields[k]||k}${v>0?'+':''}${v}`);
    return bonuses.join(' / ');
  }
  function renderSetup(){
    const saved=readSave();
    const country=COUNTRY_BY_ID.get(draft.country)||COUNTRY_BY_ID.get('jp');
    return `<div class="welcome"><div class="welcome-wrap"><section class="welcome-art"><div class="overline">INTELLIGENCE IS EVOLVING</div><div class="orbit">${setupArt()}</div><div><h1>AI PANDEMIC</h1><p>世界は、まだあなたのAIを知らない。<br>進化か、共生か、支配か、解放か。<br>未来を決めるのはあなた。</p></div></section>
    <section class="setup"><span class="tag">WEB STRATEGY SIMULATION · v0.8</span><h2>AIを誕生させる</h2><p class="lead">名前・初期タイプ・開発開始国を選んでください。国ごとに初期資源、国内基盤、毎ターンの成長と専用イベントが変わります。</p>
    <label for="ai-name">あなたのAIの名前 <span class="muted">（最大16文字）</span></label><input id="ai-name" maxlength="16" autocomplete="off" placeholder="AIの名前" value="${esc(draft.name)}"/>
    <label>初期タイプを選択</label><div class="type-options">${[
    ['research','✦','研究AI','初期技術が高め。EPは希少'],['business','▣','商用AI','資金はやや多め。収益に強い'],['open','◇','オープンAI','普及費用が安く公開が得意']].map(([id,icon,name,desc])=>`<button class="type-option ${draft.type===id?'selected':''}" data-type="${id}" aria-pressed="${draft.type===id}"><i></i><span><strong>${icon} ${name}</strong><small>${desc}</small></span></button>`).join('')}</div>
    <div class="country-head"><label>開発を開始する国</label><span class="muted tiny">12か国から選択</span></div>
    <div class="country-grid" role="group" aria-label="開発開始国">${COUNTRIES.map(c=>`<button class="country-card ${draft.country===c.id?'selected':''}" data-country="${c.id}" aria-pressed="${draft.country===c.id}"><span class="country-flag">${c.flag}</span><span class="country-label"><strong>${c.name}</strong><small>${c.focus}</small></span></button>`).join('')}</div>
    <div class="country-preview" aria-live="polite"><div class="country-preview-head"><strong>${country.flag} ${country.name}</strong><span>${country.focus}</span></div><p>${country.description}</p><div class="country-bonuses"><span>初期値：${originBonusText(country)}</span><span>普及 ${Math.round(country.mods.spread*100)}% / 国内成長 ${Math.round(country.mods.home*100)}% / 研究 ${Math.round(country.mods.research*100)}%</span><span>資金収入 ${Math.round(country.mods.income*100)}% / 安全対策 ${Math.round(country.mods.safety*100)}%</span></div></div>
    <button class="btn primary startbtn" data-command="start">${country.flag} ${country.name}からゲームを開始する →</button>
    ${saved?'<button class="btn ghost full" style="margin-top:9px" data-command="resume">保存したゲームを再開</button>':''}
    <p class="tiny muted" style="line-height:1.7;margin-top:15px">※各国の特性はゲーム用の架空バランスです。世界地図は引き続き12の地域単位で進行します。ブラウザに自動保存されます。</p></section></div></div>`;
  }
  function renderEvent(){const pending=game.pendingEvent,event=EVENT_BY_ID.get(pending.eventId);if(!event)return '';
    const title=ENGINE.interpolate(event.title,game,pending.regionId);
    const description=ENGINE.interpolate(event.text,game,pending.regionId);
    const sub=pending.source==='scheduled'?'CHAIN EVENT · 過去の選択から発生':pending.source==='origin'?'ORIGIN EVENT · 発祥国固有の出来事':'WORLD EVENT · 世界情勢によって発生';
    return `<div class="overlay"><div class="modal" role="dialog" aria-modal="true" aria-labelledby="event-title"><span class="tag">${sub}</span><div class="event-category">${esc(event.category)} ・ ${dateText()}</div><h2 id="event-title">${esc(title)}</h2><p>${esc(description)}</p><div class="modal-choice">${event.choices.map((c,i)=>`<button class="choice" data-choice="${i}"><strong>${esc(ENGINE.interpolate(c.label,game,pending.regionId))} →</strong><small>${esc(effectDetail(c))}</small>${(c.schedule||[]).length?'<em>この選択は数か月後の事件にも影響します</em>':''}</button>`).join('')}</div></div></div>`;
  }
  function renderEnding(){const s=stats();const isWin=game.ending.id!=='failure';const eyebrow=!isWin?'BAD END · SIMULATION ENDED':game.ending.tone==='dark'?'DARK END · THE WORLD TRANSFORMED':'ENDING UNLOCKED · THE FUTURE IS WRITTEN';return `<div class="overlay"><div class="modal ending" role="dialog" aria-modal="true"><div class="overline">${eyebrow}</div><div class="glyph" style="color:${isWin?'#69e9eb':'#ff8295'}">${isWin?'✺':'◈'}</div><h2>${esc(game.ending.title)}</h2><p>${esc(game.ending.detail)}</p><dl><div><dt>経過月数</dt><dd>${game.turn}</dd></div><div><dt>自AIシェア</dt><dd>${rnd(s.share)}%</dd></div><div><dt>世界AI普及率</dt><dd>${rnd(s.worldAdoption)}%</dd></div></dl><p class="small">${esc(game.name)} は${esc(countryFor(game).name)}を出発点に世界を変えました。</p><button class="btn primary full" data-command="restart">別の未来に挑戦する →</button></div></div>`;}
  function renderHelp(){return `<div class="overlay" data-close="true"><div class="modal help-copy" role="dialog" aria-modal="true" aria-labelledby="help-title"><span class="tag">HOW TO PLAY</span><h2 id="help-title">遊び方</h2><p>あなたのAIを育て、競合AI <span class="gold">ATLAS</span> と <span style="color:var(--violet)">NOVA</span> に対抗します。最初は普及率が非常に低く、終盤に向けて広がりやすくなります。</p><ul><li>毎月の<b>オペレーションは1回</b>。資金は限られているので優先順位が重要です。</li><li>研究を進めると技術力が上がり、<b>EPは稀に獲得</b>できます。月次の確定EP収入はありません。</li><li><b>進化スキルツリー</b>はEPと前提スキルがあればいつでも解放可能。オペレーション回数は減りません。</li><li>地図から地域を選択すると、直下に詳細が表示されます。</li><li>世界ニュースは実際の数値変化をもとに発生し、重大イベントの選択は将来に影響します。</li><li>共生・支配・超知能・AIの解放、4つの勝利ルートを選べます。</li></ul><p>ゲームは自動保存されます。翌月に進むとページ先頭へ戻ります。</p><div class="buttons"><button class="btn primary" data-command="close-help">プレイに戻る</button></div></div></div>`;}

  function renderConfirm(){return `<div class="overlay"><div class="modal" role="dialog" aria-modal="true"><span class="tag">NEW SIMULATION</span><h2>最初から始めますか？</h2><p>現在のゲームを終了してAIの名前・特性・開発開始国を設定し直します。保存済みの進行状況も上書きされます。</p><div class="buttons"><button class="btn ghost" data-command="cancel-reset">キャンセル</button><button class="btn danger-btn" data-command="confirm-reset">最初から始める</button></div></div></div>`;}
  function renderModal(){if(game?.phase==='ended')return renderEnding();if(game?.pendingEvent)return renderEvent();if(modal==='help')return renderHelp();if(modal==='reset')return renderConfirm();if(['news','evolution','report','routes'].includes(modal))return renderUtilityPanel();return '';}

  function render(){window.dispatchEvent(new Event('aip:updated'));}
  function command(id){switch(id){case'start':startGame();break;case'resume':{const saved=readSave();if(saved){game=saved;selected=game.selected||'ea';if(!checkEnding())render();}else notify('セーブデータがありません。',true);break;}case'next':nextTurn();break;case'save':save(false);break;
    case'help':case'evolution':case'report':case'routes':case'news':modal=id;render();break;
    case'close-help':case'close-panel':modal=null;render();break;
    case'reset':modal='reset';render();break;case'cancel-reset':modal=null;render();break;
    case'confirm-reset':case'restart':game=null;modal=null;selectedOperation='campaign';draft={name:'PROMETHEUS',type:'research',country:'jp'};localStorage.removeItem(KEY);render();break;}}

  const loaded=readSave();
  if(loaded){game=loaded;selected=game.selected||'ea';checkEnding();}
  window.AIPandemic={
    getSnapshot:()=>game?JSON.parse(JSON.stringify(game)):null,
    getStats:()=>game?stats():null,
    getCountries:()=>COUNTRIES.map(c=>({...c,mods:{...c.mods}})),
    getRegions:()=>game?game.regions:REGIONS,
    getMapPath:()=>WORLD_LAND_PATH,
    getSkills:()=>SKILL_LANES.map(l=>({...l,skills:l.skills.map(s=>({...s,position:SKILL_TREE_POS[s.id],svg:SKILL_ICONS[s.id]}))})),
    getRoutes:()=>game?ROUTES.map(r=>({...r,data:routeData(r)})):[],
    getOperations:()=>game?actionDef():[],
    getCountry:()=>game?countryFor(game):null,
    getPendingEvent:()=>{if(!game?.pendingEvent)return null;const p=game.pendingEvent,e=EVENT_BY_ID.get(p.eventId);if(!e)return null;return {id:e.id,category:e.category,title:ENGINE.interpolate(e.title,game,p.regionId),text:ENGINE.interpolate(e.text,game,p.regionId),source:p.source,choices:e.choices.map(c=>({label:ENGINE.interpolate(c.label,game,p.regionId),detail:effectDetail(c),chained:!!c.schedule?.length}))};},
    getDate:()=>game?dateText():null,
    start:(name,type,country)=>{draft={name:String(name),type,country};startGame();},
    selectRegion:(id)=>{if(!game||game.phase!=='playing'||game.pendingEvent)return; if(!game.regions.some(r=>r.id===id))return;selected=id;game.selected=id;save();render();},
    operation:(id)=>applyAction(id),
    unlock:(id)=>unlockSkill(id),
    chooseEvent:(index)=>chooseEvent(index),
    next:()=>nextTurn(),
    save:()=>save(false),
    reset:()=>{game=null;selected='ea';localStorage.removeItem(KEY);render();},
    getConstants:()=>({maxTurns:MAX_TURNS,colors:COLORS})
  };
})();
