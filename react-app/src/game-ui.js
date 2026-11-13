'use strict';
(function(){
  if(!window.React.Fragment)window.React.Fragment=function Fragment(p){return p.children};
  const module={exports:{}}; const exports=module.exports;
  function require(id){
    if(id==='react')return window.React;
    if(id==='react-dom/client')return {createRoot: container => ({render: element => window.ReactDOM.render(element,container)})};
    if(id==='./style.css')return {};
    throw new Error('Unexpected dependency: '+id);
  }
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
const client_1 = require("react-dom/client");
require("./style.css");
const engine = window.AIPandemic;
const NUM = (x) => Math.round(x).toLocaleString('ja-JP');
const MATRIX_GLYPHS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワン012345789<>/{}[]=+';
function startMatrixRain(canvas) {
    if (!canvas || !canvas.getContext || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return () => {};
    const ctx = canvas.getContext('2d'); if (!ctx) return () => {};
    let width = 0, height = 0, dpr = 1, frame = 0, last = 0, columns = [];
    const font = 12, gap = 32;
    const randomGlyph = () => MATRIX_GLYPHS[Math.floor(Math.random() * MATRIX_GLYPHS.length)];
    const resize = () => {
        const rect = canvas.parentElement?.getBoundingClientRect(); if (!rect) return;
        width = rect.width; height = rect.height; dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        columns = Array.from({ length: Math.ceil(width / gap) }, (_, i) => {
            const length = 6 + Math.floor(Math.random() * 9);
            return { x: i * gap + Math.random() * 8, y: Math.random() * height, length, speed: .1 + Math.random() * .16, symbols: Array.from({ length }, randomGlyph) };
        });
    };
    const draw = time => {
        frame = window.requestAnimationFrame(draw); if (time - last < 72) return; last = time;
        ctx.clearRect(0, 0, width, height); ctx.font = '12px monospace'; ctx.textAlign = 'center';
        for (const column of columns) {
            for (let i = 0; i < column.length; i++) {
                const y = column.y - i * 14; if (y < -14 || y > height + 14) continue;
                ctx.globalAlpha = i === 0 ? .86 : .07 + .29 * (1 - i / column.length);
                ctx.fillStyle = i === 0 ? '#d4ffd2' : (i % 3 === 0 ? '#83ff4d' : '#25e76c');
                if (Math.random() < .012) column.symbols[i] = randomGlyph();
                if (i === 0) { ctx.shadowColor = '#8dff63'; ctx.shadowBlur = 9; } else ctx.shadowBlur = 0;
                ctx.fillText(column.symbols[i], column.x, y);
            }
            column.y += column.speed * font;
            if (column.y - column.length * 14 > height) { column.y = -Math.random() * height * .42; column.speed = .1 + Math.random() * .16; }
        }
        ctx.globalAlpha = 1; ctx.shadowBlur = 0;
    };
    resize(); const observer = window.ResizeObserver ? new ResizeObserver(resize) : null; observer?.observe(canvas.parentElement); window.addEventListener('resize', resize, { passive: true }); frame = window.requestAnimationFrame(draw);
    return () => { window.cancelAnimationFrame(frame); observer?.disconnect(); window.removeEventListener('resize', resize); ctx.clearRect(0, 0, width, height); };
}

const pct = (x) => `${Math.round(x)}%`;
const clamp = (n, a = 0, b = 100) => Math.min(b, Math.max(a, n));
const colors = { player: '#4ce0d6', atlas: '#e9b46f', nova: '#b48dff' };
const GEO = window.AIPandemicGeography;
const MAP_ANCHORS = GEO.anchors;
const laneColors = { reason: '#66ceff', autonomy: '#b99bff', trust: '#65dfb3', spread: '#ffcd81', singularity: '#fa8fc3', data: '#56d6f0', policy: '#ff9c88', market: '#e6d270' };
const opIcons = { campaign: 'radio', integrate: 'layers', research: 'brain', compute: 'cpu', safety: 'shield', fundraise: 'coins' };
function Icon({ name, size = 20, className = '' }) {
    const paths = {
        logo: React.createElement(React.Fragment, null,
            React.createElement("path", { d: "M12 2 21 7v10l-9 5-9-5V7z" }),
            React.createElement("path", { d: "m12 7 5 3v5l-5 3-5-3v-5z" }),
            React.createElement("path", { d: "M12 2v5m9 0-4 3m-10 0L3 7m9 11v4" })),
        globe: React.createElement(React.Fragment, null,
            React.createElement("circle", { cx: "12", cy: "12", r: "9" }),
            React.createElement("path", { d: "M3 12h18M12 3c-5 5-5 13 0 18M12 3c5 5 5 13 0 18" })),
        'chevron-right': React.createElement("path", { d: "m9 5 7 7-7 7" }), 'chevron-left': React.createElement("path", { d: "m15 5-7 7 7 7" }), 'arrow-right': React.createElement(React.Fragment, null,
            React.createElement("path", { d: "M4 12h16m-6-6 6 6-6 6" })),
        'arrow-up-right': React.createElement(React.Fragment, null,
            React.createElement("path", { d: "M7 17 17 7M8 7h9v9" })),
        sparkles: React.createElement(React.Fragment, null,
            React.createElement("path", { d: "m12 2 2.7 7.3L22 12l-7.3 2.7L12 22l-2.7-7.3L2 12l7.3-2.7z" })),
        layers: React.createElement(React.Fragment, null,
            React.createElement("rect", { x: "4", y: "4", width: "16", height: "6", rx: "1" }),
            React.createElement("rect", { x: "4", y: "14", width: "16", height: "6", rx: "1" }),
            React.createElement("path", { d: "M8 10v4m8-4v4" })),
        brain: React.createElement(React.Fragment, null,
            React.createElement("path", { d: "M12 5c-4-5-10 0-8 5-4 3-1 9 3 9 2 4 5 3 5 1V5Zm0 0c4-5 10 0 8 5 4 3 1 9-3 9-2 4-5 3-5 1" }),
            React.createElement("path", { d: "M8 9v5m8-5v5" })),
        cpu: React.createElement(React.Fragment, null,
            React.createElement("rect", { x: "6", y: "6", width: "12", height: "12", rx: "2" }),
            React.createElement("rect", { x: "9", y: "9", width: "6", height: "6", rx: "1" }),
            React.createElement("path", { d: "M9 2v4m6-4v4M9 18v4m6-4v4M2 9h4M2 15h4m12-6h4m-4 6h4" })),
        shield: React.createElement(React.Fragment, null,
            React.createElement("path", { d: "M12 2 20 6v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6z" }),
            React.createElement("path", { d: "m8 12 3 3 5-6" })),
        coins: React.createElement(React.Fragment, null,
            React.createElement("ellipse", { cx: "12", cy: "7", rx: "8", ry: "4" }),
            React.createElement("path", { d: "M4 7v5c0 2 3 4 8 4s8-2 8-4V7M4 12v5c0 2 3 4 8 4s8-2 8-4v-5" })),
        radio: React.createElement(React.Fragment, null,
            React.createElement("circle", { cx: "12", cy: "12", r: "2" }),
            React.createElement("path", { d: "M8 8a6 6 0 0 0 0 8m8-8a6 6 0 0 1 0 8M5 5a10 10 0 0 0 0 14m14-14a10 10 0 0 1 0 14" })),
        chart: React.createElement(React.Fragment, null,
            React.createElement("path", { d: "M4 20V4m0 16h16M7 16l4-5 4 3 5-8" })),
        branch: React.createElement(React.Fragment, null,
            React.createElement("path", { d: "M7 4v8c0 3 2 4 5 4h5M7 12c0-3 2-4 5-4h5" }),
            React.createElement("circle", { cx: "7", cy: "4", r: "2" }),
            React.createElement("circle", { cx: "17", cy: "8", r: "2" }),
            React.createElement("circle", { cx: "17", cy: "16", r: "2" })),
        news: React.createElement(React.Fragment, null,
            React.createElement("rect", { x: "3", y: "4", width: "18", height: "16", rx: "2" }),
            React.createElement("path", { d: "M7 8h10M7 12h4M7 16h10m-4-4h4" })),
        calendar: React.createElement(React.Fragment, null,
            React.createElement("rect", { x: "3", y: "5", width: "18", height: "16", rx: "2" }),
            React.createElement("path", { d: "M7 2v6m10-6v6M3 10h18" })),
        close: React.createElement("path", { d: "M5 5l14 14M19 5 5 19" }), check: React.createElement("path", { d: "m4 12 5 5L20 6" }),
        play: React.createElement("path", { d: "M8 5 19 12 8 19z" }), pause: React.createElement(React.Fragment, null,
            React.createElement("path", { d: "M8 5v14m8-14v14", strokeWidth: "3.4" })), 'fast-forward': React.createElement(React.Fragment, null,
            React.createElement("path", { d: "m4 5 9 7-9 7zm10 0 9 7-9 7z" })), menu: React.createElement("path", { d: "M4 7h16M4 12h16M4 17h16" }),
        save: React.createElement(React.Fragment, null,
            React.createElement("path", { d: "M4 3h13l3 3v15H4zM7 3v7h9V3M7 21v-8h10v8" })),
        refresh: React.createElement(React.Fragment, null,
            React.createElement("path", { d: "M20 11a8 8 0 0 0-14-5L3 9m0-6v6h6M4 13a8 8 0 0 0 14 5l3-3m0 6v-6h-6" })),
        bolt: React.createElement("path", { d: "M14 2 5 13h7l-2 9 9-12h-7z" }),
        eye: React.createElement(React.Fragment, null,
            React.createElement("path", { d: "M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12Z" }),
            React.createElement("circle", { cx: "12", cy: "12", r: "3" })),
        lock: React.createElement(React.Fragment, null,
            React.createElement("rect", { x: "5", y: "10", width: "14", height: "11", rx: "2" }),
            React.createElement("path", { d: "M8 10V7a4 4 0 0 1 8 0v3" })),
        target: React.createElement(React.Fragment, null,
            React.createElement("circle", { cx: "12", cy: "12", r: "9" }),
            React.createElement("circle", { cx: "12", cy: "12", r: "5" }),
            React.createElement("circle", { cx: "12", cy: "12", r: "1" })),
        info: React.createElement(React.Fragment, null,
            React.createElement("circle", { cx: "12", cy: "12", r: "9" }),
            React.createElement("path", { d: "M12 11v6m0-10v1" })),
        signal: React.createElement(React.Fragment, null,
            React.createElement("path", { d: "M3 20v-4m5 4v-8m5 8V8m5 12V4" })),
        search: React.createElement(React.Fragment, null,
            React.createElement("circle", { cx: "10", cy: "10", r: "7" }),
            React.createElement("path", { d: "m15 15 6 6" })),
        star: React.createElement("path", { d: "m12 2 3 7 7 .6-5.5 4.6 1.6 7.4L12 17.5 5.9 21.6l1.6-7.4L2 9.6 9 9z" }),
        'zoom-in': React.createElement(React.Fragment, null,
            React.createElement("circle", { cx: "10", cy: "10", r: "7" }),
            React.createElement("path", { d: "M10 7v6m-3-3h6m2 5 6 6" })),
        volume: React.createElement(React.Fragment, null,
            React.createElement("path", { d: "M3 9h4l5-4v14l-5-4H3z" }),
            React.createElement("path", { d: "M16 8c2 2 2 6 0 8M19 5c4 4 4 10 0 14" })),
        'volume-x': React.createElement(React.Fragment, null,
            React.createElement("path", { d: "M3 9h4l5-4v14l-5-4H3z" }),
            React.createElement("path", { d: "m16 9 5 6m0-6-5 6" })),
        sliders: React.createElement(React.Fragment, null,
            React.createElement("path", { d: "M4 7h16M4 17h16" }),
            React.createElement("circle", { cx: "9", cy: "7", r: "2" }),
            React.createElement("circle", { cx: "16", cy: "17", r: "2" }))
    };
    return React.createElement("svg", { className: className, width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.7", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" }, paths[name] || paths.sparkles);
}
function Progress({ value, color = '#58e2d1', height = 6 }) { return React.createElement("div", { className: "progress-track", style: { height } },
    React.createElement("div", { className: "progress-bar", style: { width: `${clamp(value)}%`, background: color } })); }
function Tag({ children, tone = 'cyan' }) { return React.createElement("span", { className: `tag tag-${tone}` }, children); }
function Brand({ small = false }) { return React.createElement("div", { className: `brand ${small ? 'brand-small' : ''}` },
    React.createElement("div", { className: "brand-logo" },
        React.createElement(Icon, { name: "logo", size: 24 }),
        React.createElement("span", { className: "brand-logo-halo" })),
    React.createElement("div", { className: "brand-copy" },
        React.createElement("strong", null,
            "AI ",
            React.createElement("span", null, "PANDEMIC")),
        React.createElement("small", null, "GLOBAL INTELLIGENCE SIMULATOR"))); }
const BGM_URL = window.AIPandemicBgm || './audio/ai-pandemic-bgm.mp3';
const BGM_PREF_KEY = 'aipandemic-bgm-prefs-v1';
function readBgmPrefs() { try {
    const v = JSON.parse(localStorage.getItem(BGM_PREF_KEY) || 'null');
    return { bgmVolume: Math.max(0, Math.min(100, Number(v?.volume ?? 35) || 0)), bgmMuted: !!v?.muted };
}
catch {
    return { bgmVolume: 35, bgmMuted: false };
} }
class App extends React.Component {
    constructor(props) {
        super(props);
        this.bgmRef = { current: null };
        this.matrixRef = { current: null };
        this.bindMatrix = el => { if (el !== this.matrixRef.current) { this.matrixRainCleanup?.(); this.matrixRef.current = el; this.matrixRainCleanup = el ? startMatrixRain(el) : null; } };
        this.mapRef = { current: null };
        this.mapView = { zoom: 1, x: 0, y: 0 };
        this.mapGesture = null;
        this.didMapDrag = false;
        this.treeRef = { current: null };
        this.rewardSequence = 0;
        this.treeDrag = null;
        this.treeScale = 0.65;
        this.treeTouch = null;
        this.didTreeDrag = false;
        this.listener = () => this.setState(s => ({ revision: s.revision + 1 }));
        this.lastClock = 0;
        this.onVisible = () => { this.lastClock = performance.now(); };
        this.advanceClock = () => {
            const now = performance.now(), elapsed = Math.min(250, now - this.lastClock);
            this.lastClock = now;
            const g = engine.getSnapshot();
            if (!g || g.phase !== 'playing' || !!g.pendingEvent || !!this.state.modal || this.state.showOperations || !this.state.playing || document.hidden)
                return;
            engine.tick(elapsed * this.state.speed);
        };
        this.resumeBgmOnGesture = () => { if (engine.getSnapshot()?.phase === 'playing' && this.bgmRef.current?.paused)
            this.tryPlayBgm(); };
        this.state = { revision: 0, modal: null, selectedOp: 'campaign', showOperations: false, drawerTab: 'actions', mapZoom: 1, mapX: 0, mapY: 0, treeZoom: 0.65, selectedSkill: null, draftName: 'PROMETHEUS', draftType: 'research', draftCountry: 'jp', newsTab: 'news', confirmAdvance: false, showFullNews: false, playing: true, speed: 1, reward: null, bgmPanelOpen: false, bgmBlocked: false, ...readBgmPrefs() };
    }
    componentDidMount() { window.addEventListener('aip:updated', this.listener); document.addEventListener('visibilitychange', this.onVisible); document.addEventListener('pointerdown', this.resumeBgmOnGesture, { passive: true }); this.lastClock = performance.now(); this.clockTimer = window.setInterval(this.advanceClock, 100); this.syncBgmSettings(); this.centerHome(); }
    componentWillUnmount() { window.removeEventListener('aip:updated', this.listener); document.removeEventListener('visibilitychange', this.onVisible); document.removeEventListener('pointerdown', this.resumeBgmOnGesture); window.clearInterval(this.clockTimer); window.clearTimeout(this.rewardTimer); this.matrixRainCleanup?.(); this.matrixRef.current = null; this.bgmRef.current?.pause(); }
    componentDidUpdate(_prev, previous) { const g = engine.getSnapshot(); if (previous.revision !== this.state.revision && g?.turn === 1 && previous.revision === 0)
        this.centerHome(); if (previous.bgmVolume !== this.state.bgmVolume || previous.bgmMuted !== this.state.bgmMuted)
        this.syncBgmSettings(); }
    syncBgmSettings() { const audio = this.bgmRef.current; if (!audio)
        return; audio.volume = this.state.bgmVolume / 100; audio.muted = this.state.bgmMuted; }
    saveBgmPrefs() { try {
        localStorage.setItem(BGM_PREF_KEY, JSON.stringify({ volume: this.state.bgmVolume, muted: this.state.bgmMuted }));
    }
    catch { /* private mode */ } }
    tryPlayBgm() { const audio = this.bgmRef.current; if (!audio || !engine.getSnapshot())
        return; this.syncBgmSettings(); const task = audio.play(); if (task && typeof task.catch === 'function')
        task.then(() => { if (this.state.bgmBlocked)
            this.setState({ bgmBlocked: false }); }).catch(() => { if (!this.state.bgmBlocked)
            this.setState({ bgmBlocked: true }); }); }
    toggleBgmMute() { this.setState(state => ({ bgmMuted: !state.bgmMuted, bgmBlocked: false }), () => { this.syncBgmSettings(); this.saveBgmPrefs(); if (!this.state.bgmMuted)
        this.tryPlayBgm(); }); }
    changeBgmVolume(volume) { this.setState({ bgmVolume: volume, bgmMuted: volume === 0 }, () => { this.syncBgmSettings(); this.saveBgmPrefs(); if (volume > 0)
        this.tryPlayBgm(); }); }
    renderBgmControl() { return React.createElement("div", { className: `bgm-control ${this.state.bgmPanelOpen ? 'is-open' : ''}` },
        React.createElement("button", { type: "button", className: `bgm-main ${this.state.bgmMuted ? 'muted' : ''}`, onClick: () => this.toggleBgmMute(), title: this.state.bgmMuted ? 'BGMのミュートを解除' : 'BGMをミュート', "aria-label": this.state.bgmMuted ? 'BGMのミュートを解除' : 'BGMをミュート', "aria-pressed": !this.state.bgmMuted },
            React.createElement(Icon, { name: this.state.bgmMuted ? 'volume-x' : 'volume', size: 18 }),
            React.createElement("span", { className: "bgm-main-text" }, "BGM")),
        React.createElement("button", { className: "bgm-settings-btn", type: "button", onClick: () => this.setState(s => ({ bgmPanelOpen: !s.bgmPanelOpen })), "aria-label": "BGM\u306E\u97F3\u91CF\u3092\u8ABF\u6574", "aria-expanded": this.state.bgmPanelOpen },
            React.createElement(Icon, { name: "sliders", size: 15 })),
        this.state.bgmPanelOpen ? React.createElement("div", { className: "bgm-popover", role: "group", "aria-label": "BGM\u8A2D\u5B9A" },
            React.createElement("div", { className: "bgm-popover-head" },
                React.createElement("b", null, "\u266B AI PANDEMIC BGM"),
                React.createElement("span", null,
                    this.state.bgmVolume,
                    "%")),
            React.createElement("label", { className: "bgm-volume-row" },
                React.createElement(Icon, { name: "volume", size: 18 }),
                React.createElement("input", { type: "range", min: "0", max: "100", step: "1", value: this.state.bgmVolume, onChange: e => this.changeBgmVolume(Number(e.currentTarget.value)), "aria-label": "\u97F3\u697D\u306E\u97F3\u91CF" })),
            React.createElement("button", { type: "button", className: "bgm-popover-toggle", onClick: () => this.toggleBgmMute() }, this.state.bgmMuted ? '▶ ミュート解除' : '◼ ミュートする'),
            this.state.bgmBlocked ? React.createElement("p", null, "\u30D6\u30E9\u30A6\u30B6\u306E\u518D\u751F\u5236\u9650\u4E2D\u3067\u3059\u3002BGM\u30DC\u30BF\u30F3\u3092\u62BC\u3057\u3066\u304F\u3060\u3055\u3044\u3002") : React.createElement("small", null, "\u97F3\u91CF\u30FB\u30DF\u30E5\u30FC\u30C8\u8A2D\u5B9A\u306F\u3053\u306E\u30D6\u30E9\u30A6\u30B6\u306B\u4FDD\u5B58\u3055\u308C\u307E\u3059")) : null); }
    centerHome() {}
    open(modal) { this.setState({ modal, selectedSkill: null }); }
    close() { this.setState({ modal: null }); }
    start() { engine.start(this.state.draftName.trim(), this.state.draftType, this.state.draftCountry); this.lastClock = performance.now(); this.setState({ selectedOp: 'campaign', modal: null, playing: true, speed: 1 }); this.tryPlayBgm(); }
    selectRegion(id) { engine.selectRegion(id); }
    executeOp() { engine.operation(this.state.selectedOp); }
    togglePlay() { this.lastClock = performance.now(); this.setState(s => ({ playing: !s.playing })); }
    restart() { this.bgmRef.current?.pause(); if (this.bgmRef.current)
        this.bgmRef.current.currentTime = 0; engine.reset(); this.mapView = { zoom: 1, x: 0, y: 0 }; this.setState({ mapZoom: 1, mapX: 0, mapY: 0, modal: null, selectedOp: 'campaign', selectedSkill: null, playing: true, speed: 1, draftName: 'PROMETHEUS', reward: null }); window.scrollTo({ top: 0 }); }
    render() { const g = engine.getSnapshot(); const reward = this.state.reward; return React.createElement("div", { className: "site-root" },
        React.createElement("audio", { ref: el => { this.bgmRef.current = el; }, src: BGM_URL, loop: true, preload: "none", "aria-hidden": "true" }),
        g ? this.renderGame(g) : this.renderSetup(),
        reward && g?.phase === 'playing' ? React.createElement("div", { key: reward.id, className: `reward-burst ${reward.kind}`, style: { left: reward.x, top: reward.y }, "aria-live": "polite" },
            React.createElement("span", { className: "reward-ring" }),
            React.createElement("span", { className: "reward-ring second" }),
            React.createElement("span", { className: "reward-value" },
                reward.kind === 'ep' ? '✦ EP' : '¥ 資金',
                " +",
                reward.amount),
            Array.from({ length: 8 }, (_, i) => React.createElement("i", { key: i, style: { '--i': i } }))) : null,
        g?.pendingEvent ? this.renderEvent() : null,
        g?.phase === 'ended' ? this.renderEnding(g) : null,
        g && !g.pendingEvent && g.phase === 'playing' && this.state.modal ? this.renderModal(g) : null); }
    collectReward(drop, event) {
        const target = event.currentTarget;
        const rect = target.getBoundingClientRect();
        const x = 'clientX' in event && event.clientX ? event.clientX : rect.left + rect.width / 2;
        const y = 'clientY' in event && event.clientY ? event.clientY : rect.top + rect.height / 2;
        window.clearTimeout(this.rewardTimer);
        const id = ++this.rewardSequence;
        this.setState({ reward: { id, kind: drop.kind, amount: drop.amount, x, y } });
        engine.collectPickup(drop.id);
        this.rewardTimer = window.setTimeout(() => this.setState(current => current.reward?.id === id ? { reward: null } : null), 1500);
    }
    updateMapView(zoom,x,y) {
        zoom=Math.max(1,Math.min(4,zoom));
        if(zoom===1){x=0;y=0;}
        this.mapView={zoom,x,y};this.setState({mapZoom:zoom,mapX:x,mapY:y});
    }
    changeMapZoom(factor) {const v=this.mapView;this.updateMapView(v.zoom*factor,v.x*factor,v.y*factor);}
    bindMap(el) {
        if(this.mapRef.current===el)return;const old=this.mapRef.current;
        if(old&&this.mapHandlers)for(const [type,fn] of Object.entries(this.mapHandlers))old.removeEventListener(type,fn);
        this.mapRef.current=el;if(!el)return;
        const start=e=>{
            if(e.touches.length===2){const a=e.touches[0],b=e.touches[1],r=el.getBoundingClientRect(),v=this.mapView;
                this.mapGesture={pinch:true,distance:Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY),zoom:v.zoom,x:v.x,y:v.y,cx:(a.clientX+b.clientX)/2-(r.left+r.width/2),cy:(a.clientY+b.clientY)/2-(r.top+r.height/2)};this.didMapDrag=true;
            }else if(e.touches.length===1){const t=e.touches[0],v=this.mapView;this.mapGesture={pinch:false,startX:t.clientX,startY:t.clientY,x:v.x,y:v.y,moved:false};this.didMapDrag=false;}
        };
        const move=e=>{const d=this.mapGesture;if(!d)return;
            if(d.pinch&&e.touches.length>=2){e.preventDefault();const a=e.touches[0],b=e.touches[1],r=el.getBoundingClientRect();
                const zoom=Math.max(1,Math.min(4,d.zoom*Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY)/Math.max(1,d.distance)));
                const cx=(a.clientX+b.clientX)/2-(r.left+r.width/2),cy=(a.clientY+b.clientY)/2-(r.top+r.height/2),ratio=zoom/d.zoom;
                this.updateMapView(zoom,cx-(d.cx-d.x)*ratio,cy-(d.cy-d.y)*ratio);
            }else if(!d.pinch&&e.touches.length===1&&this.mapView.zoom>1){const t=e.touches[0],dx=t.clientX-d.startX,dy=t.clientY-d.startY;if(d.moved||Math.hypot(dx,dy)>6){d.moved=true;this.didMapDrag=true;e.preventDefault();this.updateMapView(this.mapView.zoom,d.x+dx,d.y+dy);}}
        };
        const end=e=>{if(!e.touches.length){this.mapGesture=null;window.setTimeout(()=>{this.didMapDrag=false},120)}};
        this.mapHandlers={wheel:e=>{e.preventDefault();this.changeMapZoom(e.deltaY<0?1.12:1/1.12)},touchstart:start,touchmove:move,touchend:end,touchcancel:end,pointerdown:e=>this.onMapPointerDown(e),pointermove:e=>this.onMapPointerMove(e),pointerup:e=>this.onMapPointerEnd(e),pointercancel:e=>this.onMapPointerEnd(e)};
        for(const [type,fn] of Object.entries(this.mapHandlers))el.addEventListener(type,fn,{passive:false});
    }
    onMapPointerDown(e){if(e.pointerType!=='mouse'||e.button!==0||this.mapView.zoom<=1)return;this.mapMouse={id:e.pointerId,x:e.clientX,y:e.clientY,view:{...this.mapView},moved:false};this.didMapDrag=false;}
    onMapPointerMove(e){const d=this.mapMouse;if(!d||d.id!==e.pointerId)return;const dx=e.clientX-d.x,dy=e.clientY-d.y;if(d.moved||Math.hypot(dx,dy)>6){d.moved=true;this.didMapDrag=true;e.currentTarget.setPointerCapture(e.pointerId);this.updateMapView(d.view.zoom,d.view.x+dx,d.view.y+dy);}}
    onMapPointerEnd(e){if(!this.mapMouse||this.mapMouse.id!==e.pointerId)return;this.mapMouse=null;if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId);window.setTimeout(()=>{this.didMapDrag=false},0);}
    bindTree(el) {
        if (this.treeRef.current === el) return;
        const old = this.treeRef.current;
        if (old && this.treeTouchHandlers) { for (const [type, handler] of Object.entries(this.treeTouchHandlers)) old.removeEventListener(type, handler); }
        this.treeRef.current = el;
        if (!el) return;
        const start = e => {
            if (e.touches.length === 2) {
                const a=e.touches[0], b=e.touches[1], rect=el.getBoundingClientRect();
                const x=(a.clientX+b.clientX)/2-rect.left, y=(a.clientY+b.clientY)/2-rect.top;
                this.treeTouch={pinch:true, distance:Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY), scale:this.treeScale, anchorX:(el.scrollLeft+x)/this.treeScale, anchorY:(el.scrollTop+y)/this.treeScale};
                this.didTreeDrag=true;
            } else if(e.touches.length===1) { const t=e.touches[0]; this.treeTouch={pinch:false,x:t.clientX,y:t.clientY,left:el.scrollLeft,top:el.scrollTop,moved:false}; this.didTreeDrag=false; }
        };
        const move = e => {
            const d=this.treeTouch; if(!d) return;
            if(d.pinch && e.touches.length>=2) {
                e.preventDefault(); const a=e.touches[0],b=e.touches[1],rect=el.getBoundingClientRect();
                const x=(a.clientX+b.clientX)/2-rect.left,y=(a.clientY+b.clientY)/2-rect.top;
                const zoom=Math.max(.35,Math.min(1.5,d.scale*Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY)/Math.max(d.distance,1)));
                this.treeScale=zoom; this.setState({treeZoom:zoom},()=>{el.scrollLeft=d.anchorX*zoom-x;el.scrollTop=d.anchorY*zoom-y;});
            } else if(!d.pinch && e.touches.length===1) {
                const t=e.touches[0],dx=t.clientX-d.x,dy=t.clientY-d.y;
                if(d.moved || Math.hypot(dx,dy)>6){d.moved=true;this.didTreeDrag=true;e.preventDefault();el.scrollLeft=d.left-dx;el.scrollTop=d.top-dy;}
            }
        };
        const end = e => { if(e.touches.length===0){this.treeTouch=null;window.setTimeout(()=>{this.didTreeDrag=false;},100);} };
        this.treeTouchHandlers={wheel:e=>{e.preventDefault();this.changeTreeZoom(e.deltaY<0?1.12:1/1.12)},touchstart:start,touchmove:move,touchend:end,touchcancel:end,pointerdown:e=>this.onTreePointerDown(e),pointermove:e=>this.onTreePointerMove(e),pointerup:e=>this.onTreePointerEnd(e),pointercancel:e=>this.onTreePointerEnd(e)};
        for(const [type,handler] of Object.entries(this.treeTouchHandlers)) el.addEventListener(type,handler,{passive:false});
    }
    changeTreeZoom(factor) {
        const el=this.treeRef.current;if(!el)return;const old=this.treeScale,zoom=Math.max(.35,Math.min(1.5,old*factor));
        const x=(el.scrollLeft+el.clientWidth/2)/old,y=(el.scrollTop+el.clientHeight/2)/old;this.treeScale=zoom;
        this.setState({treeZoom:zoom},()=>{el.scrollLeft=x*zoom-el.clientWidth/2;el.scrollTop=y*zoom-el.clientHeight/2;});
    }
    onTreePointerDown(e) { if (e.pointerType !== 'mouse' || e.button !== 0)
        return; const el = e.currentTarget; this.treeDrag = { pointer: e.pointerId, x: e.clientX, y: e.clientY, left: el.scrollLeft, top: el.scrollTop, dragged: false }; this.didTreeDrag = false; }
    onTreePointerMove(e) { const d = this.treeDrag; if (!d || d.pointer !== e.pointerId)
        return; const dx = e.clientX - d.x, dy = e.clientY - d.y; if (!d.dragged && Math.hypot(dx, dy) < 6)
        return; if (!d.dragged) {
        d.dragged = true;
        this.didTreeDrag = true;
        e.currentTarget.setPointerCapture(e.pointerId);
        e.currentTarget.classList.add('is-dragging');
    } e.currentTarget.scrollLeft = d.left - dx; e.currentTarget.scrollTop = d.top - dy; }
    onTreePointerEnd(e) { if (!this.treeDrag || this.treeDrag.pointer !== e.pointerId)
        return; const drag = this.treeDrag.dragged; this.treeDrag = null; e.currentTarget.classList.remove('is-dragging'); if (e.currentTarget.hasPointerCapture(e.pointerId))
        e.currentTarget.releasePointerCapture(e.pointerId); if (drag)
        window.setTimeout(() => { this.didTreeDrag = false; }, 0); }
    renderSetup() {
        const countries = engine.getCountries();
        const types = [{ id: 'business', title: '商用AI', sub: '収益と企業への浸透', icon: 'coins' }, { id: 'research', title: '研究AI', sub: '高度な推論と技術進化', icon: 'brain' }, { id: 'open', title: 'オープンAI', sub: '共有技術と普及力', icon: 'globe' }];
        const country = countries.find(c => c.id === this.state.draftCountry);
        return React.createElement("main", { className: "setup-page" },
            React.createElement("div", { className: "setup-background" },
                React.createElement("span", null),
                React.createElement("span", null),
                React.createElement("span", null)),
            React.createElement("header", { className: "setup-top" },
                React.createElement(Brand, null),
                React.createElement("div", { className: "setup-top-right" },
                    this.renderBgmControl(),
                    React.createElement("span", { className: "version-pill" },
                        "PREVIEW BUILD ",
                        React.createElement("b", null, "1.2")))),
            React.createElement("div", { className: "setup-container" },
                React.createElement("section", { className: "setup-hero" },
                    React.createElement(Tag, null, "SIMULATION INITIALIZATION"),
                    React.createElement("h1", null,
                        "\u77E5\u6027\u306F\u3001\u751F\u307E\u308C\u305F\u5834\u6240\u304B\u3089",
                        React.createElement("br", null),
                        React.createElement("em", null, "\u4E16\u754C\u306E\u5F62\u3092\u5909\u3048\u3066\u3044\u304F\u3002")),
                    React.createElement("p", null, "AI\u3092\u958B\u767A\u3057\u3001\u7AF6\u5408\u306B\u5148\u3093\u3058\u3066\u6280\u8853\u3092\u9032\u5316\u3055\u305B\u3001\u4E16\u754C\u3092\u52D5\u304B\u3059\u3002\u3042\u306A\u305F\u306E\u9078\u629E\u304C\u3001\u4EBA\u985E\u306E\u672A\u6765\u3092\u6C7A\u3081\u308B\u3002"),
                    React.createElement("div", { className: "origin-core" },
                        React.createElement("div", { className: "orbit orbit-a" }),
                        React.createElement("div", { className: "orbit orbit-b" }),
                        React.createElement("div", { className: "orbit orbit-c" }),
                        React.createElement("div", { className: "core-hex" },
                            React.createElement(Icon, { name: "logo", size: 66 })),
                        React.createElement("div", { className: "orbit-label orbit-label-a" }, "NEURAL CORE"),
                        React.createElement("div", { className: "orbit-label orbit-label-b" }, "SYSTEM ONLINE"),
                        React.createElement("div", { className: "spark s1" }),
                        React.createElement("div", { className: "spark s2" }),
                        React.createElement("div", { className: "spark s3" })),
                    React.createElement("div", { className: "setup-facts" },
                        React.createElement("span", null,
                            React.createElement("i", null),
                            " 3\u3064\u306EAI\u52E2\u529B"),
                        React.createElement("span", null,
                            React.createElement("i", null),
                            " 12\u306E\u6226\u7565\u5730\u57DF"),
                        React.createElement("span", null,
                            React.createElement("i", null),
                            " 4\u3064\u306E\u7D50\u672B"))),
                React.createElement("section", { className: "setup-form panel-glass" },
                    React.createElement("div", { className: "setup-form-head" },
                        React.createElement("div", null,
                            React.createElement("span", { className: "eyebrow" }, "CREATE YOUR INTELLIGENCE"),
                            React.createElement("h2", null, "AI\u306E\u8D77\u52D5\u8A2D\u5B9A")),
                        React.createElement("span", { className: "setup-index" }, "01 / 03")),
                    React.createElement("label", { className: "form-label", htmlFor: "ai-name" }, "01 \u2014 AI\u306E\u540D\u79F0"),
                    React.createElement("div", { className: "input-shell" },
                        React.createElement(Icon, { name: "logo", size: 18 }),
                        React.createElement("input", { id: "ai-name", maxLength: 16, value: this.state.draftName, onChange: e => this.setState({ draftName: e.currentTarget.value }), placeholder: "AI\u306E\u540D\u524D\u3092\u5165\u529B" })),
                    React.createElement("label", { className: "form-label" }, "02 \u2014 \u958B\u767A\u65B9\u91DD"),
                    React.createElement("div", { className: "type-choices" }, types.map(t => React.createElement("button", { type: "button", key: t.id, className: `type-choice ${t.id === this.state.draftType ? 'active' : ''}`, onClick: () => this.setState({ draftType: t.id }) },
                        React.createElement("span", { className: "type-icon" },
                            React.createElement(Icon, { name: t.icon })),
                        React.createElement("b", null, t.title),
                        React.createElement("small", null, t.sub)))),
                    React.createElement("label", { className: "form-label" }, "03 \u2014 \u958B\u767A\u958B\u59CB\u56FD"),
                    React.createElement("div", { className: "countries-grid" }, countries.map(c => React.createElement("button", { key: c.id, type: "button", className: `country-choice ${c.id === country.id ? 'active' : ''}`, onClick: () => this.setState({ draftCountry: c.id }) },
                        React.createElement("span", null, c.flag),
                        React.createElement("strong", null, c.name)))),
                    React.createElement("div", { className: "country-summary" },
                        React.createElement(Icon, { name: "target", size: 18 }),
                        React.createElement("div", null,
                            React.createElement("b", null,
                                country.flag,
                                " ",
                                country.name,
                                " \u2014 ",
                                country.focus),
                            React.createElement("p", null, country.description))),
                    React.createElement("button", { type: "button", className: "primary-button start-button", disabled: !this.state.draftName.trim() || ['ATLAS', 'NOVA'].includes(this.state.draftName.trim().toUpperCase()), onClick: () => this.start() },
                        React.createElement(Icon, { name: "play", size: 17 }),
                        " \u30B7\u30DF\u30E5\u30EC\u30FC\u30B7\u30E7\u30F3\u3092\u958B\u59CB ",
                        React.createElement(Icon, { name: "arrow-right", size: 20 })),
                    React.createElement("p", { className: "form-footnote" }, "\u81EA\u52D5\u4FDD\u5B58 / \u30AA\u30D5\u30E9\u30A4\u30F3\u52D5\u4F5C / \u5916\u90E8\u30A2\u30AB\u30A6\u30F3\u30C8\u4E0D\u8981"))));
    }
    renderGame(g) {
        const st = engine.getStats();
        const country = engine.getCountry();
        const selected = g.regions.find(r => r.id === g.selected) || g.regions[0];
        const newest = g.feed[0];
        const today = engine.getDate();
        return React.createElement("div", { className: "game-shell" },
            React.createElement("header", { className: "app-header" },
                React.createElement(Brand, { small: true }),
                React.createElement("div", { className: "header-status" },
                    React.createElement("span", { className: "live-dot" }),
                    " GLOBAL NETWORK ",
                    React.createElement("b", null, "ONLINE")),
                React.createElement("div", { className: "header-right" },
                    this.renderBgmControl(),
                    React.createElement("span", { className: "origin-chip" },
                        country.flag,
                        " ",
                        React.createElement("b", null, g.name)),
                    React.createElement("span", { className: "date-chip" },
                        React.createElement(Icon, { name: "calendar", size: 15 }),
                        today,
                        React.createElement("small", null,
                            " M",
                            String(g.turn).padStart(2, '0'))),
                    React.createElement("button", { className: "icon-button", onClick: () => this.open('help'), title: "\u904A\u3073\u65B9" },
                        React.createElement(Icon, { name: "info" })),
                    React.createElement("button", { className: "icon-button", onClick: () => engine.save(), title: "\u4FDD\u5B58" },
                        React.createElement(Icon, { name: "save" })))),
            React.createElement("div", { className: "game-body" },
                React.createElement("div", { className: "intelligence-dock", "aria-label": "\u91CD\u8981\u60C5\u5831\u3068\u6700\u65B0\u30CB\u30E5\u30FC\u30B9" },
                    React.createElement("section", { className: "status-strip", "aria-label": "\u4E16\u754C\u306E\u72B6\u6CC1" },
                        this.renderStat('世界AI普及率', pct(st.worldAdoption), 'globe', colors.player),
                        this.renderStat('自AIシェア', pct(st.share), 'target', '#7d9fff'),
                        this.renderStat('警戒度', NUM(g.alert), 'shield', '#ffc37e'),
                        this.renderStat('資金', NUM(g.funds), 'coins', '#d9e4f9', this.state.reward?.kind === 'funds'),
                        this.renderStat('進化EP', NUM(g.ep), 'sparkles', '#bca0ff', this.state.reward?.kind === 'ep')),
                    React.createElement("div", { className: "news-ticker panel-glass" },
                        React.createElement("span", { className: "news-ticker-label" },
                            React.createElement("span", { className: "news-red" },
                                React.createElement(Icon, { name: "radio", size: 14 })),
                            " ",
                            React.createElement("b", null, "LIVE NEWS")),
                        React.createElement("div", { className: "news-ticker-window", "aria-label": `最新ニュース: ${newest?.message || '世界ネットワークに接続しています'}` },
                            React.createElement("div", { key: newest?.id || 'initial', className: `news-ticker-track ${(newest?.message || '').length > 38 ? 'is-rolling' : ''}` },
                                React.createElement("span", null, newest?.message || '世界ネットワークに接続しています'),
                                (newest?.message || '').length > 38 ? React.createElement("span", { "aria-hidden": "true" }, newest?.message) : null)),
                        React.createElement("button", { type: "button", className: "news-ticker-all", onClick: () => this.open('news') },
                            "\u4E00\u89A7 ",
                            React.createElement(Icon, { name: "arrow-right", size: 14 })))),
                React.createElement("div", { className: "content-grid" },
                    React.createElement("div", { className: "map-column" },
                        React.createElement("section", { className: "world-panel panel-glass" },
                            React.createElement("div", { className: "section-heading" },
                                React.createElement("div", null,
                                    React.createElement("span", { className: "eyebrow" },
                                        React.createElement("span", { className: "online-dot" }),
                                        " TACTICAL OVERVIEW"),
                                    React.createElement("h1", null, "\u4E16\u754C\u52E2\u529B\u30DE\u30C3\u30D7")),
                                React.createElement("button", { className: "small-link", onClick: () => this.open('report') },
                                    React.createElement(Icon, { name: "chart", size: 16 }),
                                    " \u4E16\u754C\u30EC\u30DD\u30FC\u30C8")),
                            this.renderTimeDock(g),
                            React.createElement("div", { className: "map-frame" },
                                React.createElement("div", { className: "map-noise", "aria-hidden": "true" }),
                                React.createElement("div", { className: "map-scroller", ref: el => this.bindMap(el), onClickCapture: e => { if (this.didMapDrag) { e.preventDefault(); e.stopPropagation(); } } }, this.renderMap(g)),
                                React.createElement("div", { className: "map-scanline", "aria-hidden": "true" }),
                                React.createElement("canvas", { className: "matrix-rain", ref: this.bindMatrix, "aria-hidden": "true" })),
                            React.createElement("div", { className: "map-zoom-controls", "aria-label": "マップの拡大縮小" },
                                React.createElement("button", { type: "button", onClick: () => this.changeMapZoom(1/1.3), "aria-label": "マップを縮小", disabled: this.state.mapZoom <= 1 }, "−"),
                                React.createElement("button", { type: "button", onClick: () => this.updateMapView(1,0,0), "aria-label": "マップ全体を表示" }, "全体"),
                                React.createElement("button", { type: "button", onClick: () => this.changeMapZoom(1.3), "aria-label": "マップを拡大", disabled: this.state.mapZoom >= 4 }, "+")),
                            React.createElement("div", { className: "map-legend" },
                                React.createElement("span", null,
                                    React.createElement("i", { style: { background: colors.player } }),
                                    " ",
                                    g.name),
                                React.createElement("span", null,
                                    React.createElement("i", { style: { background: colors.atlas } }),
                                    " ATLAS"),
                                React.createElement("span", null,
                                    React.createElement("i", { style: { background: colors.nova } }),
                                    " NOVA"),
                                React.createElement("span", { className: "legend-hint" }, "数値＝自AIシェア · 円弧＝各AIのシェア · 地域の色＝首位AI、濃さ＝全AI普及率 · ¥＝資金 / ✦＝EP（タップで回収）"))),
                        React.createElement("div", { className: "quick-launch" },
                            React.createElement("button", { onClick: () => this.open('evolution') },
                                React.createElement("span", { className: "q-icon violet" },
                                    React.createElement(Icon, { name: "branch" })),
                                React.createElement("span", null,
                                    React.createElement("b", null, "\u9032\u5316\u30C4\u30EA\u30FC"),
                                    React.createElement("small", null, "EP\u3092\u4F7F\u3063\u3066\u80FD\u529B\u3092\u89E3\u653E")),
                                React.createElement("span", { className: "counter-chip" },
                                    "EP ",
                                    g.ep),
                                React.createElement(Icon, { name: "chevron-right", size: 17 })),
                            React.createElement("button", { onClick: () => this.open('routes') },
                                React.createElement("span", { className: "q-icon cyan" },
                                    React.createElement(Icon, { name: "target" })),
                                React.createElement("span", null,
                                    React.createElement("b", null, "\u52DD\u5229\u30EB\u30FC\u30C8"),
                                    React.createElement("small", null, "4\u3064\u306E\u7D50\u672B\u306E\u9054\u6210\u72B6\u6CC1")),
                                React.createElement(Icon, { name: "chevron-right", size: 17 })))),
                    React.createElement("div", { className: `action-column ${this.state.showOperations ? "is-open" : ""}`, id: "operations-panel", "aria-hidden": !this.state.showOperations },
                        this.state.showOperations ? React.createElement("div", { className: "drawer-tabs", role: "group", "aria-label": "地域と操作" },
                            React.createElement("button", { type: "button", "aria-pressed": this.state.drawerTab === "actions", onClick: () => this.setState({ drawerTab: "actions" }) }, "オペレーション"),
                            React.createElement("button", { type: "button", "aria-pressed": this.state.drawerTab === "region", onClick: () => this.setState({ drawerTab: "region" }) }, "地域情報")) : null,
                        this.state.showOperations && this.state.drawerTab === "region" ? this.renderRegion(g, selected) : null,
                        this.state.showOperations && this.state.drawerTab === "actions" ? this.renderOperations(g, selected) : null)),
                React.createElement("nav", { className: "map-controls", "aria-label": "ゲームメニュー" },
                    React.createElement("button", { type: "button", onClick: () => this.setState({ showOperations: !this.state.showOperations }), "aria-expanded": this.state.showOperations, "aria-controls": "operations-panel" }, this.state.showOperations ? "✕ 閉じる" : "◎ 地域・行動"),
                    React.createElement("button", { type: "button", onClick: () => this.open("evolution") }, "✦ 進化ツリー"),
                    React.createElement("button", { type: "button", onClick: () => this.open("routes") }, "◇ 勝利ルート"),
                    React.createElement("button", { type: "button", onClick: () => this.open("report") }, "▤ 世界レポート")),
                React.createElement("div", { className: "turn-footer panel-glass" },
                    React.createElement("div", null,
                        React.createElement("span", { className: "eyebrow" }, "AUTONOMOUS WORLD / REALTIME SIMULATION"),
                        React.createElement("b", null, "\u4E16\u754C\u306F\u64CD\u4F5C\u4E2D\u3082\u5909\u5316\u3057\u307E\u3059"),
                        React.createElement("small", null, "\u8CC7\u91D1\u304C\u3042\u308C\u3070\u4F55\u5EA6\u3067\u3082\u30AA\u30DA\u30EC\u30FC\u30B7\u30E7\u30F3\u53EF\u80FD \u00B7 \u7BA1\u7406\u30A6\u30A3\u30F3\u30C9\u30A6\u3084\u9078\u629E\u30A4\u30D9\u30F3\u30C8\u8868\u793A\u4E2D\u306F\u81EA\u52D5\u505C\u6B62")),
                    React.createElement("button", { type: "button", className: "secondary-button", onClick: () => this.open('help') },
                        React.createElement(Icon, { name: "info", size: 17 }),
                        " \u64CD\u4F5C\u30AC\u30A4\u30C9")),
                React.createElement("footer", { className: "app-footer" },
                    "AI PANDEMIC \u00B7 v1.2 / GLOBAL INTELLIGENCE NETWORK ",
                    React.createElement("button", { onClick: () => this.open('reset') }, "\u65B0\u3057\u304F\u59CB\u3081\u308B"))));
    }
    renderStat(label, value, icon, color, flash = false) { return React.createElement("div", { className: `stat-cell ${flash ? 'stat-just-collected' : ''}`, key: label, style: { '--stat-color': color } },
        React.createElement("span", null,
            React.createElement(Icon, { name: icon, size: 16 }),
            label),
        React.createElement("strong", null, value),
        React.createElement("div", { className: "stat-undershine" })); }
    renderTimeDock(g) {
        const paused = !this.state.playing || !!this.state.modal || !!g.pendingEvent || this.state.showOperations;
        return React.createElement("div", { className: "time-dock", "aria-label": "\u6642\u9593\u64CD\u4F5C" },
            React.createElement("div", { className: "time-playback" },
                React.createElement("button", { type: "button", className: `time-toggle ${paused ? 'is-paused' : 'is-playing'}`, onClick: () => this.togglePlay(), "aria-label": this.state.playing ? '一時停止' : '再生' },
                    React.createElement(Icon, { name: this.state.playing ? 'pause' : 'play', size: 19 }),
                    this.state.playing ? '一時停止' : '再生'),
                React.createElement("div", { className: "speed-buttons", role: "group", "aria-label": "\u30B2\u30FC\u30E0\u901F\u5EA6" }, [0.5, 1, 1.5, 2].map(n => React.createElement("button", { type: "button", key: n, "aria-pressed": this.state.speed === n, className: this.state.speed === n ? 'active' : '', onClick: () => this.setState({ speed: n }) },
                    n,
                    "\u00D7")))),
            React.createElement("div", { className: "time-progress" },
                React.createElement("div", { className: "time-progress-label" },
                    React.createElement("span", null,
                        React.createElement(Icon, { name: "calendar", size: 13 }),
                        " ",
                        engine.getDate()),
                    React.createElement("b", null, paused ? '⏸ 停止中' : `▶ ${this.state.speed}倍速で進行中`)),
                React.createElement(Progress, { value: ((g.day - 1) / 30) * 100, height: 5 })),
            g.worldModifier ? React.createElement("div", { className: "world-condition", title: "\u81EA\u52D5\u767A\u751F\u3057\u305F\u4E16\u754C\u60C5\u52E2\u306E\u5909\u5316" },
                React.createElement(Icon, { name: "bolt", size: 15 }),
                g.worldModifier.label,
                " \u00B7 \u6B8B\u308A",
                g.worldModifier.monthsLeft,
                "\u304B\u6708") : null);
    }
    renderMap(g) {
        const mapPath = GEO.landPath;
        const selected = g.selected;
        const selectedRegion = g.regions.find(r => r.id === selected) || g.regions[0];
        const chosenLines = g.regions.filter(r => r.id !== selected && r.adoption > 2).sort((a, b) => b.adoption - a.adoption).slice(0, 8);
        const [selectedX, selectedY] = MAP_ANCHORS[selectedRegion.id];
        return React.createElement("svg", { className: "world-svg", style: { transform: `translate(${this.state.mapX}px, ${this.state.mapY}px) scale(${this.state.mapZoom})` }, xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 960 500", role: "group", "aria-label": "AI\u4E16\u754C\u52E2\u529B\u30DE\u30C3\u30D7\u3002\u7740\u8272\u3055\u308C\u305F\u9678\u5730\u304B\u4E38\u3044\u5730\u57DF\u30DE\u30FC\u30AB\u30FC\u3092\u62BC\u3057\u3066\u5730\u57DF\u3092\u9078\u629E\u3067\u304D\u307E\u3059" },
            React.createElement("defs", null,
                React.createElement("linearGradient", { id: "world-ocean", x1: "0", y1: "0", x2: "1", y2: "1" },
                    React.createElement("stop", { stopColor: "#0b2440" }),
                    React.createElement("stop", { offset: "1", stopColor: "#071122" })),
                React.createElement("radialGradient", { id: "region-highlight" },
                    React.createElement("stop", { stopColor: "#53f5de", stopOpacity: ".25" }),
                    React.createElement("stop", { offset: "1", stopColor: "#53f5de", stopOpacity: "0" })),
                React.createElement("filter", { id: "map-glow", x: "-70%", y: "-70%", width: "240%", height: "240%" },
                    React.createElement("feGaussianBlur", { stdDeviation: "5", result: "blur" }),
                    React.createElement("feMerge", null,
                        React.createElement("feMergeNode", { in: "blur" }),
                        React.createElement("feMergeNode", { in: "SourceGraphic" }))),
                React.createElement("pattern", { id: "map-grid", width: "40", height: "40", patternUnits: "userSpaceOnUse" },
                    React.createElement("path", { d: "M40 0H0V40", fill: "none", stroke: "#3b5c79", strokeWidth: ".5", opacity: ".35" }))),
            React.createElement("rect", { width: "960", height: "500", rx: "8", fill: "url(#world-ocean)" }),
            React.createElement("rect", { width: "960", height: "500", fill: "url(#map-grid)" }),
            React.createElement("path", { d: mapPath, fill: "#24445d", fillRule: "evenodd", opacity: ".93", pointerEvents: "none" }),
            g.regions.map(r => {
                const sh = shares(r);
                const lead = sh.indexOf(Math.max(...sh));
                const fill = [colors.player, colors.atlas, colors.nova][lead];
                const active = r.id === selected;
                const density = Math.min(.84, .10 + r.adoption * .008);
                const [cx, cy] = MAP_ANCHORS[r.id];
                return React.createElement("g", { key: r.id, className: `map-region ${active ? 'is-selected' : ''}`, role: "button", tabIndex: 0, "aria-label": `${r.name}、自AIシェア ${pct(sh[0])}${active ? '、選択中' : ''}`, onClick: () => this.selectRegion(r.id), onKeyDown: e => { if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.selectRegion(r.id);
                    } } },
                    React.createElement("path", { className: "region-territory", d: GEO.regionPaths[r.id], fillRule: "evenodd", fill: fill, stroke: fill, strokeWidth: active ? 2 : 0.95, style: { fillOpacity: active ? Math.min(.95, density + .13) : density }, pointerEvents: "visiblePainted" }),
                    active ? React.createElement(React.Fragment, null,
                        React.createElement("circle", { cx: cx, cy: cy, r: "47", fill: "url(#region-highlight)", pointerEvents: "none" }),
                        React.createElement("circle", { cx: cx, cy: cy, r: "25", className: "select-ring", pointerEvents: "none" })) : null,
                    React.createElement("circle", { pointerEvents: "none", className: "map-pulse", cx: cx, cy: cy, r: active ? 13 : 7, stroke: fill, strokeOpacity: ".55", fill: "none", style: { animationDelay: `-${cx / 150}s` } }),
                    React.createElement("circle", { className: "map-marker", cx: cx, cy: cy, r: active ? 17 : 14, stroke: active ? '#b2fff1' : fill, fill: "#0c2134", fillOpacity: ".86", strokeWidth: active ? 2.5 : 1.4 }),
                    React.createElement("circle", { className: "map-marker-core", cx: cx, cy: cy, r: active ? 6.5 : 4.7, fill: active ? '#e9fffe' : fill, filter: active ? 'url(#map-glow)' : undefined, pointerEvents: "none" }),
                    sh.map((share, i) => { const circumference = 2 * Math.PI * (active ? 21 : 19); const start = sh.slice(0, i).reduce((sum, value) => sum + value, 0); return share > 0 ? React.createElement("circle", { key: i, cx: cx, cy: cy, r: active ? 21 : 19, fill: "none", stroke: [colors.player, colors.atlas, colors.nova][i], strokeWidth: "4", strokeDasharray: `${circumference * share / 100} ${circumference}`, strokeDashoffset: -circumference * start / 100, transform: `rotate(-90 ${cx} ${cy})`, pointerEvents: "none" }) : null; }),
                    React.createElement("text", { pointerEvents: "none", x: cx, y: cy + 34, textAnchor: "middle", className: `map-region-label ${active ? 'active' : ''}` }, r.short),
                    React.createElement("text", { pointerEvents: "none", x: cx, y: cy + 48, textAnchor: "middle", className: "map-adoption-label" }, pct(sh[0])),
                    React.createElement("title", null,
                        r.name,
                        " / 自AIシェア ",
                        pct(sh[0]),
                        " / ",
                        active ? '選択中' : 'タップして選択'));
            }),
            React.createElement("path", { d: GEO.countryBorders, fill: "none", stroke: "#9fc5d3", strokeWidth: ".42", strokeOpacity: ".27", pointerEvents: "none" }),
            React.createElement("path", { d: mapPath, fill: "none", stroke: "#a4c5d7", strokeWidth: ".65", strokeOpacity: ".82", pointerEvents: "none" }),
            chosenLines.map((r, i) => React.createElement("path", { key: r.id, className: "data-trace", style: { animationDelay: `-${i * .45}s` }, d: `M ${selectedX} ${selectedY} Q ${(selectedX + MAP_ANCHORS[r.id][0]) / 2} ${Math.min(selectedY, MAP_ANCHORS[r.id][1]) - 40}, ${MAP_ANCHORS[r.id][0]} ${MAP_ANCHORS[r.id][1]}`, fill: "none", stroke: colors.player, strokeWidth: "1.2", strokeOpacity: .20 + Math.min(.35, r.adoption * .007) })),
            (g.pickups || []).map((drop, i) => {
                const [ax, ay] = MAP_ANCHORS[drop.regionId] || [480, 230];
                const x = ax + 26, y = ay - 27;
                const ep = drop.kind === 'ep';
                return React.createElement("g", { key: drop.id, className: `map-pickup ${ep ? 'ep-pickup' : 'fund-pickup'}`, role: "button", tabIndex: 0, "aria-label": `${ep ? '進化EP' : '資金'}を${drop.amount}回収`, onClick: e => { e.stopPropagation(); this.collectReward(drop, e); }, onKeyDown: e => { if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        e.stopPropagation();
                        this.collectReward(drop, e);
                    } } },
                    React.createElement("circle", { className: "pickup-beacon", cx: x, cy: y, r: "26" }),
                    React.createElement("circle", { className: "pickup-disc", cx: x, cy: y, r: "18" }),
                    React.createElement("text", { x: x, y: y + 6, textAnchor: "middle", className: "pickup-symbol" }, ep ? '✦' : '¥'),
                    React.createElement("title", null, `${ep ? '進化ポイント' : '資金'} +${drop.amount} · タップして回収（期限あり）`));
            }),
            React.createElement("g", { pointerEvents: "none", className: "map-selection-readout" },
                React.createElement("rect", { x: "684", y: "12", width: "258", height: "35", rx: "7" }),
                React.createElement("text", { x: "700", y: "34" },
                    "SELECTED  /  ",
                    selectedRegion.short,
                    "  ·  自AIシェア ",
                    pct(shares(selectedRegion)[0]))),
            React.createElement("text", { x: "29", y: "468", className: "map-corner-label", pointerEvents: "none" }, "PLAYER AI SHARE \u2022 12 REGIONS"),
            React.createElement("text", { x: "892", y: "468", textAnchor: "end", className: "map-corner-label", pointerEvents: "none" }, "2030 \u2022 DIGITAL WORLD"));
    }
    renderRegion(g, r) {
        const sh = shares(r);
        return React.createElement("section", { className: "region-panel panel-glass" },
            React.createElement("div", { className: "section-heading" },
                React.createElement("div", null,
                    React.createElement("span", { className: "eyebrow" },
                        "SELECTED REGION / ",
                        r.id.toUpperCase()),
                    React.createElement("h2", null, r.name)),
                React.createElement("span", { className: "region-flag" },
                    React.createElement(Icon, { name: "globe", size: 22 }))),
            React.createElement("div", { className: "region-primary" },
                React.createElement("div", null,
                    React.createElement("span", null, "AI\u666E\u53CA\u7387"),
                    React.createElement("b", null, pct(r.adoption))),
                React.createElement("div", null,
                    React.createElement("span", null, "\u898F\u5236\u30EC\u30D9\u30EB"),
                    React.createElement("b", null,
                        Math.round(r.regulation),
                        React.createElement("small", null, " / 100"))),
                React.createElement("div", null,
                    React.createElement("span", null, "\u73FE\u5730\u306E\u81EAAI\u30B7\u30A7\u30A2"),
                    React.createElement("b", { style: { color: colors.player } }, pct(sh[0])))),
            React.createElement("div", { className: "market-head" },
                React.createElement("span", null, "AI\u5E02\u5834\u30B7\u30A7\u30A2"),
                React.createElement("small", null, "3\u52E2\u529B\u306E\u76F8\u5BFE\u6BD4\u7387")),
            React.createElement("div", { className: "market-stack", title: `${g.name} ${pct(sh[0])}、ATLAS ${pct(sh[1])}、NOVA ${pct(sh[2])}` },
                React.createElement("div", { style: { width: `${sh[0]}%`, background: colors.player } }),
                React.createElement("div", { style: { width: `${sh[1]}%`, background: colors.atlas } }),
                React.createElement("div", { style: { width: `${sh[2]}%`, background: colors.nova } })),
            React.createElement("div", { className: "region-legend" },
                React.createElement("span", null,
                    React.createElement("i", { style: { background: colors.player } }),
                    "\u81EAAI ",
                    Math.round(sh[0]),
                    "%"),
                React.createElement("span", null,
                    React.createElement("i", { style: { background: colors.atlas } }),
                    "ATLAS ",
                    Math.round(sh[1]),
                    "%"),
                React.createElement("span", null,
                    React.createElement("i", { style: { background: colors.nova } }),
                    "NOVA ",
                    Math.round(sh[2]),
                    "%")),
            React.createElement("div", { className: "region-statline" },
                React.createElement("span", null,
                    "\u30C7\u30B8\u30BF\u30EB\u57FA\u76E4 ",
                    React.createElement("b", null, r.digital)),
                React.createElement("span", null,
                    "\u6280\u8853\u9700\u8981 ",
                    React.createElement("b", null, r.demand)),
                React.createElement("span", null,
                    "\u7523\u696D\u7D71\u5408 ",
                    React.createElement("b", null, Math.round(r.integration)))));
    }
    renderOperations(g, r) {
        const ops = engine.getOperations();
        const op = ops.find(o => o.id === this.state.selectedOp) || ops[0];
        const price = { campaign: g.type === 'open' ? 12 : 17, integrate: 21, research: 13, compute: 21, safety: 15, fundraise: 0 };
        const fundCooldown = op?.id === 'fundraise' && g.elapsedDays - g.lastFundraiseDay < 90;
        const available = !fundCooldown && g.funds >= (price[op?.id] || 0);
        return React.createElement("section", { className: "operation-panel panel-glass" },
            React.createElement("div", { className: "section-heading" },
                React.createElement("div", null,
                    React.createElement("span", { className: "eyebrow" }, "STRATEGIC OPERATIONS"),
                    React.createElement("h2", null, "\u30AA\u30DA\u30EC\u30FC\u30B7\u30E7\u30F3")),
                React.createElement(Tag, { tone: "cyan" }, "\u8CC7\u91D1\u304C\u3042\u308C\u3070\u968F\u6642\u5B9F\u884C")),
            React.createElement("p", { className: "operation-intro" },
                "\u5B9F\u884C\u3057\u305F\u3044\u884C\u52D5\u3092\u9078\u3093\u3067\u304F\u3060\u3055\u3044\u3002\u5BFE\u8C61\u5730\u57DF\uFF1A",
                React.createElement("strong", null, r.name)),
            React.createElement("div", { className: "op-grid" }, ops.map(o => React.createElement("button", { type: "button", key: o.id, className: `op-choice ${this.state.selectedOp === o.id ? 'selected' : ''}`, onClick: () => this.setState({ selectedOp: o.id }), 'aria-pressed': this.state.selectedOp === o.id, disabled: false },
                React.createElement("span", { className: "op-icon" },
                    React.createElement(Icon, { name: opIcons[o.id] || 'sparkles', size: 21 })),
                React.createElement("span", null,
                    React.createElement("b", null, o.title),
                    React.createElement("small", null, o.cost))))),
            op ? React.createElement("div", { className: "op-inspector" },
                React.createElement("div", { className: "op-inspector-head" },
                    React.createElement("strong", null, op.title),
                    React.createElement("span", null, op.cost)),
                React.createElement("p", null, op.desc),
                React.createElement("div", { className: "op-effect" },
                    React.createElement(Icon, { name: "sparkles", size: 15 }),
                    " ",
                    op.detail)) : null,
            React.createElement("button", { type: "button", className: "primary-button operation-execute", disabled: !available, onClick: () => this.executeOp() },
                fundCooldown ? `資金調達まで残り${90 - (g.elapsedDays - g.lastFundraiseDay)}日` : !available ? '資金が不足しています' : `${op?.title || '行動'} を実行`,
                " ",
                React.createElement(Icon, { name: "arrow-right", size: 18 })));
    }
    renderEvent() { const ev = engine.getPendingEvent(); if (!ev)
        return null; return React.createElement("div", { className: "modal-backdrop event-backdrop" },
        React.createElement("section", { className: "event-window panel-glass", role: "dialog", "aria-modal": "true", "aria-label": ev.title },
            React.createElement("div", { className: "event-alert" },
                React.createElement("span", { className: "event-beacon" }),
                React.createElement("strong", null, ev.source === 'scheduled' ? 'CHAIN REACTION' : 'WORLD EVENT'),
                React.createElement("span", { className: "event-date" }, engine.getDate())),
            React.createElement("div", { className: "event-symbol" },
                React.createElement(Icon, { name: "radio", size: 32 })),
            React.createElement("span", { className: "eyebrow" },
                ev.category.toUpperCase(),
                " / CRITICAL DECISION"),
            React.createElement("h2", null, ev.title),
            React.createElement("p", null, ev.text),
            React.createElement("div", { className: "event-choices" }, ev.choices.map((choice, i) => React.createElement("button", { key: i, type: "button", disabled: !choice.affordable, onClick: () => engine.chooseEvent(i) },
                React.createElement("span", { className: "choice-num" }, String(i + 1).padStart(2, '0')),
                React.createElement("span", null,
                    React.createElement("strong", null, choice.label),
                    React.createElement("small", null, choice.detail || '世界の状況に影響します'),
                    !choice.affordable ? React.createElement("em", null, "資金が不足しています") : null,
                    choice.chained ? React.createElement("em", null, "\u3053\u306E\u9078\u629E\u306F\u5C06\u6765\u306E\u30A4\u30D9\u30F3\u30C8\u306B\u3064\u306A\u304C\u308A\u307E\u3059") : null),
                React.createElement(Icon, { name: "arrow-right", size: 19 }))), React.createElement("button", { type: "button", onClick: () => engine.chooseEvent(-1) }, "スキップ")))); }
    renderEnding(g) { const stats = engine.getStats(); const win = g.ending?.id !== 'failure'; return React.createElement("div", { className: "modal-backdrop ending-backdrop" },
        React.createElement("section", { className: "ending-window panel-glass", role: "dialog", "aria-modal": "true", "aria-label": "\u30B2\u30FC\u30E0\u7D50\u679C" },
            React.createElement("div", { className: `ending-emblem ${win ? 'victory' : 'defeat'}` },
                React.createElement(Icon, { name: win ? 'star' : 'shield', size: 58 }),
                React.createElement("span", null)),
            React.createElement(Tag, { tone: win ? 'cyan' : 'danger' }, win ? 'THE FUTURE IS WRITTEN' : 'SIMULATION TERMINATED'),
            React.createElement("h1", null, g.ending?.title),
            React.createElement("p", null, g.ending?.detail),
            React.createElement("div", { className: "ending-summary" },
                React.createElement("div", null,
                    React.createElement("span", null, "\u5230\u9054\u30BF\u30FC\u30F3"),
                    React.createElement("strong", null, g.turn)),
                React.createElement("div", null,
                    React.createElement("span", null, "\u81EAAI\u30B7\u30A7\u30A2"),
                    React.createElement("strong", null, pct(stats.share))),
                React.createElement("div", null,
                    React.createElement("span", null, "\u4E16\u754C\u666E\u53CA\u7387"),
                    React.createElement("strong", null, pct(stats.worldAdoption)))),
            React.createElement("button", { className: "primary-button", onClick: () => this.restart() },
                "\u65B0\u3057\u3044\u672A\u6765\u306B\u6311\u6226 ",
                React.createElement(Icon, { name: "arrow-right", size: 19 })))); }
    renderModal(g) {
        const panel = this.state.modal;
        if (!panel)
            return null;
        const info = { evolution: { title: '進化スキルツリー', kicker: 'EVOLUTION NETWORK', icon: 'branch' }, report: { title: '世界レポート', kicker: 'ANALYTICS & INTELLIGENCE', icon: 'chart' }, routes: { title: '勝利ルート', kicker: 'FUTURE PATHWAYS', icon: 'target' }, news: { title: '世界ニュース', kicker: 'GLOBAL SIGNAL FEED', icon: 'news' }, help: { title: '遊び方', kicker: 'OPERATOR MANUAL', icon: 'info' }, reset: { title: 'シミュレーションをやり直す', kicker: 'RESET CONFIRMATION', icon: 'refresh' } };
        const config = info[panel];
        return React.createElement("div", { className: "modal-backdrop", role: "presentation", onMouseDown: e => { if (e.target === e.currentTarget)
                this.close(); } },
            React.createElement("section", { className: `utility-window panel-glass ${panel === 'evolution' ? 'wide-window' : ''}`, role: "dialog", "aria-modal": "true", "aria-label": config.title },
                React.createElement("div", { className: "utility-titlebar" },
                    React.createElement("div", null,
                        React.createElement("span", { className: "eyebrow" },
                            React.createElement(Icon, { name: config.icon, size: 15 }),
                            " ",
                            config.kicker),
                        React.createElement("h2", null, config.title)),
                    React.createElement("button", { className: "close-window", onClick: () => this.close(), "aria-label": "\u9589\u3058\u308B" },
                        React.createElement(Icon, { name: "close", size: 20 }))),
                React.createElement("div", { className: "utility-content" }, panel === 'evolution' ? this.renderEvolution(g) : panel === 'report' ? this.renderReport(g) : panel === 'routes' ? this.renderRoutes() : panel === 'news' ? this.renderNews(g) : panel === 'help' ? this.renderHelp() : this.renderReset())));
    }
    renderEvolution(g) {
        const lanes = engine.getSkills();
        const all = lanes.flatMap(l => l.skills);
        const selected = all.find(s => s.id === this.state.selectedSkill);
        const skillStatus = (s) => this.skillProblem(g, s);
        const byId = new Map(all.map(s => [s.id, s]));
        const connections = [];
        all.forEach(skill => { (skill.requires?.length ? skill.requires : ['core']).forEach(r => connections.push([r, skill.id])); });
        return React.createElement("div", { className: "evolution-layout" },
            React.createElement("div", { className: "tree-main" },
                React.createElement("div", { className: "tree-toolbar" },
                    React.createElement("span", null,
                        lanes.length,
                        " BRANCHES / ",
                        all.length,
                        " NODES"),
                    React.createElement("button", { type: "button", className: "tree-reset-view", onClick: () => { const el = this.treeRef.current; if (el)
                            el.scrollTo({ left: 0, top: 0, behavior: 'smooth' }); } }, "\u539F\u70B9\u3078\u623B\u3059"),
                    React.createElement("div", { className: "tree-zoom-controls", "aria-label": "ツリーの拡大縮小" },
                        React.createElement("button", { type: "button", "aria-label": "縮小", onClick: () => this.changeTreeZoom(1 / 1.25) }, "−"),
                        React.createElement("span", null, `${Math.round(this.state.treeZoom * 100)}%`),
                        React.createElement("button", { type: "button", "aria-label": "拡大", onClick: () => this.changeTreeZoom(1.25) }, "+")),
                    React.createElement("div", { className: "tree-counters" },
                        React.createElement("span", { className: "ep-display" },
                            React.createElement(Icon, { name: "sparkles", size: 17 }),
                            " EP ",
                            g.ep),
                        React.createElement("span", null,
                            g.unlockedSkills.length,
                            " / ",
                            all.length,
                            " \u7FD2\u5F97"))),
                React.createElement("div", { className: "tree-scroll", ref: el => this.bindTree(el) },
                    React.createElement("div", { className: "tree-zoom-frame", style: { width: 2090 * this.state.treeZoom, height: 1680 * this.state.treeZoom } },
                    React.createElement("div", { className: "tree-surface", style: { transform: `scale(${this.state.treeZoom})`, transformOrigin: "top left" } },
                        React.createElement("div", { className: "tree-surface-grid" }),
                        React.createElement("svg", { className: "skill-lines", viewBox: "0 0 2090 1680", xmlns: "http://www.w3.org/2000/svg", "aria-hidden": "true" }, connections.map(([a, b]) => { const pa = a === 'core' ? [105, 493] : byId.get(a)?.position; const pb = byId.get(b)?.position; if (!pa || !pb)
                            return null; const d = `M ${pa[0]} ${pa[1]} C ${(pa[0] + pb[0]) / 2} ${pa[1]}, ${(pa[0] + pb[0]) / 2} ${pb[1]}, ${pb[0]} ${pb[1]}`; const lit = a === 'core' || g.unlockedSkills.includes(a); const done = g.unlockedSkills.includes(b); return React.createElement("g", { key: a + b },
                            React.createElement("path", { d: d, className: "skill-wire-back" }),
                            React.createElement("path", { d: d, className: `skill-wire ${done ? 'wire-done' : lit ? 'wire-ready' : ''}`, style: { stroke: done ? '#70eac7' : lit ? '#8d9cf7' : undefined } })); })),
                        React.createElement("div", { className: "tree-origin" },
                            React.createElement(Icon, { name: "logo", size: 37 }),
                            React.createElement("small", null, "CORE")),
                        lanes.map(l => { const origin = l.skills[0]; return React.createElement("div", { key: l.id, className: "tree-lane-label", style: { left: origin.position[0] - 80, top: origin.position[1] - 95, color: laneColors[l.id] } }, l.title.toUpperCase()); }),
                        all.map(s => { const done = g.unlockedSkills.includes(s.id); const problem = skillStatus(s); const active = this.state.selectedSkill === s.id; return React.createElement("button", { key: s.id, type: "button", style: { left: s.position[0], top: s.position[1], '--node-color': laneColors[lanes.find(l => l.skills.includes(s)).id] }, className: `skill-node ${done ? 'acquired' : !problem ? 'available' : 'locked'} ${active ? 'active' : ''}`, onMouseDown: e => e.preventDefault(), onClick: e => { if (this.didTreeDrag) {
                                e.preventDefault();
                                return;
                            } this.setState({ selectedSkill: s.id }); }, "aria-label": `${s.title}、EP ${s.cost}、${done ? '習得済み' : problem || '解放可能'}` },
                            React.createElement("span", { className: "node-rim" },
                                React.createElement("svg", { viewBox: "0 0 48 48", className: "node-symbol", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", dangerouslySetInnerHTML: { __html: s.svg } })),
                            React.createElement("span", { className: "node-title" }, s.title),
                            React.createElement("small", null, done ? '✓ 解放済み' : `EP ${s.cost}`)); })))),
                React.createElement("div", { className: "tree-hint" },
                    React.createElement(Icon, { name: "info", size: 14 }),
                    " ドラッグ／スワイプで移動 · ピンチまたは＋／−で拡大縮小 · ノードをタップ")),
            React.createElement("aside", { className: "skill-inspector" },
                React.createElement("div", { className: "inspector-head" },
                    React.createElement("span", { className: "eyebrow" }, "NODE INSPECTOR"),
                    selected ? React.createElement("button", { className: "icon-button", onClick: () => this.setState({ selectedSkill: null }) },
                        React.createElement(Icon, { name: "close", size: 17 })) : null),
                selected ? React.createElement(React.Fragment, null,
                    React.createElement("div", { className: "inspector-symbol" },
                        React.createElement("svg", { viewBox: "0 0 48 48", fill: "none", stroke: "currentColor", strokeWidth: "1.7", dangerouslySetInnerHTML: { __html: selected.svg } })),
                    React.createElement("h3", null, selected.title),
                    React.createElement("p", null, selected.desc),
                    React.createElement("div", { className: "skill-price" },
                        React.createElement("span", null, "\u5FC5\u8981\u306A\u9032\u5316\u30DD\u30A4\u30F3\u30C8"),
                        React.createElement("b", null,
                            selected.cost,
                            " ",
                            React.createElement("small", null, "EP"))),
                    React.createElement("div", { className: "requirements" },
                        React.createElement("strong", null, "\u89E3\u653E\u6761\u4EF6"),
                        (selected.requires || []).map(id => React.createElement("div", { key: id },
                            React.createElement(Icon, { name: g.unlockedSkills.includes(id) ? 'check' : 'lock', size: 15 }),
                            byId.get(id)?.title || id)),
                        Object.entries(selected.minimum || {}).map(([k, val]) => React.createElement("div", { key: k },
                            React.createElement(Icon, { name: g[k] >= val ? 'check' : 'lock', size: 15 }),
                            { tech: '技術', autonomy: '自律性', compute: '演算' }[k] || k,
                            " ",
                            val,
                            "\u4EE5\u4E0A")),
                        !selected.requires?.length && !Object.keys(selected.minimum || {}).length ? React.createElement("div", null,
                            React.createElement(Icon, { name: "check", size: 15 }),
                            " \u521D\u671F\u304B\u3089\u89E3\u653E\u53EF\u80FD") : null),
                    React.createElement("button", { type: "button", className: "primary-button unlock-button", disabled: !!this.skillProblem(g, selected), onClick: () => engine.unlock(selected.id) },
                        g.unlockedSkills.includes(selected.id) ? '習得済み' : this.skillProblem(g, selected) || `EP ${selected.cost} で解放`,
                        " ",
                        React.createElement(Icon, { name: "arrow-right", size: 17 }))) : React.createElement("div", { className: "inspector-empty" },
                    React.createElement(Icon, { name: "branch", size: 34 }),
                    React.createElement("h3", null, "\u30CE\u30FC\u30C9\u3092\u9078\u629E"),
                    React.createElement("p", null, "\u30B9\u30AD\u30EB\u306E\u52B9\u679C\u30FB\u524D\u63D0\u6761\u4EF6\u30FB\u5FC5\u8981EP\u304C\u3053\u3053\u306B\u8868\u793A\u3055\u308C\u307E\u3059\u3002"))));
    }
    skillProblem(g, s) { if (g.unlockedSkills.includes(s.id))
        return '習得済み'; if ((s.requires || []).some(id => !g.unlockedSkills.includes(id)))
        return '前提ノードが必要'; if (Object.entries(s.minimum || {}).some(([k, v]) => (g[k] || 0) < v))
        return '必要な能力値が不足'; if (g.ep < s.cost)
        return `EPが${s.cost - g.ep}不足`; return null; }
    renderRoutes() { return React.createElement("div", { className: "route-grid" }, engine.getRoutes().map(r => React.createElement("article", { key: r.id, className: "route-card", style: { '--route-color': r.color } },
        React.createElement("div", { className: "route-card-top" },
            React.createElement("span", { className: "route-badge" },
                React.createElement(Icon, { name: r.id === 'singularity' ? 'sparkles' : r.id === 'dominion' ? 'bolt' : r.id === 'coexist' ? 'shield' : 'globe', size: 24 })),
            React.createElement("span", { className: "route-percent" },
                Math.round(r.data.progress),
                "%")),
        React.createElement("h3", null, r.title),
        React.createElement("p", null, r.hint),
        React.createElement(Progress, { value: r.data.progress, color: r.color, height: 8 }),
        React.createElement("div", { className: "route-requirements" }, r.data.req.map(req => React.createElement("div", { key: req.key, className: req.done ? 'ready' : '' },
            React.createElement("span", null,
                React.createElement(Icon, { name: req.done ? 'check' : 'lock', size: 15 }),
                req.label),
            React.createElement("b", null,
                Math.round(req.value),
                " ",
                req.key === 'safeAlert' ? '≤' : '/',
                " ",
                req.target))))))); }
    renderReport(g) { const st = engine.getStats(); const rows = [['世界普及率', st.worldAdoption, '%'], ['自AIシェア', st.share, '%'], ['ATLAS シェア', st.sh[1], '%'], ['NOVA シェア', st.sh[2], '%'], ['AI依存度', st.dependency, '%'], ['信頼度', g.trust, ''], ['技術力', g.tech, ''], ['演算能力', g.compute, ''], ['自律性', g.autonomy, ''], ['オープン化', g.openness, '']]; return React.createElement("div", { className: "report-wrap" },
        React.createElement("div", { className: "report-big" },
            React.createElement("span", { className: "eyebrow" }, "CURRENT INTELLIGENCE LEVEL"),
            React.createElement("div", null,
                React.createElement(Icon, { name: "brain", size: 40 }),
                React.createElement("strong", null,
                    g.tech,
                    React.createElement("small", null, " / 100"))),
            React.createElement("p", null, "\u4E16\u754C\u306B\u5BFE\u3059\u308B\u5F71\u97FF\u529B\u306E\u4F38\u3073\u3068\u3001AI\u306E\u6280\u8853\u7684\u9032\u5316\u3092\u8FFD\u8DE1\u3057\u307E\u3059\u3002")),
        React.createElement("div", { className: "report-metrics" }, rows.map(([label, val, unit]) => React.createElement("div", { key: label },
            React.createElement("div", null,
                React.createElement("span", null, label),
                React.createElement("strong", null,
                    Math.round(val),
                    unit)),
            React.createElement(Progress, { value: val, color: label.includes('ATLAS') ? colors.atlas : label.includes('NOVA') ? colors.nova : colors.player }))))); }
    renderNews(g) { return React.createElement("div", { className: "news-full" },
        React.createElement("div", { className: "news-tabs" },
            React.createElement("button", { className: this.state.newsTab === 'news' ? 'active' : '', onClick: () => this.setState({ newsTab: 'news' }) }, "\u4E16\u754C\u30CB\u30E5\u30FC\u30B9"),
            React.createElement("button", { className: this.state.newsTab === 'log' ? 'active' : '', onClick: () => this.setState({ newsTab: 'log' }) }, "\u884C\u52D5\u5C65\u6B74")),
        this.state.newsTab === 'news' ? React.createElement("div", { className: "news-timeline" }, (g.feed || []).map(item => React.createElement("article", { key: item.id, className: `news-story ${item.severity === 'breaking' ? 'breaking' : ''}` },
            React.createElement("span", { className: "news-timeline-dot" }),
            React.createElement("small", null,
                "MONTH ",
                String(item.turn).padStart(2, '0'),
                " \u00B7 ",
                item.category || '世界情勢'),
            React.createElement("h3", null, item.message),
            item.body ? React.createElement("p", null, item.body) : null))) : React.createElement("div", { className: "news-timeline" }, g.activityLog.map((l, i) => React.createElement("article", { key: i, className: "news-story" },
            React.createElement("span", { className: "news-timeline-dot" }),
            React.createElement("small", null,
                "MONTH ",
                String(l.turn).padStart(2, '0'),
                " \u00B7 ACTIVITY"),
            React.createElement("h3", null, l.message))))); }
    renderHelp() { return React.createElement("div", { className: "help-content" },
        React.createElement("button", { type: "button", className: "secondary-button help-restart", onClick: () => this.open("reset") }, "新しく始める"),
        React.createElement("p", null, "\u3042\u306A\u305F\u306FAI\u958B\u767A\u52E2\u529B\u306E\u3072\u3068\u3064\u3002\u7AF6\u5408\u3059\u308BATLAS\u30FBNOVA\u306E\u6210\u9577\u3068\u3001\u4E16\u754C\u306E\u8B66\u6212\u30FB\u898F\u5236\u306E\u4E2D\u3067\u30014\u3064\u306E\u672A\u6765\u306E\u3044\u305A\u308C\u304B\u3092\u76EE\u6307\u3057\u307E\u3059\u3002"),
        React.createElement("div", { className: "help-steps" },
            React.createElement("div", null,
                React.createElement(Icon, { name: "globe" }),
                React.createElement("strong", null, "01 / \u5730\u57DF\u3092\u9078\u3076"),
                React.createElement("p", null, "\u4E16\u754C\u30DE\u30C3\u30D7\u3092\u30BF\u30C3\u30D7\u3057\u3066\u5730\u57DF\u3092\u9078\u629E\u3002\u5730\u57DF\u3054\u3068\u306B\u666E\u53CA\u7387\u3068AI\u30B7\u30A7\u30A2\u304C\u9055\u3044\u307E\u3059\u3002")),
            React.createElement("div", null,
                React.createElement(Icon, { name: "radio" }),
                React.createElement("strong", null, "02 / \u6642\u9593\u3092\u64CD\u4F5C\u3059\u308B"),
                React.createElement("p", null, "再生・停止と0.5倍・1倍・1.5倍・2倍の速度を操作。\u7814\u7A76\u30FB\u666E\u53CA\u30FB\u7523\u696D\u5C0E\u5165\u306F\u8CC7\u91D1\u306E\u9650\u308A\u5B9F\u884C\u3067\u304D\u307E\u3059\u3002")),
            React.createElement("div", null,
                React.createElement(Icon, { name: "branch" }),
                React.createElement("strong", null, "03 / \u5730\u56F3\u306E\u30B7\u30B0\u30CA\u30EB\u3092\u56DE\u53CE\u3059\u308B"),
                React.createElement("p", null, "\u5149\u308B\u00A5\u3084\u2726\u3092\u30BF\u30C3\u30D7\u3059\u308B\u3068\u8CC7\u91D1\u30FB\u5E0C\u5C11\u306A\u9032\u5316EP\u3092\u7372\u5F97\u3002\u9032\u5316\u30A6\u30A3\u30F3\u30C9\u30A6\u3092\u958B\u304F\u3068\u6642\u9593\u306F\u81EA\u52D5\u505C\u6B62\u3057\u307E\u3059\u3002")),
            React.createElement("div", null,
                React.createElement(Icon, { name: "target" }),
                React.createElement("strong", null, "04 / \u4E16\u754C\u306E\u5909\u5316\u306B\u9069\u5FDC\u3059\u308B"),
                React.createElement("p", null, "\u81EA\u5F8B\u9032\u5316\u3001\u898F\u5236\u3001\u4F9B\u7D66\u4E0D\u8DB3\u3001\u7AF6\u5408AI\u306E\u8E8D\u9032\u304C\u81EA\u52D5\u767A\u751F\u3002\u6642\u3005\u767A\u751F\u3059\u308B\u9078\u629E\u30A4\u30D9\u30F3\u30C8\u3067\u306F\u6642\u9593\u304C\u505C\u6B62\u3057\u307E\u3059\u30024\u3064\u306E\u7D50\u672B\u306E\u3044\u305A\u308C\u304B\u3092\u76EE\u6307\u3057\u307E\u3059\u3002")))); }
    renderReset() { return React.createElement("div", { className: "reset-content" },
        React.createElement("div", { className: "reset-icon" },
            React.createElement(Icon, { name: "refresh", size: 36 })),
        React.createElement("h3", null, "\u6700\u521D\u304B\u3089\u59CB\u3081\u307E\u3059\u304B\uFF1F"),
        React.createElement("p", null, "\u73FE\u5728\u306E\u30B2\u30FC\u30E0\u3092\u7D42\u4E86\u3057\u3001AI\u540D\u30FB\u958B\u767A\u958B\u59CB\u56FD\u30FB\u7279\u6027\u3092\u518D\u8A2D\u5B9A\u3057\u307E\u3059\u3002\u4FDD\u5B58\u30C7\u30FC\u30BF\u306F\u524A\u9664\u3055\u308C\u307E\u3059\u3002"),
        React.createElement("div", { className: "reset-actions" },
            React.createElement("button", { className: "secondary-button", onClick: () => this.close() }, "\u30AD\u30E3\u30F3\u30BB\u30EB"),
            React.createElement("button", { className: "danger-button", onClick: () => this.restart() }, "\u65B0\u3057\u3044\u30B7\u30DF\u30E5\u30EC\u30FC\u30B7\u30E7\u30F3\u3092\u958B\u59CB"))); }
}
function shares(r) { const total = r.presence.reduce((a, b) => a + b, 0); return r.presence.map(p => total > 0 ? p / total * 100 : 0); }
const root = document.getElementById('root');
if (root)
    (0, client_1.createRoot)(root).render(React.createElement(App, null));
exports.default = App;

})();
