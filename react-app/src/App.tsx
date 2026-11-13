import * as React from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

// The deterministic simulation remains in the legacy engine for save compatibility.
// All controls below communicate through this small typed integration boundary.
type AIType = 'business' | 'research' | 'open';
type Panel = null | 'evolution' | 'report' | 'routes' | 'news' | 'help' | 'reset';
type Metric = 'funds' | 'ep' | 'trust' | 'tech' | 'compute' | 'autonomy' | 'openness' | 'infra' | 'alert';
interface Region { id:string; name:string;short:string; cx:number; cy:number; pop:number; digital:number; demand:number; regulation:number; adoption:number; presence:number[]; integration:number; points:string; }
interface Country {id:string;name:string;flag:string;regionId:string;focus:string;description:string;mods:Record<string,number>}
interface Skill {id:string; title:string;desc:string;cost:number; effect:Record<string,number>;requires?:string[];minimum?:Record<string,number>;position:[number,number];svg:string;}
interface Lane {id:string;title:string;symbol:string;skills:Skill[]}
interface News {id:string;turn:number;message:string;body?:string;category?:string;severity?:string;}
interface EventChoice {label:string;detail:string;chained:boolean;}
interface PendingEvent {id:string;category:string;title:string;text:string;source:string;choices:EventChoice[]}
interface Game {version:number;phase:'playing'|'ended';turn:number;actions:number; name:string;type:AIType;countryId:string;homeRegionId:string;selected:string;regions:Region[];funds:number;ep:number;trust:number;tech:number;compute:number;autonomy:number;openness:number;infra:number;alert:number;publications:number;project:number;unlockedSkills:string[];feed:News[];activityLog:{turn:number;message:string}[];pendingEvent:unknown;ending?:{id:string;title:string;detail:string;tone:string;turn:number}}
interface Stats {worldAdoption:number;share:number;sh:number[];dependency:number;integration:number;maxOthers:number;safeAlert:number;governance:number;trust:number;tech:number;compute:number;autonomy:number;openness:number;publications:number;project:number;}
interface RouteData {progress:number;ready:boolean;req:{key:string;label:string;value:number;target:number;progress:number;done:boolean}[]}
interface Route {id:string;title:string;hint:string;color:string;icon:string;data:RouteData}
interface Operation {id:string;title:string;desc:string;cost:string;detail:string;icon:string;}
interface Engine {
 getSnapshot():Game|null;getStats():Stats|null;getCountries():Country[];getRegions():Region[];getMapPath():string;getSkills():Lane[];getRoutes():Route[];getOperations():Operation[];getCountry():Country|null;getPendingEvent():PendingEvent|null;getDate():string|null;getConstants():{maxTurns:number;colors:string[]};
 start(name:string,type:AIType,country:string):void;selectRegion(id:string):void;operation(id:string):void;unlock(id:string):void;chooseEvent(i:number):void;next():void;save():void;reset():void;
}
declare global {interface Window {AIPandemic:Engine}}
const engine = window.AIPandemic;
const NUM=(x:number)=>Math.round(x).toLocaleString('ja-JP');
const pct=(x:number)=>`${Math.round(x)}%`;
const clamp=(n:number,a=0,b=100)=>Math.min(b,Math.max(a,n));
const colors={player:'#4ce0d6',atlas:'#e9b46f',nova:'#b48dff'};
// World land and clickable regions are compiled from one geodata source.
interface Geography {landPath:string;regionPaths:Record<string,string>;countryBorders:string;anchors:Record<string,[number,number]>}
declare global {interface Window {AIPandemicGeography:Geography}}
const GEO=window.AIPandemicGeography;
const MAP_ANCHORS=GEO.anchors;
const laneColors:Record<string,string>={reason:'#66ceff',autonomy:'#b99bff',trust:'#65dfb3',spread:'#ffcd81',singularity:'#fa8fc3'};
const opIcons:Record<string,string>={campaign:'radio',integrate:'layers',research:'brain',compute:'cpu',safety:'shield',fundraise:'coins'};

type IconName='logo'|'globe'|'chevron-right'|'chevron-left'|'arrow-up-right'|'sparkles'|'layers'|'brain'|'cpu'|'shield'|'coins'|'radio'|'chart'|'branch'|'news'|'calendar'|'close'|'check'|'play'|'menu'|'save'|'refresh'|'bolt'|'eye'|'lock'|'target'|'info'|'signal'|'arrow-right'|'search'|'star'|'zoom-in';
function Icon({name,size=20,className=''}:{name:IconName|string;size?:number;className?:string}){
 const paths:Record<string,React.ReactNode>={
  logo:<><path d="M12 2 21 7v10l-9 5-9-5V7z"/><path d="m12 7 5 3v5l-5 3-5-3v-5z"/><path d="M12 2v5m9 0-4 3m-10 0L3 7m9 11v4"/></>,
  globe:<><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c-5 5-5 13 0 18M12 3c5 5 5 13 0 18"/></>,
  'chevron-right':<path d="m9 5 7 7-7 7"/>, 'chevron-left':<path d="m15 5-7 7 7 7"/>, 'arrow-right':<><path d="M4 12h16m-6-6 6 6-6 6"/></>,
  'arrow-up-right':<><path d="M7 17 17 7M8 7h9v9"/></>,
  sparkles:<><path d="m12 2 2.7 7.3L22 12l-7.3 2.7L12 22l-2.7-7.3L2 12l7.3-2.7z"/></>,
  layers:<><rect x="4" y="4" width="16" height="6" rx="1"/><rect x="4" y="14" width="16" height="6" rx="1"/><path d="M8 10v4m8-4v4"/></>,
  brain:<><path d="M12 5c-4-5-10 0-8 5-4 3-1 9 3 9 2 4 5 3 5 1V5Zm0 0c4-5 10 0 8 5 4 3 1 9-3 9-2 4-5 3-5 1"/><path d="M8 9v5m8-5v5"/></>,
  cpu:<><rect x="6" y="6" width="12" height="12" rx="2"/><rect x="9" y="9" width="6" height="6" rx="1"/><path d="M9 2v4m6-4v4M9 18v4m6-4v4M2 9h4M2 15h4m12-6h4m-4 6h4"/></>,
  shield:<><path d="M12 2 20 6v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6z"/><path d="m8 12 3 3 5-6"/></>,
  coins:<><ellipse cx="12" cy="7" rx="8" ry="4"/><path d="M4 7v5c0 2 3 4 8 4s8-2 8-4V7M4 12v5c0 2 3 4 8 4s8-2 8-4v-5"/></>,
  radio:<><circle cx="12" cy="12" r="2"/><path d="M8 8a6 6 0 0 0 0 8m8-8a6 6 0 0 1 0 8M5 5a10 10 0 0 0 0 14m14-14a10 10 0 0 1 0 14"/></>,
  chart:<><path d="M4 20V4m0 16h16M7 16l4-5 4 3 5-8"/></>,
  branch:<><path d="M7 4v8c0 3 2 4 5 4h5M7 12c0-3 2-4 5-4h5"/><circle cx="7" cy="4" r="2"/><circle cx="17" cy="8" r="2"/><circle cx="17" cy="16" r="2"/></>,
  news:<><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 8h10M7 12h4M7 16h10m-4-4h4"/></>,
  calendar:<><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 2v6m10-6v6M3 10h18"/></>,
  close:<path d="M5 5l14 14M19 5 5 19"/>, check:<path d="m4 12 5 5L20 6"/>,
  play:<path d="M8 5 19 12 8 19z"/>,menu:<path d="M4 7h16M4 12h16M4 17h16"/>,
  save:<><path d="M4 3h13l3 3v15H4zM7 3v7h9V3M7 21v-8h10v8"/></>,
  refresh:<><path d="M20 11a8 8 0 0 0-14-5L3 9m0-6v6h6M4 13a8 8 0 0 0 14 5l3-3m0 6v-6h-6"/></>,
  bolt:<path d="M14 2 5 13h7l-2 9 9-12h-7z"/>,
  eye:<><path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></>,
  lock:<><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></>,
  target:<><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></>,
  info:<><circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v1"/></>,
  signal:<><path d="M3 20v-4m5 4v-8m5 8V8m5 12V4"/></>,
  search:<><circle cx="10" cy="10" r="7"/><path d="m15 15 6 6"/></>,
  star:<path d="m12 2 3 7 7 .6-5.5 4.6 1.6 7.4L12 17.5 5.9 21.6l1.6-7.4L2 9.6 9 9z"/>,
  'zoom-in':<><circle cx="10" cy="10" r="7"/><path d="M10 7v6m-3-3h6m2 5 6 6"/></>
 };
 return <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]||paths.sparkles}</svg>;
}

function Progress({value,color='#58e2d1',height=6}:{value:number;color?:string;height?:number}){return <div className="progress-track" style={{height}}><div className="progress-bar" style={{width:`${clamp(value)}%`,background:color}}/></div>}
function Tag({children,tone='cyan'}:{children:React.ReactNode;tone?:string}){return <span className={`tag tag-${tone}`}>{children}</span>}
function Brand({small=false}:{small?:boolean}){return <div className={`brand ${small?'brand-small':''}`}><div className="brand-logo"><Icon name="logo" size={24}/><span className="brand-logo-halo"/></div><div className="brand-copy"><strong>AI <span>PANDEMIC</span></strong><small>GLOBAL INTELLIGENCE SIMULATOR</small></div></div>}

interface UIState {revision:number;modal:Panel;selectedOp:string;selectedSkill:string|null;draftName:string;draftType:AIType;draftCountry:string;newsTab:'news'|'log';confirmAdvance:boolean;showFullNews:boolean;}
class App extends React.Component<{},UIState> {
 mapRef:{current:HTMLDivElement|null}={current:null};
 treeRef:{current:HTMLDivElement|null}={current:null};
 listener=()=>this.setState(s=>({revision:s.revision+1}));
 constructor(props:{}){super(props);this.state={revision:0,modal:null,selectedOp:'campaign',selectedSkill:null,draftName:'PROMETHEUS',draftType:'research',draftCountry:'jp',newsTab:'news',confirmAdvance:false,showFullNews:false};}
 componentDidMount(){window.addEventListener('aip:updated',this.listener);this.centerHome();}
 componentWillUnmount(){window.removeEventListener('aip:updated',this.listener);}
 componentDidUpdate(_prev:{},previous:UIState){const g=engine.getSnapshot();if(previous.revision!==this.state.revision&&g?.turn===1&&previous.revision===0)this.centerHome();}
 centerHome(){const g=engine.getSnapshot();const sc=this.mapRef.current;if(!g||!sc)return;const r=g.regions.find(r=>r.id===g.selected);if(!r)return;requestAnimationFrame(()=>{const width=sc.scrollWidth;sc.scrollLeft=width*(MAP_ANCHORS[r.id][0]/960)-sc.clientWidth/2;});}
 open(modal:Panel){this.setState({modal,selectedSkill:null});}
 close(){this.setState({modal:null});}
 start(){engine.start(this.state.draftName.trim(),this.state.draftType,this.state.draftCountry);this.setState({selectedOp:'campaign',modal:null});}
 selectRegion(id:string){engine.selectRegion(id);}
 executeOp(){engine.operation(this.state.selectedOp);}
 next(){this.setState({modal:null,confirmAdvance:false});engine.next();window.scrollTo({top:0,behavior:'smooth'});}
 restart(){engine.reset();this.setState({modal:null,selectedOp:'campaign',selectedSkill:null,draftName:'PROMETHEUS'});window.scrollTo({top:0});}
 render(){const g=engine.getSnapshot();return <div className="site-root">{g?this.renderGame(g):this.renderSetup()}{g?.pendingEvent?this.renderEvent():null}{g?.phase==='ended'?this.renderEnding(g):null}{g&&!g.pendingEvent&&g.phase==='playing'&&this.state.modal?this.renderModal(g):null}</div>}
 renderSetup(){const countries=engine.getCountries();const types:{id:AIType;title:string;sub:string;icon:IconName}[]=[{id:'business',title:'商用AI',sub:'収益と企業への浸透',icon:'coins'},{id:'research',title:'研究AI',sub:'高度な推論と技術進化',icon:'brain'},{id:'open',title:'オープンAI',sub:'共有技術と普及力',icon:'globe'}];const country=countries.find(c=>c.id===this.state.draftCountry)!;
 return <main className="setup-page">
   <div className="setup-background"><span/><span/><span/></div>
   <header className="setup-top"><Brand/><span className="version-pill">PREVIEW BUILD <b>1.0.1</b></span></header>
   <div className="setup-container">
    <section className="setup-hero"><Tag>SIMULATION INITIALIZATION</Tag><h1>知性は、生まれた場所から<br/><em>世界の形を変えていく。</em></h1><p>AIを開発し、競合に先んじて技術を進化させ、世界を動かす。あなたの選択が、人類の未来を決める。</p>
    <div className="origin-core"><div className="orbit orbit-a"/><div className="orbit orbit-b"/><div className="orbit orbit-c"/><div className="core-hex"><Icon name="logo" size={66}/></div><div className="orbit-label orbit-label-a">NEURAL CORE</div><div className="orbit-label orbit-label-b">SYSTEM ONLINE</div><div className="spark s1"/><div className="spark s2"/><div className="spark s3"/></div>
    <div className="setup-facts"><span><i/> 3つのAI勢力</span><span><i/> 12の戦略地域</span><span><i/> 4つの結末</span></div></section>
    <section className="setup-form panel-glass"><div className="setup-form-head"><div><span className="eyebrow">CREATE YOUR INTELLIGENCE</span><h2>AIの起動設定</h2></div><span className="setup-index">01 / 03</span></div>
     <label className="form-label" htmlFor="ai-name">01 — AIの名称</label><div className="input-shell"><Icon name="logo" size={18}/><input id="ai-name" maxLength={16} value={this.state.draftName} onChange={e=>this.setState({draftName:e.currentTarget.value})} placeholder="AIの名前を入力"/></div>
     <label className="form-label">02 — 開発方針</label><div className="type-choices">{types.map(t=><button type="button" key={t.id} className={`type-choice ${t.id===this.state.draftType?'active':''}`} onClick={()=>this.setState({draftType:t.id})}><span className="type-icon"><Icon name={t.icon}/></span><b>{t.title}</b><small>{t.sub}</small></button>)}</div>
     <label className="form-label">03 — 開発開始国</label><div className="countries-grid">{countries.map(c=><button key={c.id} type="button" className={`country-choice ${c.id===country.id?'active':''}`} onClick={()=>this.setState({draftCountry:c.id})}><span>{c.flag}</span><strong>{c.name}</strong></button>)}</div>
     <div className="country-summary"><Icon name="target" size={18}/><div><b>{country.flag} {country.name} — {country.focus}</b><p>{country.description}</p></div></div>
     <button type="button" className="primary-button start-button" disabled={!this.state.draftName.trim()||['ATLAS','NOVA'].includes(this.state.draftName.trim().toUpperCase())} onClick={()=>this.start()}><Icon name="play" size={17}/> シミュレーションを開始 <Icon name="arrow-right" size={20}/></button><p className="form-footnote">自動保存 / オフライン動作 / 外部アカウント不要</p>
    </section>
   </div>
 </main>}
 renderGame(g:Game){const st=engine.getStats()!;const country=engine.getCountry()!;const selected=g.regions.find(r=>r.id===g.selected)||g.regions[0];const newest=g.feed[0];const today=engine.getDate();
 return <div className="game-shell">
   <header className="app-header"><Brand small/><div className="header-status"><span className="live-dot"/> GLOBAL NETWORK <b>ONLINE</b></div><div className="header-right"><span className="origin-chip">{country.flag} <b>{g.name}</b></span><span className="date-chip"><Icon name="calendar" size={15}/>{today}<small> M{String(g.turn).padStart(2,'0')}</small></span><button className="icon-button" onClick={()=>this.open('help')} title="遊び方"><Icon name="info"/></button><button className="icon-button" onClick={()=>engine.save()} title="保存"><Icon name="save"/></button></div></header>
   <div className="game-body">
   <section className="status-strip" aria-label="世界の状況">
    {this.renderStat('世界AI普及率',pct(st.worldAdoption),'globe',colors.player)}
    {this.renderStat('自AIシェア',pct(st.share),'target','#7d9fff')}
    {this.renderStat('警戒度',NUM(g.alert),'shield','#ffc37e')}
    {this.renderStat('資金',NUM(g.funds),'coins','#d9e4f9')}
    {this.renderStat('進化EP',NUM(g.ep),'sparkles','#bca0ff')}
   </section>
   <div className="content-grid">
    <div className="map-column">
     <section className="world-panel panel-glass">
      <div className="section-heading"><div><span className="eyebrow"><span className="online-dot"/> TACTICAL OVERVIEW</span><h1>世界勢力マップ</h1></div><button className="small-link" onClick={()=>this.open('report')}><Icon name="chart" size={16}/> 世界レポート</button></div>
      <div className="map-frame"><div className="map-noise" aria-hidden="true"/><div className="map-scroller" ref={el=>{this.mapRef.current=el;}}>{this.renderMap(g)}</div><div className="map-scanline" aria-hidden="true"/></div>
      <div className="map-legend"><span><i style={{background:colors.player}}/> {g.name}</span><span><i style={{background:colors.atlas}}/> ATLAS</span><span><i style={{background:colors.nova}}/> NOVA</span><span className="legend-hint">数値＝自AIシェア · 色＝首位AI · スワイプで移動</span></div>
     </section>
     <div className="news-preview panel-glass"><div className="news-intro"><span className="news-red"><Icon name="radio" size={17}/></span><div><span className="eyebrow">WORLD NEWS / {today}</span><p>{newest?.message||'世界ネットワークに接続しています'}</p></div></div><button className="small-link" onClick={()=>this.open('news')}>すべて見る <Icon name="arrow-right" size={16}/></button></div>
     <div className="quick-launch"><button onClick={()=>this.open('evolution')}><span className="q-icon violet"><Icon name="branch"/></span><span><b>進化ツリー</b><small>EPを使って能力を解放</small></span><span className="counter-chip">EP {g.ep}</span><Icon name="chevron-right" size={17}/></button><button onClick={()=>this.open('routes')}><span className="q-icon cyan"><Icon name="target"/></span><span><b>勝利ルート</b><small>4つの結末の達成状況</small></span><Icon name="chevron-right" size={17}/></button></div>
    </div>
    <div className="action-column">
      {this.renderRegion(g,selected)}
      {this.renderOperations(g,selected)}
     </div>
   </div>
   <div className="turn-footer panel-glass"><div><span className="eyebrow">NEXT CYCLE / {g.turn} OF 36</span><b>{g.actions>0?'次の一手を選ぼう':'今月のアクションは完了しました'}</b><small>各月のオペレーションは1回 · 進化はEPがあれば自由</small></div><button type="button" className="primary-button next-button" disabled={!!g.pendingEvent} onClick={()=>this.next()}>翌月へ進む <Icon name="arrow-right" size={19}/></button></div>
   <footer className="app-footer">AI PANDEMIC · v1.0.1 / EXPERIMENTAL INTELLIGENCE NETWORK <button onClick={()=>this.open('reset')}>新しく始める</button></footer>
   </div>
 </div>}
 renderStat(label:string,value:string,icon:string,color:string){return <div className="stat-cell" key={label} style={{'--stat-color':color} as React.CSSProperties}><span><Icon name={icon} size={16}/>{label}</span><strong>{value}</strong><div className="stat-undershine"/></div>}
 renderMap(g:Game){const mapPath=GEO.landPath;const selected=g.selected;const selectedRegion=g.regions.find(r=>r.id===selected)||g.regions[0];const chosenLines=g.regions.filter(r=>r.id!==selected&&r.adoption>2).sort((a,b)=>b.adoption-a.adoption).slice(0,8);const [selectedX,selectedY]=MAP_ANCHORS[selectedRegion.id];
 return <svg className="world-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 500" role="group" aria-label="AI世界勢力マップ">
   <defs><linearGradient id="world-ocean" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#0b2440"/><stop offset="1" stopColor="#071122"/></linearGradient><radialGradient id="region-highlight"><stop stopColor="#53f5de" stopOpacity=".25"/><stop offset="1" stopColor="#53f5de" stopOpacity="0"/></radialGradient><filter id="map-glow" x="-70%" y="-70%" width="240%" height="240%"><feGaussianBlur stdDeviation="5" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter><pattern id="map-grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#3b5c79" strokeWidth=".5" opacity=".35"/></pattern><clipPath id="world-land-clip" clipPathUnits="userSpaceOnUse"><path d={mapPath}/></clipPath></defs>
   <rect width="960" height="500" rx="8" fill="url(#world-ocean)"/><rect width="960" height="500" fill="url(#map-grid)"/>
   <path d={mapPath} fill="#21425e" opacity=".9" pointerEvents="none"/>
   {chosenLines.map((r,i)=><path key={r.id} className="data-trace" style={{animationDelay:`-${i*.45}s`}} d={`M ${selectedX} ${selectedY} Q ${(selectedX+MAP_ANCHORS[r.id][0])/2} ${Math.min(selectedY,MAP_ANCHORS[r.id][1])-40}, ${MAP_ANCHORS[r.id][0]} ${MAP_ANCHORS[r.id][1]}`} fill="none" stroke={colors.player} strokeWidth="1.2" strokeOpacity={.20+Math.min(.35,r.adoption*.007)}/>)}
   {g.regions.map(r=>{const sh=shares(r);const dominance=Math.max(...sh);const lead=sh.indexOf(dominance);const fill=[colors.player,colors.atlas,colors.nova][lead];const active=r.id===selected;const [cx,cy]=MAP_ANCHORS[r.id];return <g key={r.id} className={`map-region ${active?'is-selected':''}`} tabIndex={0} role="button" aria-label={`${r.name}、自AIシェア ${pct(sh[0])}`} onClick={()=>this.selectRegion(r.id)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();this.selectRegion(r.id);}}}>
      <path className="region-territory" d={GEO.regionPaths[r.id]} fillRule="evenodd" fill={fill} stroke={fill} strokeWidth={active?2:.95} pointerEvents="visiblePainted"/>
      {active?<><circle cx={cx} cy={cy} r="47" pointerEvents="none" fill="url(#region-highlight)"/><circle cx={cx} cy={cy} r="25" className="select-ring" pointerEvents="none"/></>:null}
      <circle className="map-pulse" cx={cx} cy={cy} r={active?13:7} stroke={fill} strokeOpacity=".55" fill="none" style={{animationDelay:`-${cx/150}s`}}/>
      <circle className="map-marker" cx={cx} cy={cy} r={active?17:14} fill="#0c2134" fillOpacity=".86" stroke={active?'#b2fff1':fill} strokeWidth={active?2.5:1.4}/><circle cx={cx} cy={cy} r={active?6.5:4.7} fill={active?'#e9fffe':fill} filter={active?'url(#map-glow)':undefined}/>
      <text x={cx} y={cy+31} textAnchor="middle" className={`map-region-label ${active?'active':''}`}>{r.short}</text><text x={cx} y={cy+48} textAnchor="middle" className="map-adoption-label">{pct(sh[0])}</text>
    </g>})}
   <path d={GEO.countryBorders} fill="none" stroke="#9fc5d3" strokeWidth=".42" strokeOpacity=".27" pointerEvents="none"/><path d={mapPath} fill="none" stroke="#a4c5d7" strokeWidth=".65" strokeOpacity=".82" pointerEvents="none"/><g className="map-selection-readout" pointerEvents="none"><rect x="684" y="12" width="258" height="35" rx="7"/><text x="700" y="34">SELECTED / {selectedRegion.short} · 自AIシェア {pct(shares(selectedRegion)[0])}</text></g><text x="29" y="468" className="map-corner-label">LIVE GLOBAL MARKET INFLUENCE • 12 REGIONS</text><text x="892" y="468" textAnchor="end" className="map-corner-label">2030 • DIGITAL WORLD</text>
  </svg>}
 renderRegion(g:Game,r:Region){const sh=shares(r);return <section className="region-panel panel-glass"><div className="section-heading"><div><span className="eyebrow">SELECTED REGION / {r.id.toUpperCase()}</span><h2>{r.name}</h2></div><span className="region-flag"><Icon name="globe" size={22}/></span></div>
   <div className="region-primary"><div><span>AI普及率</span><b>{pct(r.adoption)}</b></div><div><span>規制レベル</span><b>{Math.round(r.regulation)}<small> / 100</small></b></div><div><span>現地の自AIシェア</span><b style={{color:colors.player}}>{pct(sh[0])}</b></div></div>
   <div className="market-head"><span>AI市場シェア</span><small>3勢力の相対比率</small></div><div className="market-stack" title={`${g.name} ${pct(sh[0])}、ATLAS ${pct(sh[1])}、NOVA ${pct(sh[2])}`}><div style={{width:`${sh[0]}%`,background:colors.player}}/><div style={{width:`${sh[1]}%`,background:colors.atlas}}/><div style={{width:`${sh[2]}%`,background:colors.nova}}/></div>
   <div className="region-legend"><span><i style={{background:colors.player}}/>自AI {Math.round(sh[0])}%</span><span><i style={{background:colors.atlas}}/>ATLAS {Math.round(sh[1])}%</span><span><i style={{background:colors.nova}}/>NOVA {Math.round(sh[2])}%</span></div>
   <div className="region-statline"><span>デジタル基盤 <b>{r.digital}</b></span><span>技術需要 <b>{r.demand}</b></span><span>産業統合 <b>{Math.round(r.integration)}</b></span></div></section>}
 renderOperations(g:Game,r:Region){const ops=engine.getOperations();const op=ops.find(o=>o.id===this.state.selectedOp)||ops[0];const price:Record<string,number>={campaign:g.type==='open'?12:17,integrate:21,research:13,compute:21,safety:15,fundraise:0};const available=g.actions>0&&g.funds>=(price[op?.id]||0);return <section className="operation-panel panel-glass"><div className="section-heading"><div><span className="eyebrow">STRATEGIC OPERATIONS</span><h2>オペレーション</h2></div><Tag tone={g.actions>0?'cyan':'muted'}>{g.actions>0?'今月 あと1回':'今月 完了'}</Tag></div><p className="operation-intro">実行したい行動を選んでください。対象地域：<strong>{r.name}</strong></p>
   <div className="op-grid">{ops.map(o=><button type="button" key={o.id} className={`op-choice ${this.state.selectedOp===o.id?'selected':''}`} onClick={()=>this.setState({selectedOp:o.id})} disabled={g.actions<=0}><span className="op-icon"><Icon name={opIcons[o.id]||'sparkles'} size={21}/></span><span><b>{o.title}</b><small>{o.cost}</small></span></button>)}</div>
   {op?<div className="op-inspector"><div className="op-inspector-head"><strong>{op.title}</strong><span>{op.cost}</span></div><p>{op.desc}</p><div className="op-effect"><Icon name="sparkles" size={15}/> {op.detail}</div></div>:null}
   <button type="button" className="primary-button operation-execute" disabled={!available} onClick={()=>this.executeOp()}>{g.actions<=0?'今月の行動は完了':!available?'資金が不足しています':`${op?.title||'行動'} を実行`} <Icon name="arrow-right" size={18}/></button>
 </section>}
 renderEvent(){const ev=engine.getPendingEvent();if(!ev)return null;return <div className="modal-backdrop event-backdrop"><section className="event-window panel-glass" role="dialog" aria-modal="true" aria-label={ev.title}><div className="event-alert"><span className="event-beacon"/><strong>{ev.source==='scheduled'?'CHAIN REACTION':'WORLD EVENT'}</strong><span className="event-date">{engine.getDate()}</span></div><div className="event-symbol"><Icon name="radio" size={32}/></div><span className="eyebrow">{ev.category.toUpperCase()} / CRITICAL DECISION</span><h2>{ev.title}</h2><p>{ev.text}</p><div className="event-choices">{ev.choices.map((choice,i)=><button key={i} type="button" onClick={()=>engine.chooseEvent(i)}><span className="choice-num">{String(i+1).padStart(2,'0')}</span><span><strong>{choice.label}</strong><small>{choice.detail||'世界の状況に影響します'}</small>{choice.chained?<em>この選択は将来のイベントにつながります</em>:null}</span><Icon name="arrow-right" size={19}/></button>)}</div></section></div>}
 renderEnding(g:Game){const stats=engine.getStats()!;const win=g.ending?.id!=='failure';return <div className="modal-backdrop ending-backdrop"><section className="ending-window panel-glass" role="dialog" aria-modal="true" aria-label="ゲーム結果"><div className={`ending-emblem ${win?'victory':'defeat'}`}><Icon name={win?'star':'shield'} size={58}/><span/></div><Tag tone={win?'cyan':'danger'}>{win?'THE FUTURE IS WRITTEN':'SIMULATION TERMINATED'}</Tag><h1>{g.ending?.title}</h1><p>{g.ending?.detail}</p><div className="ending-summary"><div><span>到達ターン</span><strong>{g.turn}</strong></div><div><span>自AIシェア</span><strong>{pct(stats.share)}</strong></div><div><span>世界普及率</span><strong>{pct(stats.worldAdoption)}</strong></div></div><button className="primary-button" onClick={()=>this.restart()}>新しい未来に挑戦 <Icon name="arrow-right" size={19}/></button></section></div>}
 renderModal(g:Game){const panel=this.state.modal;if(!panel)return null;const info:Record<string,{title:string;kicker:string;icon:IconName}>={evolution:{title:'進化スキルツリー',kicker:'EVOLUTION NETWORK',icon:'branch'},report:{title:'世界レポート',kicker:'ANALYTICS & INTELLIGENCE',icon:'chart'},routes:{title:'勝利ルート',kicker:'FUTURE PATHWAYS',icon:'target'},news:{title:'世界ニュース',kicker:'GLOBAL SIGNAL FEED',icon:'news'},help:{title:'遊び方',kicker:'OPERATOR MANUAL',icon:'info'},reset:{title:'シミュレーションをやり直す',kicker:'RESET CONFIRMATION',icon:'refresh'}};
 const config=info[panel];return <div className="modal-backdrop" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)this.close()}}><section className={`utility-window panel-glass ${panel==='evolution'?'wide-window':''}`} role="dialog" aria-modal="true" aria-label={config.title}><div className="utility-titlebar"><div><span className="eyebrow"><Icon name={config.icon} size={15}/> {config.kicker}</span><h2>{config.title}</h2></div><button className="close-window" onClick={()=>this.close()} aria-label="閉じる"><Icon name="close" size={20}/></button></div><div className="utility-content">{panel==='evolution'?this.renderEvolution(g):panel==='report'?this.renderReport(g):panel==='routes'?this.renderRoutes():panel==='news'?this.renderNews(g):panel==='help'?this.renderHelp():this.renderReset()}</div></section></div>}
 renderEvolution(g:Game){const lanes=engine.getSkills();const all=lanes.flatMap(l=>l.skills);const selected=all.find(s=>s.id===this.state.selectedSkill);const skillStatus=(s:Skill)=>this.skillProblem(g,s);const byId=new Map(all.map(s=>[s.id,s]));const connections:[string,string][]=[];all.forEach(skill=>{(skill.requires?.length?skill.requires:['core']).forEach(r=>connections.push([r,skill.id]));});
 return <div className="evolution-layout"><div className="tree-main"><div className="tree-toolbar"><span>5 BRANCHES / 15 NODES</span><div className="tree-counters"><span className="ep-display"><Icon name="sparkles" size={17}/> EP {g.ep}</span><span>{g.unlockedSkills.length} / {all.length} 習得</span></div></div><div className="tree-scroll" ref={el=>{this.treeRef.current=el;}}><div className="tree-surface"><div className="tree-surface-grid"/><svg className="skill-lines" viewBox="0 0 1410 770" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">{connections.map(([a,b])=>{const pa=a==='core'?[105,386]:byId.get(a)?.position;const pb=byId.get(b)?.position;if(!pa||!pb)return null;const d=`M ${pa[0]} ${pa[1]} C ${(pa[0]+pb[0])/2} ${pa[1]}, ${(pa[0]+pb[0])/2} ${pb[1]}, ${pb[0]} ${pb[1]}`;const lit=a==='core'||g.unlockedSkills.includes(a);const done=g.unlockedSkills.includes(b);return <g key={a+b}><path d={d} className="skill-wire-back"/><path d={d} className={`skill-wire ${done?'wire-done':lit?'wire-ready':''}`} style={{stroke:done?'#70eac7':lit?'#8d9cf7':undefined}}/></g>})}</svg>
   <div className="tree-origin"><Icon name="logo" size={37}/><small>CORE</small></div>
   {lanes.map(l=>{const origin=l.skills[0];return <div key={l.id} className="tree-lane-label" style={{left:origin.position[0]-80,top:origin.position[1]-95,color:laneColors[l.id]}}>{l.title.toUpperCase()}</div>})}
   {all.map(s=>{const done=g.unlockedSkills.includes(s.id);const problem=skillStatus(s);const active=this.state.selectedSkill===s.id;return <button key={s.id} type="button" style={{left:s.position[0],top:s.position[1],'--node-color':laneColors[lanes.find(l=>l.skills.includes(s))!.id]} as React.CSSProperties} className={`skill-node ${done?'acquired':!problem?'available':'locked'} ${active?'active':''}`} onClick={()=>this.setState({selectedSkill:s.id})} aria-label={`${s.title}、EP ${s.cost}、${done?'習得済み':problem||'解放可能'}`}><span className="node-rim"><svg viewBox="0 0 48 48" className="node-symbol" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{__html:s.svg}}/></span><span className="node-title">{s.title}</span><small>{done?'✓ 解放済み':`EP ${s.cost}`}</small></button>})}
  </div></div><div className="tree-hint"><Icon name="info" size={14}/> ドラッグ・スワイプで枝を探索 · ノードを選択して詳細を表示</div></div>
  <aside className="skill-inspector"><div className="inspector-head"><span className="eyebrow">NODE INSPECTOR</span>{selected?<button className="icon-button" onClick={()=>this.setState({selectedSkill:null})}><Icon name="close" size={17}/></button>:null}</div>{selected?<><div className="inspector-symbol"><svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.7" dangerouslySetInnerHTML={{__html:selected.svg}}/></div><h3>{selected.title}</h3><p>{selected.desc}</p><div className="skill-price"><span>必要な進化ポイント</span><b>{selected.cost} <small>EP</small></b></div><div className="requirements"><strong>解放条件</strong>{(selected.requires||[]).map(id=><div key={id}><Icon name={g.unlockedSkills.includes(id)?'check':'lock'} size={15}/>{byId.get(id)?.title||id}</div>)}{Object.entries(selected.minimum||{}).map(([k,val])=><div key={k}><Icon name={(g as any)[k]>=val?'check':'lock'} size={15}/>{({tech:'技術',autonomy:'自律性',compute:'演算'} as Record<string,string>)[k]||k} {val}以上</div>)}{!selected.requires?.length&&!Object.keys(selected.minimum||{}).length?<div><Icon name="check" size={15}/> 初期から解放可能</div>:null}</div><button type="button" className="primary-button unlock-button" disabled={!!this.skillProblem(g,selected)} onClick={()=>engine.unlock(selected.id)}>{g.unlockedSkills.includes(selected.id)?'習得済み':this.skillProblem(g,selected)||`EP ${selected.cost} で解放`} <Icon name="arrow-right" size={17}/></button></>:<div className="inspector-empty"><Icon name="branch" size={34}/><h3>ノードを選択</h3><p>スキルの効果・前提条件・必要EPがここに表示されます。</p></div>}</aside></div>}
 skillProblem(g:Game,s:Skill){if(g.unlockedSkills.includes(s.id))return '習得済み';if((s.requires||[]).some(id=>!g.unlockedSkills.includes(id)))return '前提ノードが必要';if(Object.entries(s.minimum||{}).some(([k,v])=>((g as any)[k]||0)<v))return '必要な能力値が不足';if(g.ep<s.cost)return `EPが${s.cost-g.ep}不足`;return null;}
 renderRoutes(){return <div className="route-grid">{engine.getRoutes().map(r=><article key={r.id} className="route-card" style={{'--route-color':r.color} as React.CSSProperties}><div className="route-card-top"><span className="route-badge"><Icon name={r.id==='singularity'?'sparkles':r.id==='dominion'?'bolt':r.id==='coexist'?'shield':'globe'} size={24}/></span><span className="route-percent">{Math.round(r.data.progress)}%</span></div><h3>{r.title}</h3><p>{r.hint}</p><Progress value={r.data.progress} color={r.color} height={8}/><div className="route-requirements">{r.data.req.map(req=><div key={req.key} className={req.done?'ready':''}><span><Icon name={req.done?'check':'lock'} size={15}/>{req.label}</span><b>{Math.round(req.value)} {req.key==='safeAlert'?'≤':'/'} {req.target}</b></div>)}</div></article>)}</div>}
 renderReport(g:Game){const st=engine.getStats()!;const rows:[string,number,string][]=[['世界普及率',st.worldAdoption,'%'],['自AIシェア',st.share,'%'],['ATLAS シェア',st.sh[1],'%'],['NOVA シェア',st.sh[2],'%'],['AI依存度',st.dependency,'%'],['信頼度',g.trust,''],['技術力',g.tech,''],['演算能力',g.compute,''],['自律性',g.autonomy,''],['オープン化',g.openness,'']];return <div className="report-wrap"><div className="report-big"><span className="eyebrow">CURRENT INTELLIGENCE LEVEL</span><div><Icon name="brain" size={40}/><strong>{g.tech}<small> / 100</small></strong></div><p>世界に対する影響力の伸びと、AIの技術的進化を追跡します。</p></div><div className="report-metrics">{rows.map(([label,val,unit])=><div key={label}><div><span>{label}</span><strong>{Math.round(val)}{unit}</strong></div><Progress value={val} color={label.includes('ATLAS')?colors.atlas:label.includes('NOVA')?colors.nova:colors.player}/></div>)}</div></div>}
 renderNews(g:Game){return <div className="news-full"><div className="news-tabs"><button className={this.state.newsTab==='news'?'active':''} onClick={()=>this.setState({newsTab:'news'})}>世界ニュース</button><button className={this.state.newsTab==='log'?'active':''} onClick={()=>this.setState({newsTab:'log'})}>行動履歴</button></div>{this.state.newsTab==='news'?<div className="news-timeline">{(g.feed||[]).map(item=><article key={item.id} className={`news-story ${item.severity==='breaking'?'breaking':''}`}><span className="news-timeline-dot"/><small>MONTH {String(item.turn).padStart(2,'0')} · {item.category||'世界情勢'}</small><h3>{item.message}</h3>{item.body?<p>{item.body}</p>:null}</article>)}</div>:<div className="news-timeline">{g.activityLog.map((l,i)=><article key={i} className="news-story"><span className="news-timeline-dot"/><small>MONTH {String(l.turn).padStart(2,'0')} · ACTIVITY</small><h3>{l.message}</h3></article>)}</div>}</div>}
 renderHelp(){return <div className="help-content"><p>あなたはAI開発勢力のひとつ。競合するATLAS・NOVAの成長と、世界の警戒・規制の中で、4つの未来のいずれかを目指します。</p><div className="help-steps"><div><Icon name="globe"/><strong>01 / 地域を選ぶ</strong><p>世界マップをタップして地域を選択。地域ごとに普及率とAIシェアが違います。</p></div><div><Icon name="radio"/><strong>02 / 1か月に1回行動する</strong><p>研究・普及・産業導入などからひとつ選択。資金を使い切らないように注意。</p></div><div><Icon name="branch"/><strong>03 / EPで進化する</strong><p>EPは稀に獲得。スキル解放は行動回数を消費せず、前提ノードに沿って習得できます。</p></div><div><Icon name="target"/><strong>04 / 未来を選ぶ</strong><p>共生・支配・超知能・解放。どれかを達成すると、36か月を待たずにエンディングです。</p></div></div></div>}
 renderReset(){return <div className="reset-content"><div className="reset-icon"><Icon name="refresh" size={36}/></div><h3>最初から始めますか？</h3><p>現在のゲームを終了し、AI名・開発開始国・特性を再設定します。保存データは削除されます。</p><div className="reset-actions"><button className="secondary-button" onClick={()=>this.close()}>キャンセル</button><button className="danger-button" onClick={()=>this.restart()}>新しいシミュレーションを開始</button></div></div>}
}
function shares(r:Region){const total=r.presence.reduce((a,b)=>a+b,0);return r.presence.map(p=>total>0?p/total*100:0);}
const root=document.getElementById('root');if(root)createRoot(root).render(<App/>);
export default App;
