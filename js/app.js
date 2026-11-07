import { DEFIS, byId, CATS, SCORE_LABEL, PEOPLE, GRADES, gradeOf, nextGrade, PACKS, CAPTIONS } from './data.js';
import { capiSVG } from './capi.js';
import { ICON } from './icons.js';
import { makeSticker, makeGif, makeStory, demoStickers, caption } from './media.js';
let AC; const ac = () => AC ||= new (window.AudioContext || window.webkitAudioContext)();
try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (e) { }
const SILENT = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';
const unlock = () => {
  try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; const a = ac(); a.resume(); const b = a.createBuffer(1, 1, 22050), n = a.createBufferSource(); n.buffer = b; n.connect(a.destination); n.start(0); } catch (e) { }
  try { const el = new Audio(SILENT); el.play().catch(() => { }); } catch (e) { }
};
['pointerdown', 'touchend', 'click'].forEach(ev => document.addEventListener(ev, unlock, { passive: true }));
function sfx(type) {
  if (S.sound === false) return;
  try {
    const a = ac(), t = a.currentTime, o = a.createOscillator(), g = a.createGain(); o.connect(g); g.connect(a.destination);
    const P = { cap: ['square', 520, 880, .12], no: ['sawtooth', 220, 70, .25], tick: ['square', 1400, 1400, .025], stamp: ['triangle', 160, 50, .16], win: ['square', 660, 1320, .35] }[type];
    o.type = P[0]; o.frequency.setValueAtTime(P[1], t); o.frequency.exponentialRampToValueAtTime(P[2], t + P[3]);
    g.gain.setValueAtTime(.22, t); g.gain.exponentialRampToValueAtTime(.001, t + P[3]); o.start(t); o.stop(t + P[3] + .02);
  } catch (e) { }
}
let swMood = 'smile';

const $ = s => document.querySelector(s);
const screen = $('#screen'), overlay = $('#overlay');
const rnd = (a, b) => a + Math.random() * (b - a);
const irnd = (a, b) => Math.floor(rnd(a, b + 1));
const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = irnd(0, i); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const FRIENDS = ['lea', 'yanis', 'ines'];
const media = {}; // blobs en mémoire (vidéos, stickers)

const fresh = () => ({
  step: 'onboarding', ob: 0, name: '', plus: false, jokers: 3,
  hours: 48, count: 5,
  order: shuffle(DEFIS.map(d => d.id)), idx: 0, mine: {}, fprog: { lea: 0, yanis: 0, ines: 0 },
  deck: [], votes: {},
  session: null, feed: [], stickers: [],
  done: { me: 4, lea: 31, yanis: 14, ines: 52 }, points: { me: 0, lea: 0, yanis: 0, ines: 0 },
  tab: 'session',
});
let S = JSON.parse(localStorage.getItem('pascap') || 'null') || fresh();
const save = () => localStorage.setItem('pascap', JSON.stringify(S));
const nm = id => id === 'me' ? (S.name || 'Moi') : PEOPLE[id].name;
const av = (id, cls = '') => `<div class="av ${cls}" style="background:${PEOPLE[id].color};color:${PEOPLE[id].fg}">${nm(id)[0].toUpperCase()}</div>`;
const flames = n => `<span class="flames">${[1, 2, 3].map(i => `<span class="${i > n ? 'off' : ''}">${ICON.flame}</span>`).join('')}</span>`;
const durTxt = d => d.min === d.max ? `${d.min}` : `${d.min}–${d.max}`;

function toast(html, ms = 3200) {
  const el = document.createElement('div'); el.className = 'tst'; el.innerHTML = html;
  $('#toast').appendChild(el); setTimeout(() => el.remove(), ms);
}
function steps(cur) {
  const L = ['1 · Swipe', '2 · Le deck', '3 · Ça sonne'];
  return `<div class="steps">${L.map((l, i) => `<b class="${i === cur ? 'on' : i < cur ? 'done' : ''}">${l}</b>`).join('')}</div>`;
}
function go(step) { S.step = step; save(); sfx('stamp'); render(); }
const enter = el => el && (el.classList.remove('enter'), void el.offsetWidth, el.classList.add('enter'));

// ---------- ONBOARDING ----------
const OB = [
  { t: "T'es pas cap ?", p: 'Swipe des défis avec ta bande. Ton tel sonne au hasard. Tu te filmes. Tout le monde voit.', b: 'Chiche', art: () => `<div id="obcapi" style="cursor:pointer">${capiSVG({ size: 170, cls: 'bounce' })}</div><p class="small" style="margin-top:8px">(touche-la)</p>` },
];
function vOnboarding() {
  const o = OB[S.ob];
  screen.innerHTML = `<div class="pad">
    
    <div class="grow" style="display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center">${o.art()}</div>
    <div class="h1">${o.t}</div><p class="lead">${o.p}</p>
    <div style="margin-top:22px"><button class="btn tomato" id="next">${o.b}</button></div></div>`;
  let sz = 170;
  $('#obcapi')?.addEventListener('click', e => { sz = Math.min(sz + 22, 250); e.currentTarget.innerHTML = capiSVG({ size: sz, mood: 'wink', cls: 'pop' }); });
  $('#next').onclick = () => { if (S.ob < OB.length - 1) { S.ob++; save(); render(); } else go('name'); };
}
function vName() {
  screen.innerHTML = `<div class="pad"><div class="h1">C'est quoi<br>ton blaze ?</div><p class="lead">Tes potes te verront comme ça.</p>
    <input class="field" id="nm" placeholder="Ton prénom" value="${S.name}" style="margin-top:22px" autofocus>
    <div class="grow" style="display:grid;place-items:center">${capiSVG({ size: 110, mood: 'wink' })}</div>
    <p class="small" style="text-align:center;margin-bottom:12px">On te demandera la caméra et les notifications au moment du premier défi.</p>
    <button class="btn tomato" id="ok">Je suis cap</button></div>`;
  $('#ok').onclick = () => { S.name = ($('#nm').value || 'Boris').trim(); go('band'); };
}

// ---------- PAYWALL ----------
function paywallHTML() {
  return `<div class="pad" style="background:var(--cream)">
    <div class="row" style="justify-content:space-between"><span class="tag">Pas Cap+</span><button class="link" id="pwno" style="padding:0">Plus tard</button></div>
    <div style="display:grid;place-items:center;margin:8px 0">${capiSVG({ size: 104, crowned: true })}</div>
    <div class="h1" style="font-size:40px">Passe en<br>Pas Cap+</div>
    <div class="perk">${ICON.joker}<div><b>3 jokers par mois</b><p class="small">Coupe la sonnerie une fois, sans perdre ta série.</p></div></div>
    <div class="perk">${ICON.box}<div><b>Packs de défis</b><p class="small">Soirée, Couple, Extrême, Bureau, Vacances : +150 défis.</p></div></div>
    <div class="price"><div><div class="h2">2,99 € / mois</div><div class="small">Sans engagement</div></div>${ICON.crown}</div>
    <button class="btn tomato" id="pwyes">Devenir Pas Cap+</button>
    <button class="link" id="pwno2" style="margin-top:6px">Continuer sans abonnement</button>
    <p class="small" style="text-align:center">Démo : paiement simulé, aucune carte débitée.</p></div>`;
}
function paywall(onDone) {
  const el = document.createElement('div'); el.style.cssText = 'position:absolute;inset:0;z-index:40;display:flex;flex-direction:column;background:var(--cream)';
  el.innerHTML = paywallHTML(); document.querySelector('#device').appendChild(el);
  const close = () => { el.remove(); onDone && onDone(); };
  el.querySelector('#pwno').onclick = close; el.querySelector('#pwno2').onclick = close;
  el.querySelector('#pwyes').onclick = e => {
    e.currentTarget.textContent = 'Paiement…';
    setTimeout(() => {
      S.plus = true; S.jokers = 3; save();
      el.innerHTML = `<div class="pad" style="align-items:center;justify-content:center;text-align:center">${capiSVG({ size: 150, crowned: true, cls: 'pop' })}<div class="h1" style="margin-top:20px">Bienvenue<br>dans le club</div><p class="lead">3 jokers dispo. Packs débloqués.</p><div style="width:100%;margin-top:26px"><button class="btn" id="pwgo">Continuer</button></div></div>`;
      el.querySelector('#pwgo').onclick = close;
    }, 1500);
  };
}

// ---------- BANDE ----------
function vBand() {
  screen.innerHTML = `<div class="pad"><div class="h1">Ta bande</div><p class="lead">Partage le code. Pas de bande, pas de défis.</p>
    <div class="card" style="padding:16px;margin-top:18px;display:flex;justify-content:space-between;align-items:center"><div><div class="small">Code de la bande</div><div class="h1" style="font-size:38px">CAP-4X9</div></div><div style="width:58px">${ICON.qr.replace('class="ico"', 'class="ico" style="width:58px;height:58px"')}</div></div>
    <button class="btn cream sm" id="inv" style="margin-top:12px">${ICON.share} Inviter sur Snap / WhatsApp</button>
    <div class="sect"><div class="h3">Les Pas Cap du 94</div><div id="mem"></div></div>
    <div class="grow"></div><button class="btn tomato" id="nx" disabled style="opacity:.4">En attente des potes…</button></div>`;
  const list = ['me', ...FRIENDS]; let n = 1;
  const draw = () => $('#mem').innerHTML = list.slice(0, n).map(id => `<div class="feedline pop">${av(id)}<b>${nm(id)}</b><span class="grow"></span><span class="grade">${gradeOf(S.done[id]).name}</span></div>`).join('');
  draw();
  const t = setInterval(() => { n++; draw(); if (n >= 4) { clearInterval(t); const b = $('#nx'); b.disabled = false; b.style.opacity = 1; b.textContent = 'Lancer une session'; } }, 600);
  $('#inv').onclick = () => { const txt = "T'es pas cap de rejoindre ma bande sur Pas Cap ? Code : CAP-4X9"; navigator.share ? navigator.share({ text: txt }).catch(() => { }) : toast('Lien copié (simulé)'); };
  $('#nx').onclick = () => { clearInterval(t); go('settings'); };
}
function vSettings() {
  screen.innerHTML = `<div class="pad"><div class="h1">Nouvelle<br>session</div>
    <div class="sect"><div class="h3">Durée</div><div class="row" id="hrs">${[2, 24, 48, 72].map(h => `<button class="btn sm ${S.hours === h ? '' : 'cream'}" data-h="${h}" style="padding:12px 4px">${h === 2 ? 'Soirée 2 h' : h + ' h'}</button>`).join('')}</div></div>
    <div class="sect"><div class="h3"><span>Défis qui vont tomber</span><span id="cv">${S.count}</span></div><input type="range" min="3" max="10" value="${S.count}" id="cnt" style="width:100%;accent-color:#1A1714"></div>
    <div class="sect row"><input type="checkbox" checked id="q" style="width:22px;height:22px;accent-color:#1A1714"><label for="q"><b>Heures calmes</b> · pas de défi entre 23 h et 8 h</label></div>
    <div class="card" style="padding:14px;margin-top:22px;background:var(--mustard)"><b id="sum"></b></div>
    <div class="grow"></div><button class="btn tomato" id="nx">Passer au swipe</button></div>`;
  const sum = () => $('#sum').textContent = S.hours === 2 ? `Mode soirée : ${S.count} défis en 2 h, un toutes les ${Math.round(120 / (S.count + 1))} min environ.` : `${S.count} défis vont tomber au hasard sur l'un de vous 4 pendant ${S.hours} h.`;
  sum();
  screen.querySelectorAll('[data-h]').forEach(b => b.onclick = () => { S.hours = +b.dataset.h; save(); vSettings(); });
  $('#cnt').oninput = e => { S.count = +e.target.value; $('#cv').textContent = S.count; sum(); };
  $('#nx').onclick = () => go('swipe');
}

// ---------- SWIPE ----------
let fTimer;
function cardHTML(d, cls = '') {
  const c = CATS[d.cat];
  return `<div class="dcard ${cls}" style="background:${c.bg};color:${c.fg}">
    <div class="row" style="justify-content:space-between"><span class="tag">${c.label}</span>${flames(d.lvl)}</div>
    <div class="dur" style="margin-top:18px">${durTxt(d)}<small>s</small></div>
    <div class="t">${d.t}</div>
    <div class="meta"><span>${SCORE_LABEL[d.score]}</span><span>#${d.id}</span></div>
    <div class="st cap stamp">Cap</div><div class="st no stamp">Pas cap</div></div>`;
}
function vSwipe() {
  if (S.idx >= S.order.length) return finishSwipe();
  const d = byId[S.order[S.idx]], n = byId[S.order[S.idx + 1]];
  screen.innerHTML = `<div class="pad" style="padding-bottom:18px">${steps(0)}
    <div class="row" style="justify-content:space-between"><div class="h2 mono">${S.idx + 1}<span style="opacity:.4"> / 100</span></div><div id="swc">${capiSVG({ size: 46, mood: swMood, cls: swMood === 'smile' ? '' : 'pop' })}</div>
    <div class="friends">${FRIENDS.map(f => `<div class="fprog">${av(f)}<span class="mono" data-f="${f}">${S.fprog[f]}</span></div>`).join('')}</div></div>
    <div class="deckzone">${n ? cardHTML(n, 'back') : ''}${cardHTML(d)}</div>
    <div class="swbtns"><div class="round no" id="bn">${ICON.x}</div><div class="round yes" id="by">${ICON.flame}</div></div>
    <button class="link" id="skip" style="margin-top:4px">Passer, je fais confiance à la bande</button></div>`;
  const card = screen.querySelector('.dcard:not(.back)');
  const cap = card.querySelector('.st.cap'), no = card.querySelector('.st.no');
  let x0 = null, dx = 0, dy = 0, y0 = 0;
  card.onpointerdown = e => { x0 = e.clientX; y0 = e.clientY; card.setPointerCapture(e.pointerId); card.style.transition = 'none'; };
  card.onpointermove = e => { if (x0 === null) return; dx = e.clientX - x0; dy = e.clientY - y0; card.style.transform = `translate(${dx}px,${dy * .3}px) rotate(${dx / 14}deg)`; cap.style.opacity = Math.max(0, dx / 90); no.style.opacity = Math.max(0, -dx / 90); };
  card.onpointerup = () => { x0 = null; if (Math.abs(dx) > 90) decide(dx > 0); else { card.style.transition = 'transform .25s'; card.style.transform = ''; cap.style.opacity = no.style.opacity = 0; } dx = 0; };
  function decide(yes) {
    navigator.vibrate?.(15); sfx(yes ? 'cap' : 'no');
    swMood = yes ? 'wink' : 'cry'; $('#swc').innerHTML = capiSVG({ size: 46, mood: swMood, cls: 'pop' });
    (yes ? cap : no).style.opacity = 1;
    card.style.transition = 'transform .3s ease-in';
    card.style.transform = `translate(${yes ? 520 : -520}px,40px) rotate(${yes ? 28 : -28}deg)`;
    S.mine[d.id] = yes; S.idx++; save();
    setTimeout(vSwipe, 260);
  }
  $('#by').onclick = () => decide(true); $('#bn').onclick = () => decide(false);
  $('#skip').onclick = () => { S.order.slice(S.idx).forEach(id => S.mine[id] ??= Math.random() < .5); S.idx = S.order.length; save(); finishSwipe(); };
  clearInterval(fTimer);
  fTimer = setInterval(() => { FRIENDS.forEach(f => { S.fprog[f] = Math.min(100, S.fprog[f] + irnd(0, 3)); const el = screen.querySelector(`[data-f="${f}"]`); if (el) el.textContent = S.fprog[f]; }); }, 900);
}
function finishSwipe() {
  clearInterval(fTimer);
  const scored = DEFIS.map(d => {
    const fr = FRIENDS.map(() => Math.random() < .42 + (d.lvl - 1) * .13);
    const v = (S.mine[d.id] ? 1 : 0) + fr.filter(Boolean).length;
    return { id: d.id, v, tie: (S.mine[d.id] ? 1 : 0) + Math.random() };
  }).sort((a, b) => b.v - a.v || b.tie - a.tie);
  S.deck = scored.slice(0, 20).map(s => s.id); S.votes = Object.fromEntries(scored.slice(0, 20).map(s => [s.id, Math.max(2, s.v)]));
  go('reveal');
}
function vReveal() {
  screen.innerHTML = `<div class="pad">${steps(1)}<div class="h1">Votre deck</div><p class="lead" id="rl">Les 20 défis les plus likés par la bande…</p>
    <div class="grid20">${S.deck.map(id => { const d = byId[id], c = CATS[d.cat]; return `<div class="mini hide" style="background:${c.bg};color:${c.fg}"><b>${durTxt(d)}s</b><span>${d.t}</span><span class="sc">${S.votes[id]}/4</span></div>`; }).join('')}</div>
    <div class="grow"></div><button class="btn tomato" id="go" style="opacity:.4" disabled>…</button></div>`;
  const minis = [...screen.querySelectorAll('.mini')];
  minis.forEach((m, i) => setTimeout(() => { m.classList.remove('hide'); m.classList.add('flip'); navigator.vibrate?.(8); sfx('tick'); if (i === minis.length - 1) done(); }, 250 + i * 140));
  function done() { sfx('win'); $('#rl').textContent = `Prêt. ${S.count} de ces défis vont tomber dans les ${S.hours} prochaines heures. Bonne chance.`; const b = $('#go'); b.disabled = false; b.style.opacity = 1; b.textContent = 'Lancer la session'; b.onclick = startSession; }
}
function startSession() {
  const H = S.hours, n = S.count, start = new Date();
  const times = [];
  if (H <= 2) for (let i = 0; i < n; i++) times.push((i + 1) * H / (n + 1) + rnd(-.04, .04));
  else {
    const gap = Math.min(2, H / (n * 3)); let guard = 0;
    while (times.length < n && guard++ < 5000) {
      const t = rnd(1, H - 1); const hod = (start.getHours() + t) % 24;
      if ((hod >= 23 || hod < 8) && guard < 4000) continue;
      if (times.every(x => Math.abs(x - t) > gap)) times.push(t);
    }
  }
  times.sort((a, b) => a - b);
  const targets = times.map((_, i) => i === 0 || i === Math.ceil(n / 2) ? 'me' : FRIENDS[i % 3]);
  const pool = shuffle(S.deck);
  S.session = { start: Date.now(), base: 0, drops: times.map((t, i) => ({ at: t, who: targets[i], id: pool[i], status: 'pending' })) };
  S.tab = 'session'; go('main');
}
const elapsed = () => Math.min(S.hours, S.session.base + (Date.now() - S.session.start) / 3.6e6);

// ---------- MAIN ----------
function vMain() {
  const tabs = [['session', 'flame', 'Session'], ['bande', 'people', 'La bande'], ['profil', 'user', 'Moi']];
  screen.innerHTML = `<div class="pad" id="tabc"></div><nav class="tabs">${tabs.map(([k, i, l]) => `<button class="${S.tab === k || (S.tab === 'defis' && k === 'session') ? 'on' : ''}" data-t="${k}">${ICON[i]}${l}</button>`).join('')}</nav>`;
  screen.querySelectorAll('[data-t]').forEach(b => b.onclick = () => { S.tab = b.dataset.t; save(); sfx('stamp'); vMain(); enter($('#tabc')); });
  ({ session: tSession, defis: tDefis, bande: tBande, profil: tProfil })[S.tab]();
}
let clockT;
function tSession() {
  const s = S.session, H = S.hours, el = elapsed();
  const dropped = s.drops.filter(d => d.status !== 'pending').length;
  const next = s.drops.find(d => d.status === 'pending');
  const series = S.feed.filter(f => f.who === 'me').length;
  $('#tabc').innerHTML = `${steps(2)}
    <div class="row" style="justify-content:space-between;align-items:flex-start"><div><div class="small">${H === 2 ? 'Mode soirée · 2 h' : 'Session ' + H + ' h'} · Les Pas Cap du 94</div><div class="clock mono" id="clk"></div><div class="small">restantes</div></div>
    <div id="capi" title="Appui long : défi immédiat" style="cursor:pointer;touch-action:none">${capiSVG({ size: 58 + series * 14, cls: 'bounce' })}</div></div>
    <div class="tl">${s.drops.map(d => `<div class="mk" style="left:${d.at / H * 100}%">${d.status === 'pending' ? `<div class="av q">?</div>` : av(d.who)}</div>`).join('')}
      <div class="bar"><i style="width:${el / H * 100}%"></i></div>
      <div class="days">${(H < 24 ? ['Début', '1 h', '2 h'] : Array.from({ length: H / 24 + 1 }, (_, i) => i === 0 ? 'Début' : 'J' + i)).map(l => `<span>${l}</span>`).join('')}</div></div>
    <div class="h2" style="margin-top:4px">Défis tombés ${dropped} / ${s.drops.length}</div>
    
    <div class="sect"><div class="h3"><span>Le deck élu · 20</span><button class="link" id="alld" style="padding:0">Tout voir</button></div>
      <div class="hscroll">${S.deck.map(id => { const d = byId[id], c = CATS[d.cat], dn = S.feed.find(f => f.id === id); return `<div class="hcard" style="background:${c.bg};color:${c.fg}"><b>${durTxt(d)}s</b>${dn ? `<span class="done">Fait</span>` : ''}<p>${d.t}</p><span class="small" style="margin-top:4px;opacity:1;font-weight:700">${S.votes[id]}/4 cap</span></div>`; }).join('')}</div></div>
    ${!next ? `<button class="btn tomato" id="wr" style="margin-top:14px">Voir le verdict</button>` : ''}
    ${next ? `<button class="btn tomato" id="ff" style="margin-top:18px">${ICON.bolt} Faire tomber un défi</button>` : ''}
    <button class="link" id="wr2" style="margin-top:6px">Démo : aller au verdict</button>`;
  const tick = () => { const r = Math.max(0, H - elapsed()) * 3600; const c = $('#clk'); if (!c) return clearInterval(clockT); c.textContent = [r / 3600, r / 60 % 60, r % 60].map(v => String(Math.floor(v)).padStart(2, '0')).join(':'); };
  clearInterval(clockT); tick(); clockT = setInterval(tick, 1000);
  $('#ff') && ($('#ff').onclick = () => fireNext());
  $('#alld').onclick = () => { S.tab = 'defis'; save(); vMain(); };
  $('#wr') && ($('#wr').onclick = wrapped); $('#wr2').onclick = wrapped;
  let lp; const c = $('#capi');
  c.onpointerdown = () => lp = setTimeout(() => fireNext('me'), 600);
  c.onpointerup = c.onpointerleave = () => clearTimeout(lp);
}
const fmtS = s => s >= 60 ? `${Math.floor(s / 60)} min ${String(Math.round(s % 60)).padStart(2, '0')}` : `${Math.round(s)} s`;
function rankHTML(short) {
  const ids = ['me', ...FRIENDS].sort((a, b) => S.points[b] - S.points[a] || S.done[b] - S.done[a]);
  return ids.map((id, i) => `<div class="rank"><span class="n">${i + 1}</span>${av(id)}<div class="grow"><b>${nm(id)}</b><div class="small">${S.done[id]} défis réussis</div></div>${short ? '' : `<span class="grade">${gradeOf(S.done[id]).name}</span>`}<b class="mono">${S.points[id]} pts</b></div>`).join('');
}
function fireNext(force) {
  const d = S.session.drops.find(x => x.status === 'pending');
  if (!d) return toast('Plus de défi dans cette session.');
  if (force) d.who = force;
  S.session.base = Math.max(elapsed(), d.at); S.session.start = Date.now();
  d.status = 'ringing'; save();
  wheel(d.who).then(() => d.who === 'me' ? alarm(d) : friendDrop(d));
}
function wheel(who) {
  return new Promise(res => {
    const ids = ['me', ...FRIENDS], k = ids.indexOf(who);
    const cols = ids.map(id => PEOPLE[id].color);
    overlay.innerHTML = `<div class="wheel"><div class="h1">Qui va<br>sonner ?</div>
      <div class="wh"><div class="ptr"></div><div class="disc" id="disc" style="background:conic-gradient(from -45deg,${cols[0]} 0 90deg,${cols[1]} 90deg 180deg,${cols[2]} 180deg 270deg,${cols[3]} 270deg 360deg)">
      ${ids.map((id, i) => `<div class="sl" style="left:${50 + 33 * Math.sin(i * Math.PI / 2)}%;top:${50 - 33 * Math.cos(i * Math.PI / 2)}%">${av(id, 'lg')}</div>`).join('')}</div>
      <div class="hub">${capiSVG({ size: 54, mood: 'scream' })}</div></div><div class="h1" id="whn" style="min-height:52px"></div></div>`;
    const disc = $('#disc'), R = 360 * 6 - k * 90 + rnd(-30, 30);
    requestAnimationFrame(() => requestAnimationFrame(() => { disc.style.transform = `rotate(${R}deg)`; }));
    let iv = 45, el = 0; const tk = () => { sfx('tick'); navigator.vibrate?.(5); el += iv; iv *= 1.12; if (el < 3000) setTimeout(tk, iv); }; tk();
    setTimeout(() => { sfx('stamp'); navigator.vibrate?.(80); const n = $('#whn'); n.textContent = who === 'me' ? "C'est toi !" : nm(who) + ' !'; n.classList.add('stamp-in'); }, 3300);
    setTimeout(() => { overlay.innerHTML = ''; res(); }, 4400);
  });
}
function friendDrop(d) {
  const df = byId[d.id];
  toast(`${av(d.who)}<div><b>Ça sonne chez ${nm(d.who)}</b><div class="small">${df.t}</div></div>`);
  vMain();
  setTimeout(() => {
    const dur = irnd(df.min, df.max), resp = Math.random() < .25 ? irnd(240, 420) : irnd(12, 140);
    const score = df.score === 'reps' ? Math.round(dur * rnd(.8, 1.5)) : df.score === 'secs' ? dur - irnd(0, 4) : 0;
    addEntry({ who: d.who, id: d.id, dur, resp, score, sim: true });
    d.status = 'done'; save();
    toast(`${av(d.who)}<div><b>${nm(d.who)} est cap</b><div class="small">${score ? score + (df.score === 'reps' ? ' rép. · ' : ' s · ') : ''}réponse en ${fmtS(resp)}</div></div>`);
    vMain();
  }, 2600);
}
function addEntry(e) {
  const df = byId[e.id];
  const prevBest = Math.max(0, ...S.feed.filter(f => f.id === e.id || (df.score === 'reps' && byId[f.id].score === 'reps')).map(f => f.score || 0));
  e.record = !!e.score && e.score > prevBest;
  e.points = 100 + (e.score || 0) * 2 + Math.max(0, Math.round(100 - e.resp / 3));
  e.key = 'v' + Date.now(); e.votes = {}; e.react = {};
  S.feed.unshift(e); S.points[e.who] += e.points; S.done[e.who]++;
  return e;
}

// ---------- ALARME ----------
let audio, vibT;
function startRing() {
  try {
    const a = ac(); a.resume();
    const g = a.createGain(); g.gain.value = .25; g.connect(a.destination);
    const o = a.createOscillator(); o.type = 'square'; o.connect(g); o.start();
    let k = 0; audio = { o, g, t: setInterval(() => { o.frequency.value = [988, 740, 988, 0][k++ % 4] || 1; g.gain.value = k % 4 === 0 ? 0 : .25; }, 120) };
  } catch (e) { }
  vibT = setInterval(() => navigator.vibrate?.([300, 100]), 400);
}
function stopRing() { clearInterval(vibT); navigator.vibrate?.(0); if (audio) { clearInterval(audio.t); try { audio.o.stop(); audio.g.disconnect(); } catch (e) { } audio = null; } }
function alarm(d) {
  const df = byId[d.id], t0 = Date.now();
  const dur = irnd(df.min, df.max);
  overlay.innerHTML = `<div class="alarm"><div class="inner">${capiSVG({ size: 110, mood: 'scream' })}
    <div class="big">Défi !<br>T'es pas cap ?</div><div class="defi">${df.t}</div>
    <div class="roll mono" id="roll">--<span style="font-size:40px">s</span></div><div class="since" id="since">Ça sonne depuis 00:00</div></div>
    <button class="btn cream" id="film" style="margin-top:14px">${ICON.camera} Je suis cap — filmer</button>
    <button class="link" id="jk" style="color:var(--cream)">Utiliser un joker${S.plus ? ` (${S.jokers})` : ''}</button></div>`;
  startRing();
  let r = 0; const roll = setInterval(() => { if (!$('#roll')) return clearInterval(roll); $('#roll').firstChild.textContent = irnd(df.min, df.max); if (++r > 18) { clearInterval(roll); $('#roll').firstChild.textContent = dur; } }, 70);
  const st = setInterval(() => { const s = (Date.now() - t0) / 1000; const e = $('#since'); if (!e) return clearInterval(st); e.textContent = 'Ça sonne depuis ' + [s / 60, s % 60].map(v => String(Math.floor(v)).padStart(2, '0')).join(':'); }, 250);
  $('#film').onclick = () => { clearInterval(st); camera(d, dur, (Date.now() - t0) / 1000); };
  $('#jk').onclick = () => {
    if (!S.plus || S.jokers <= 0) return paywall();
    S.jokers--; d.status = 'joker'; save(); clearInterval(st); stopRing(); overlay.innerHTML = ''; toast('Joker utilisé. La bande est au courant.'); vMain();
  };
}

// ---------- CAMÉRA ----------
async function camera(d, dur, resp) {
  const df = byId[d.id];
  let facing = 'user', stream = null, fake = false;
  overlay.innerHTML = `<div class="cam"><video id="cv" autoplay playsinline muted class="mirror"></video>
    <div class="top"><div class="tag" style="background:${CATS[df.cat].bg};color:${CATS[df.cat].fg};border-color:var(--cream)">${CATS[df.cat].label} · ${dur} s</div><div class="h2" style="margin-top:8px">${df.t}</div><div class="small" id="ring" style="margin-top:4px">Ça sonne toujours… filme pour l'arrêter.</div></div>
    <div class="bottom" id="cb"><div class="seg"><button data-f="user" class="on">Avant</button><button data-f="environment">Arrière</button><button data-f="pote">Un pote me filme</button></div>
    <button class="rec" id="rec"><i></i></button></div></div>`;
  const v = $('#cv');
  async function open() {
    stream?.getTracks().forEach(t => t.stop());
    try { stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: facing === 'user' ? 'user' : 'environment' }, audio: true }); v.srcObject = stream; fake = false; }
    catch (e) { try { stream = await navigator.mediaDevices.getUserMedia({ video: true }); v.srcObject = stream; } catch (e2) { fake = true; v.remove(); startFake(); } }
    v.classList.toggle('mirror', facing === 'user');
  }
  let fakeCanvas, fakeRAF;
  function startFake() {
    fakeCanvas = document.createElement('canvas'); fakeCanvas.width = 480; fakeCanvas.height = 640; fakeCanvas.className = 'src';
    $('.cam').prepend(fakeCanvas); const ctx = fakeCanvas.getContext('2d');
    const img = new Image(); img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(capiSVG({ size: 200, mood: 'scream' }));
    const t0 = performance.now();
    const loop = () => { const t = (performance.now() - t0) / 1000; ctx.fillStyle = CATS[df.cat].bg; ctx.fillRect(0, 0, 480, 640); const y = 330 - Math.abs(Math.sin(t * 4)) * 150; ctx.save(); ctx.translate(240, y); ctx.rotate(Math.sin(t * 6) * .15); ctx.drawImage(img, -100, -120, 200, 240); ctx.restore(); ctx.fillStyle = '#1A1714'; ctx.font = '28px Anton'; ctx.textAlign = 'center'; ctx.fillText('VIDÉO D\u2019EXEMPLE', 240, 170); fakeRAF = requestAnimationFrame(loop); };
    loop(); stream = fakeCanvas.captureStream(30);
  }
  await open();
  overlay.querySelectorAll('[data-f]').forEach(b => b.onclick = async () => {
    overlay.querySelectorAll('[data-f]').forEach(x => x.classList.remove('on')); b.classList.add('on');
    facing = b.dataset.f === 'user' ? 'user' : 'environment';
    if (b.dataset.f === 'pote') toast('Passe le tel à un pote : caméra arrière activée.');
    if (!fake) await open();
  });
  $('#rec').onclick = async () => {
    $('#cb').innerHTML = ''; const cam = $('.cam');
    for (const n of [3, 2, 1]) { const c = document.createElement('div'); c.className = 'count pop'; c.textContent = n; cam.appendChild(c); await new Promise(r => setTimeout(r, 700)); c.remove(); }
    stopRing(); $('#ring').textContent = 'Enregistrement…'; d.status = 'filming'; save();
    const src = fake ? fakeCanvas : v;
    const W = 720, H = 1280, comp = document.createElement('canvas'); comp.width = W; comp.height = H; const cx = comp.getContext('2d');
    const mirror = !fake && facing === 'user', rt0 = performance.now(); let drawing = true;
    const title = df.t.toUpperCase().length > 30 ? df.t.toUpperCase().slice(0, 29) + '…' : df.t.toUpperCase();
    const drawComp = () => {
      if (!drawing) return;
      const sw = src.videoWidth || src.width, sh = src.videoHeight || src.height;
      if (sw) { const sc = Math.max(W / sw, H / sh), dw = sw * sc, dh = sh * sc; cx.save(); if (mirror) { cx.translate(W, 0); cx.scale(-1, 1); } cx.drawImage(src, (W - dw) / 2, (H - dh) / 2, dw, dh); cx.restore(); }
      cx.lineWidth = 28; cx.strokeStyle = '#F3EDE2'; cx.strokeRect(14, 14, W - 28, H - 28); cx.lineWidth = 4; cx.strokeStyle = '#1A1714'; cx.strokeRect(28, 28, W - 56, H - 56);
      caption(cx, 'PAS CAP', 150, 100, 40, -0.08);
      const left = Math.max(0, Math.ceil(dur - (performance.now() - rt0) / 1000));
      cx.font = '150px Anton'; cx.textAlign = 'right'; cx.textBaseline = 'alphabetic'; cx.lineWidth = 10; cx.strokeStyle = '#1A1714'; cx.strokeText(left, W - 60, 190); cx.fillStyle = '#F3EDE2'; cx.fillText(left, W - 60, 190);
      caption(cx, title, W / 2, H - 150, 46, -0.03);
      cx.font = '600 28px Archivo'; cx.textAlign = 'center'; cx.fillStyle = '#F3EDE2'; cx.fillText(`${nm('me')} · t'es pas cap ?`, W / 2, H - 70);
      requestAnimationFrame(drawComp);
    };
    drawComp();
    const out = new MediaStream([...comp.captureStream(30).getVideoTracks(), ...(stream.getAudioTracks ? stream.getAudioTracks() : [])]);
    const mime = ['video/mp4', 'video/webm;codecs=vp9', 'video/webm'].find(m => window.MediaRecorder?.isTypeSupported(m)) || '';
    const chunks = []; let rec;
    try { rec = new MediaRecorder(out, mime ? { mimeType: mime } : undefined); rec.ondataavailable = e => e.data.size && chunks.push(e.data); rec.start(200); } catch (e) { rec = null; }
    // capture d'images pour sticker / GIF
    const sm = document.createElement('canvas'); sm.width = sm.height = 240; const sx = sm.getContext('2d', { willReadFrequently: true });
    const big = document.createElement('canvas'); big.width = big.height = 480; const bx = big.getContext('2d');
    const frames = []; let prev = null, best = -1;
    const grab = () => {
      const w = src.videoWidth || src.width, h = src.videoHeight || src.height; if (!w) return;
      const s = Math.min(w, h), ox = (w - s) / 2, oy = (h - s) / 2;
      sx.drawImage(src, ox, oy, s, s, 0, 0, 240, 240);
      const data = sx.getImageData(0, 0, 240, 240).data;
      if (prev) { let m = 0; for (let i = 0; i < data.length; i += 64) m += Math.abs(data[i] - prev[i]); if (m > best) { best = m; bx.drawImage(src, ox, oy, s, s, 0, 0, 480, 480); } } else bx.drawImage(src, ox, oy, s, s, 0, 0, 480, 480);
      prev = data; frames.push(new Uint8ClampedArray(data));
    };
    $('#cb').innerHTML = `<div class="timer mono" id="tm">${dur}</div><div style="height:6px;border:2px solid var(--cream);border-radius:3px"><i id="pb" style="display:block;height:100%;width:0;background:var(--tomato)"></i></div>`;
    const t0 = performance.now(); const gi = setInterval(grab, 100);
    await new Promise(r => { const iv = setInterval(() => { const e = (performance.now() - t0) / 1000; $('#tm').textContent = Math.max(0, Math.ceil(dur - e)); $('#pb').style.width = Math.min(100, e / dur * 100) + '%'; if (e >= dur) { clearInterval(iv); r(); } }, 100); });
    clearInterval(gi);
    setTimeout(() => drawing = false, 300);
    if (rec) { await new Promise(r => { rec.onstop = r; rec.stop(); }); }
    cancelAnimationFrame(fakeRAF); stream?.getTracks().forEach(t => t.stop());
    const blob = chunks.length ? new Blob(chunks, { type: rec.mimeType || 'video/webm' }) : null;
    const step = Math.max(1, Math.floor(frames.length / 16)); const gf = frames.filter((_, i) => i % step === 0).slice(0, 16);
    review(d, dur, resp, blob, big, gf);
  };
}
function review(d, dur, resp, blob, big, gf) {
  const df = byId[d.id]; const url = blob ? URL.createObjectURL(blob) : '';
  overlay.innerHTML = `<div class="cam"><video src="${url}" autoplay loop playsinline muted></video>
    <div class="top"><div class="h2">${df.t}</div><div class="small">${dur} s · réponse en ${fmtS(resp)}</div></div>
    <div class="bottom">${df.score !== 'vote' ? `<div class="h3" style="text-align:center">Combien ${df.score === 'reps' ? 'de répétitions' : 'de secondes tenues'} ?</div><input class="input mono" id="sc" type="number" inputmode="numeric" value="${df.score === 'reps' ? Math.round(dur * 1.1) : dur}">` : ''}
    <button class="btn tomato" id="send">${ICON.share} Envoyer à la bande</button></div></div>`;
  $('#send').onclick = async () => {
    const score = df.score !== 'vote' ? +($('#sc').value || 0) : 0;
    const before = gradeOf(S.done.me).name;
    const e = addEntry({ who: 'me', id: d.id, dur, resp, score });
    d.status = 'done'; save();
    media[e.key] = { video: blob, url };
    overlay.innerHTML = `<div class="pad" style="background:var(--cream);align-items:center;justify-content:center;text-align:center">${capiSVG({ size: 170, cls: 'pop' })}
      <div class="h1" style="margin-top:16px">+${e.points} pts</div><p class="lead">Réponse en ${fmtS(resp)}. Vidéo envoyée à ${FRIENDS.map(nm).join(', ')}.</p>
      ${gradeOf(S.done.me).name !== before ? `<div class="stamp stamp-in" style="color:var(--green);margin-top:18px;font-size:30px">Nouveau grade : ${gradeOf(S.done.me).name}</div>` : ''}
      <p class="small" id="stk" style="margin-top:16px">Capi fabrique tes stickers…</p>
      <div style="width:100%;margin-top:20px"><button class="btn" id="see">Voir dans la bande</button></div></div>`;
    $('#see').onclick = () => { overlay.innerHTML = ''; S.tab = 'bande'; save(); vMain(); };
    try {
      const cap = CAPTIONS[irnd(0, CAPTIONS.length - 1)];
      const png = await makeSticker(big, cap); const gif = await makeGif(gf, 240, cap, 150);
      media[e.key].sticker = png; media[e.key].gif = gif; S.stickers.unshift({ key: e.key, cap }); save();
      const el = $('#stk'); if (el) el.innerHTML = `<img src="${URL.createObjectURL(png)}" style="width:120px;transform:rotate(-6deg)" class="pop"><br>Sticker + GIF boomerang ralenti créés`;
    } catch (err) { console.error(err); }
    FRIENDS.forEach((f, i) => setTimeout(() => { e.votes[f] = Math.random() < .85 ? 'y' : 'n'; save(); if (S.tab === 'bande' && !overlay.innerHTML) vMain(); }, 1500 + i * 1200));
  };
}

// ---------- ONGLETS ----------
function tDefis() {
  $('#tabc').innerHTML = `<div class="h1">Défis</div><p class="lead">Votre deck de 20, choisi au swipe.</p>
    <div class="sect">${S.deck.map(id => { const d = byId[id], c = CATS[d.cat], dn = S.feed.find(f => f.id === id); return `<div class="feedline"><div class="av" style="background:${c.bg};color:${c.fg};width:52px">${durTxt(d)}</div><div class="grow"><b>${d.t}</b><div class="small">${c.label} · ${S.votes[id]}/4 cap</div></div>${dn ? `<span class="tag" style="background:var(--green);color:var(--cream)">Fait</span>` : flames(d.lvl)}</div>`; }).join('')}</div>
    <div class="sect"><div class="h3">Packs</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">${PACKS.map(p => `<div class="card pack" style="padding:14px;background:${p.bg};color:${p.bg === '#E9A9B4' || p.bg === '#E3A72F' ? '#1A1714' : '#F3EDE2'};cursor:pointer"><div class="row" style="justify-content:space-between"><b class="h3">${p.name}</b>${S.plus ? ICON.check : ICON.lock}</div><div class="small" style="opacity:1">+${p.n} défis</div></div>`).join('')}</div></div>`;
  screen.querySelectorAll('.pack').forEach(p => p.onclick = () => S.plus ? toast('Pack débloqué : défis ajoutés à la prochaine session.') : paywall(vMain));
}
function simMedia(f) {
  const df = byId[f.id], c = CATS[df.cat];
  const anim = df.cat === 'sport' || df.cat === 'danse' ? 'jump' : 'wiggle';
  return `<div class="sim" style="background:${c.bg};color:${c.fg}"><div class="${anim}">${capiSVG({ size: 120, mood: df.cat === 'voix' ? 'scream' : 'wink' })}</div><span class="tag">Vidéo simulée · ${nm(f.who)}</span></div>`;
}
function tBande() {
  $('#tabc').innerHTML = `<div class="h1">La bande</div><div class="sect" id="posts"></div><div class="h2" style="margin-top:26px">Stickers & GIF</div><div class="stk" id="sg" style="margin-top:10px"></div>`;
  loadStickers();
  if (!S.feed.length) { $('#posts').innerHTML = `<div class="card" style="padding:18px;text-align:center">${capiSVG({ size: 80, mood: 'wink' })}<p style="margin-top:10px">Pas encore de vidéo. Avance au prochain défi depuis l'onglet Session.</p></div>`; return; }
  $('#posts').innerHTML = S.feed.map((f, i) => {
    const df = byId[f.id], m = media[f.key];
    const ok = Object.values(f.votes).filter(v => v === 'y').length, nok = Object.values(f.votes).filter(v => v === 'n').length;
    return `<div class="post"><div class="head">${av(f.who)}<div class="grow"><b>${nm(f.who)}</b><div class="small">${f.dur} s · réponse en ${fmtS(f.resp)}</div></div><b class="mono">+${f.points}</b></div>
      <div class="media">${m?.url ? `<video src="${m.url}" autoplay loop muted playsinline></video>` : simMedia(f)}${f.record ? '<span class="badge-rec">Record</span>' : ''}</div>
      <div class="info"><b class="h3">${df.t}</b>${f.score ? `<div class="small">${f.score} ${df.score === 'reps' ? 'répétitions' : 'secondes tenues'}</div>` : ''}
      ${f.who !== 'me' ? `<div class="votes"><button class="vote y ${f.votes.me === 'y' ? 'on' : ''}" data-v="y" data-i="${i}">${ICON.check} Validé</button><button class="vote n ${f.votes.me === 'n' ? 'on' : ''}" data-v="n" data-i="${i}">${ICON.x} Pas validé</button></div>` : `<div class="small" style="margin-top:6px">${ok} validé · ${nok} pas validé ${Object.keys(f.votes).length < 3 ? '· votes en cours…' : ''}</div>`}</div>
      <div class="acts" style="grid-template-columns:repeat(${m?.gif ? 3 : 2},1fr)"><button class="btn sm cream" data-save="${i}">${ICON.download} Galerie</button><button class="btn sm" data-share="${i}">${ICON.share} Story</button>${m?.gif ? `<button class="btn sm mustard" data-gif="${i}">GIF</button>` : ''}</div></div>`;
  }).join('');
  screen.querySelectorAll('[data-v]').forEach(b => b.onclick = () => { S.feed[b.dataset.i].votes.me = b.dataset.v; save(); tBande(); });
  screen.querySelectorAll('[data-save]').forEach(b => b.onclick = () => saveEntry(S.feed[b.dataset.save]));
  screen.querySelectorAll('[data-gif]').forEach(b => b.onclick = () => shareFile(media[S.feed[b.dataset.gif].key].gif, 'pascap-boomerang.gif', 'GIF téléchargé : envoie-le sur WhatsApp.'));
  screen.querySelectorAll('[data-share]').forEach(b => b.onclick = () => shareEntry(S.feed[b.dataset.share]));
}
function download(blob, name) { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); a.remove(); }
async function shareFile(blob, name, fallbackMsg) {
  const file = new File([blob], name, { type: blob.type });
  if (navigator.canShare?.({ files: [file] })) { try { await navigator.share({ files: [file], text: "T'es pas cap ? #PasCap" }); return; } catch (e) { if (e.name === 'AbortError') return; } }
  download(blob, name); toast(fallbackMsg);
}
async function saveEntry(f) {
  const m = media[f.key];
  if (m?.video) { download(m.video, `pascap-${nm(f.who)}-${f.id}.${m.video.type.includes('mp4') ? 'mp4' : 'webm'}`); toast('Vidéo enregistrée. Ton pote ne s\u2019en remettra pas.'); }
  else { const b = await makeStory(f, null, nm(f.who)); download(b, `pascap-${nm(f.who)}.png`); toast('Image enregistrée (vidéo simulée en démo).'); }
}
async function shareEntry(f) {
  const m = media[f.key];
  const b = await makeStory(f, m?.sticker || null, nm(f.who));
  shareFile(b, 'pascap-story.png', 'Story 9:16 téléchargée, prête pour Insta / TikTok / Snap.');
}
async function loadStickers() {
  const items = [];
  S.stickers.forEach(s => { const m = media[s.key]; if (m?.sticker) items.push({ blob: m.sticker, name: 'sticker.png', label: 'Ton sticker' }); if (m?.gif) items.push({ blob: m.gif, name: 'pascap.gif', label: 'Boomerang ralenti' }); });
  const demo = await demoStickers();
  demo.forEach(d => items.push(d));
  const sg = $('#sg'); if (!sg) return;
  sg.innerHTML = items.map((it, i) => `<div class="it"><img src="${URL.createObjectURL(it.blob)}"><span class="small">${it.label}</span><div class="row" style="width:100%;gap:6px"><button class="btn sm cream" data-dl="${i}" style="padding:8px">${ICON.download}</button><button class="btn sm green" data-wa="${i}" style="padding:8px">${ICON.whatsapp}</button></div></div>`).join('');
  sg.querySelectorAll('[data-dl]').forEach(b => b.onclick = () => download(items[b.dataset.dl].blob, items[b.dataset.dl].name));
  sg.querySelectorAll('[data-wa]').forEach(b => b.onclick = () => shareFile(items[b.dataset.wa].blob, items[b.dataset.wa].name, 'Sticker téléchargé : ajoute-le dans WhatsApp.'));
}
function tProfil() {
  const g = gradeOf(S.done.me), ng = nextGrade(S.done.me);
  $('#tabc').innerHTML = `<div class="row" style="gap:16px">${capiSVG({ size: 84, crowned: S.plus })}<div><div class="h1" style="font-size:38px">${nm('me')}</div><span class="grade" style="background:var(--mustard)">${g.name}</span></div></div>
    <div class="card" style="padding:14px;margin-top:18px"><div class="row" style="justify-content:space-between"><b>${S.done.me} défis réussis</b><span class="small">${ng ? `${ng.min - S.done.me} avant ${ng.name}` : 'Grade max'}</span></div>
    <div style="height:10px;border:2px solid var(--ink);border-radius:3px;margin-top:10px;overflow:hidden"><i style="display:block;height:100%;background:var(--tomato);width:${ng ? (S.done.me - g.min) / (ng.min - g.min) * 100 : 100}%"></i></div></div>
    <div class="sect"><div class="h3">Grades</div><div class="row" style="flex-wrap:wrap;gap:6px">${GRADES.map(x => `<span class="grade" style="${S.done.me >= x.min ? 'background:var(--ink);color:var(--cream)' : 'opacity:.45'}">${x.name} · ${x.min}</span>`).join('')}</div></div>
    <div class="sect"><div class="h3">Classement</div>${rankHTML(false)}</div>
    <div class="sect"><button class="btn sm cream" id="addf">${ICON.people} Ajouter des amis</button></div>
    <div class="sect">${S.plus ? `<p class="small">Pas Cap+ actif · ${S.jokers} jokers</p>` : `<button class="btn sm mustard" id="pw">${ICON.crown} Pas Cap+ · 2,99 €/mois</button>`}</div>
    <div class="sect"><button class="btn sm cream" id="snd">Sons : ${S.sound === false ? 'coupés' : 'activés'}</button></div>
    <button class="link" id="reset" style="margin-top:12px">Réinitialiser la démo</button>`;
  $('#snd').onclick = () => { S.sound = S.sound === false; save(); sfx('cap'); tProfil(); };
  $('#addf').onclick = () => navigator.share ? navigator.share({ text: "T'es pas cap de me rejoindre sur Pas Cap ? Code CAP-4X9" }).catch(() => { }) : toast('Lien d\u2019invitation copié (simulé)');
  $('#pw') && ($('#pw').onclick = () => paywall(vMain));
  $('#reset').onclick = () => { localStorage.removeItem('pascap'); S = fresh(); render(); };
}

// ---------- WRAPPED ----------
function wrapped() {
  // complète les défis restants (simulés) pour le verdict
  S.session.drops.filter(d => d.status === 'pending' || d.status === 'ringing').forEach(d => {
    const who = d.who === 'me' ? FRIENDS[irnd(0, 2)] : d.who; const df = byId[d.id];
    const dur = irnd(df.min, df.max), resp = Math.random() < .3 ? irnd(240, 420) : irnd(12, 140);
    addEntry({ who, id: d.id, dur, resp, score: df.score === 'reps' ? Math.round(dur * rnd(.8, 1.5)) : df.score === 'secs' ? dur - 2 : 0, sim: true }); d.status = 'done';
  });
  save();
  const F = S.feed, ids = ['me', ...FRIENDS];
  const cnt = id => F.filter(f => f.who === id).length;
  const most = [...ids].sort((a, b) => cnt(b) - cnt(a))[0];
  const fast = [...F].sort((a, b) => a.resp - b.resp)[0], slow = [...F].sort((a, b) => b.resp - a.resp)[0];
  const rec = [...F].filter(f => byId[f.id].score === 'reps').sort((a, b) => b.score - a.score)[0];
  const pod = [...ids].sort((a, b) => S.points[b] - S.points[a]);
  const slides = [
    ['var(--ink)', 'var(--cream)', `<div class="h1" style="font-size:64px">${S.hours} h.<br>${F.length} défis.<br>4 potes.</div><p class="lead" style="margin-top:20px">Voici le verdict.</p><div class="grow"></div>${capiSVG({ size: 120, cls: 'bounce' })}`],
    ['var(--mustard)', 'var(--ink)', `<div class="h1">Le podium</div><div class="podium">${[pod[1], pod[0], pod[2]].map((id, i) => `<div style="height:${[150, 220, 110][i]}px;background:${PEOPLE[id].color};color:${PEOPLE[id].fg}">${av(id, 'lg')}<span style="margin-top:6px">${nm(id)}</span><span style="font-size:16px">${S.points[id]} pts</span></div>`).join('')}</div>`],
    ['var(--cream)', 'var(--ink)', `<div class="h1">Les badges</div>
      ${[[ICON.flame, 'Le plus cap', `${nm(most)} · ${cnt(most)} défis`], [ICON.bolt, 'Éclair', `${nm(fast.who)} · ${fmtS(fast.resp)}`], [ICON.chicken, 'Poule mouillée', `${nm(slow.who)} · ${fmtS(slow.resp)} de sonnerie`], rec ? [ICON.trophy, 'Record', `${nm(rec.who)} · ${rec.score} ${byId[rec.id].t.toLowerCase()}`] : null].filter(Boolean).map(([ic, t, s], i) => `<div class="perk pop" style="animation-delay:${i * .2}s">${ic}<div><b class="h3">${t}</b><p>${s}</p></div></div>`).join('')}`],
    ['var(--tomato)', 'var(--cream)', `<div class="h1">On était cap.<br>Et toi ?</div><div class="grow" style="display:grid;place-items:center">${capiSVG({ size: 150, crowned: true })}</div>
      <div class="row"><button class="btn cream" id="wsave">${ICON.download} Enregistrer</button><button class="btn" id="wshare">${ICON.share} Partager</button></div><button class="link" id="again" style="color:var(--cream)">Rejouer une session</button>`],
  ];
  let k = 0, auto;
  const show = () => {
    const [bg, fg, html] = slides[k];
    overlay.innerHTML = `<div class="wr" style="background:${bg};color:${fg}"><div class="bars">${slides.map((_, i) => `<i class="${i <= k ? 'on' : ''}"></i>`).join('')}</div>${html}<button class="link" id="wx" style="position:absolute;top:14px;right:10px;color:${fg}">Fermer</button></div>`;
    $('#wx').onclick = e => { e.stopPropagation(); clearTimeout(auto); overlay.innerHTML = ''; vMain(); };
    const wr = overlay.querySelector('.wr');
    wr.onclick = e => { if (e.target.closest('button')) return; clearTimeout(auto); k = e.clientX - wr.getBoundingClientRect().left < 100 ? Math.max(0, k - 1) : Math.min(slides.length - 1, k + 1); show(); };
    if (k === slides.length - 1) {
      const mk = () => makeStory({ wrapped: true, pod: pod.map(id => [nm(id), S.points[id]]) }, null, '');
      $('#wsave').onclick = async () => download(await mk(), 'pascap-verdict.png');
      $('#wshare').onclick = async () => shareFile(await mk(), 'pascap-verdict.png', 'Carte story téléchargée.');
      $('#again').onclick = () => { overlay.innerHTML = ''; Object.assign(S, { order: shuffle(DEFIS.map(d => d.id)), idx: 0, mine: {}, fprog: { lea: 0, yanis: 0, ines: 0 }, feed: [], points: { me: 0, lea: 0, yanis: 0, ines: 0 } }); go('settings'); };
    } else auto = setTimeout(() => { k++; show(); }, 4200);
  };
  show();
}

function render() {
  overlay.innerHTML = '';
  ({ onboarding: vOnboarding, name: vName, paywall0: () => { vBand(); paywall(); }, band: vBand, settings: vSettings, swipe: vSwipe, reveal: vReveal, main: vMain })[S.step]();
  if (S.step === 'paywall0') S.step = 'band';
  enter(screen.firstElementChild);
}
document.fonts.ready.then(render);
