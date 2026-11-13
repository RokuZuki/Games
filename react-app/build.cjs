const fs = require('node:fs');
const path = require('node:path');
const read = p => fs.readFileSync(path.join(__dirname,p),'utf8');
let html = read('template.html').replace('%%STYLE%%', () => read('src/style.css'));
const files = {0:'vendor/react.js',1:'vendor/react-dom.js',2:'public/region-geography.js',3:'public/legacy-data.js',4:'public/legacy-events.js',5:'public/legacy-core.js',6:null,20:'src/game-ui.js'};
for (const [index,file] of Object.entries(files)) html = html.replace('%%SCRIPT_'+index+'%%', () => file ? read(file) : "window.AIPandemicBgm='data:audio/mpeg;base64,';");
if (/%%(?:SCRIPT_\d+|STYLE)%%/.test(html)) throw new Error('Missing build input');
fs.writeFileSync(path.join(__dirname,'..','index.html'),html);
console.log('Built ../index.html');
