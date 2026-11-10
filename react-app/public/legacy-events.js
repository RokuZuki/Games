
/** AI PANDEMIC v0.4 - deterministic condition/event/news engine; independent from the DOM. */
window.AIP_EVENT_ENGINE = (() => {
  'use strict';
  const clamp=(v,min=0,max=100)=>Math.max(min,Math.min(max,v));
  const makeRuntime=(seed=0x7ac209)=>({seed:seed>>>0||0x7ac209,history:[],lastTriggered:{},scheduled:[],flags:{},newsSeen:{},newsLast:{},nextNewsId:1});
  function random(rt){let x=rt.seed>>>0||0x7ac209;x^=x<<13;x^=x>>>17;x^=x<<5;rt.seed=x>>>0;return (rt.seed>>>0)/4294967296;}
  function getMetric(key,state,stats){
    if(key==='turn')return state.turn;
    if(key==='player.country')return state.countryId||null;
    const direct={'world.alert':state.alert,'world.adoption':stats.worldAdoption,'world.share':stats.share,'world.dependency':stats.dependency,'rival.atlas':stats.sh[1],'rival.nova':stats.sh[2]};
    if(Object.prototype.hasOwnProperty.call(direct,key))return direct[key];
    if(key.startsWith('player.')){const field=key.slice(7);const allowed=['funds','tech','trust','ep','compute','autonomy','openness','infra','publications','project'];return allowed.includes(field)?state[field]:undefined;}
    if(key.startsWith('flag.'))return Boolean(state.eventRuntime?.flags[key.slice(5)]);
    return undefined;
  }
  function conditionMet(c,state,stats){const actual=getMetric(c.key,state,stats);if(actual===undefined)return false;switch(c.operator){case 'gte':return actual>=c.value;case 'lte':return actual<=c.value;case 'eq':return actual===c.value;case 'neq':return actual!==c.value;default:return false;}}
  function eligible(event,state,stats){const rt=state.eventRuntime;
    if(event.onlyScheduled||state.turn<(event.minTurn||1))return false;
    if(event.maxTurn&&state.turn>event.maxTurn)return false;
    if(event.once&&rt.history.some(entry=>entry.eventId===event.id))return false;
    const last=rt.lastTriggered[event.id];if(last!==undefined&&state.turn-last<(event.cooldown||0))return false;
    return (event.conditions||[]).every(c=>conditionMet(c,state,stats));
  }
  function pickEvent(events,state,stats){const available=events.filter(e=>eligible(e,state,stats));const total=available.reduce((a,e)=>a+Math.max(0,e.weight||0),0);if(!total)return null;let roll=random(state.eventRuntime)*total;for(const event of available){roll-=Math.max(0,event.weight||0);if(roll<0)return event;}return available[available.length-1]||null;}
  function resolveRegion(event,state){const regions=state.regions;if(!event.regionScope)return null;
    if(event.regionScope==='selected')return state.selected;
    if(event.regionScope==='home')return state.homeRegionId||state.selected;
    if(event.regionScope==='random')return regions[Math.floor(random(state.eventRuntime)*regions.length)].id;
    if(event.regionScope==='highestRegulation')return [...regions].sort((a,b)=>b.regulation-a.regulation)[0].id;
    if(event.regionScope==='maxAdoption')return [...regions].sort((a,b)=>b.adoption-a.adoption)[0].id;
    if(event.regionScope==='lowestAdoption')return [...regions].sort((a,b)=>a.adoption-b.adoption)[0].id;
    return null;
  }
  function makePending(event,state,source='random',regionId=null){return {eventId:event.id,source,regionId:regionId||resolveRegion(event,state)};}
  function takeScheduled(state){const rt=state.eventRuntime;rt.scheduled.sort((a,b)=>a.dueTurn-b.dueTurn);const index=rt.scheduled.findIndex(x=>x.dueTurn<=state.turn);return index>=0?rt.scheduled.splice(index,1)[0]:null;}
  function finishEvent(state,event,choiceIndex,regionId){const choice=event.choices[choiceIndex];const rt=state.eventRuntime;
    rt.lastTriggered[event.id]=state.turn;
    rt.history.push({eventId:event.id,turn:state.turn,choiceId:String(choiceIndex),regionId:regionId||null});
    rt.history=rt.history.slice(-150);
    for(const flag of choice.flags||[])rt.flags[flag]=true;
    for(const scheduled of choice.schedule||[])rt.scheduled.push({eventId:scheduled.eventId,dueTurn:state.turn+Math.max(1,scheduled.delay||1),regionId:regionId||null,sourceEventId:event.id});
    rt.scheduled=rt.scheduled.slice(-50);
    return choice;
  }
  function interpolate(template,state,regionId=null){const r=state.regions.find(x=>x.id===regionId);return String(template||'').replace(/\{\{(aiName|country|region|turn)\}\}/g,(_,key)=>({aiName:state.name,country:state.countryId?({jp:'日本',us:'アメリカ',cn:'中国',in:'インド',de:'ドイツ',uk:'イギリス',sg:'シンガポール',ae:'UAE',br:'ブラジル',ke:'ケニア',kr:'韓国',au:'オーストラリア'}[state.countryId]||'世界'): '世界',region:r?r.name:'世界各地',turn:state.turn}[key]));}
  function newsObject(state,{id,headline,body='',category='世界情勢',severity='normal',regionId=null,sourceEventId=null}){const rt=state.eventRuntime;return {id:`n-${state.turn}-${rt.nextNewsId++}`,turn:state.turn,category,severity,message:interpolate(headline,state,regionId),body:interpolate(body,state,regionId),regionId,sourceEventId,ruleId:id||null};}
  const severityRank={breaking:3,important:2,normal:1};
  function detectNews(before,state,beforeStats,afterStats,rules,maxItems=3){const rt=state.eventRuntime;const candidates=[];
    for(const rule of rules){if(rt.newsSeen[rule.id])continue;const a=getMetric(rule.key,before,beforeStats),b=getMetric(rule.key,state,afterStats);
      if(typeof a==='number'&&typeof b==='number'&&a<rule.threshold&&b>=rule.threshold){candidates.push({...rule,onceKey:rule.id,score:90+(severityRank[rule.severity]||1)*8});}}
    // News about tangible changes in regional leadership.
    for(let i=0;i<state.regions.length;i++){
      const prev=before.regions[i],next=state.regions[i];
      const leader=r=>r.presence.indexOf(Math.max(...r.presence));
      const a=leader(prev),b=leader(next);
      const key=`leader-${next.id}`;
      if(a!==b&&(state.turn-(rt.newsLast[key]||-50)>=5)){
        const names=[state.name,'ATLAS','NOVA'];
        candidates.push({id:key,category:'競合AI',severity:'important',headline:`${next.name}で${names[b]}がシェア首位へ`,body:`AI市場の主導権が${names[a]}から${names[b]}へ移った。`,score:83,repeatKey:key,regionId:next.id});
      }
      for(const milestone of [50,70]){
        const mark=`region-${next.id}-${milestone}`;
        if(!rt.newsSeen[mark]&&prev.adoption<milestone&&next.adoption>=milestone){candidates.push({id:mark,category:'地域',severity:'normal',headline:`${next.name}のAI普及率が${milestone}%に`,body:'地域でのAI導入が新たな段階に入った。',score:64,onceKey:mark,regionId:next.id});}
      }
    }
    for(const [index,name] of [[1,'ATLAS'],[2,'NOVA']]){
      const gain=afterStats.sh[index]-beforeStats.sh[index],key=`rival-${index}`;
      if(gain>=1.0&&state.turn-(rt.newsLast[key]||-50)>=4){candidates.push({id:key,category:'競合AI',severity:'normal',headline:`${name}が世界市場でシェアを拡大`,body:`前月より${gain.toFixed(1)}ポイント上昇。プレイヤーとの競争が続く。`,score:60,repeatKey:key});}
    }
    // Quiet months get a grounded monthly report, not a fabricated random headline.
    if(!candidates.length){const gains=state.regions.map((r,i)=>({region:r,delta:r.adoption-before.regions[i].adoption})).sort((a,b)=>b.delta-a.delta);const top=gains[0];
      candidates.push({id:'monthly-adoption',category:'世界情勢',severity:'normal',headline:`${top.region.name}でAI普及が進行`,body:`今月は普及率が${top.delta.toFixed(1)}ポイント増加。各AIが競争を続けている。`,score:1,regionId:top.region.id});
    }
    candidates.sort((a,b)=>b.score-a.score);
    const selected=candidates.slice(0,maxItems);
    const result=[];
    for(const item of selected){if(item.onceKey)rt.newsSeen[item.onceKey]=true;if(item.repeatKey)rt.newsLast[item.repeatKey]=state.turn;result.push(newsObject(state,item));}
    return result;
  }
  return {makeRuntime,random,getMetric,eligible,pickEvent,resolveRegion,makePending,takeScheduled,finishEvent,interpolate,newsObject,detectNews};
})();

