import { GIFEncoder, quantize, applyPalette } from '../vendor/gifenc.esm.js';
import { capiImage } from './capi.js';
import { byId, CATS } from './data.js';

const INK = '#1A1714', CREAM = '#F3EDE2', MUSTARD = '#E3A72F', TOMATO = '#D9502F';
const toBlob = (c, t = 'image/png') => new Promise(r => c.toBlob(r, t));

function stickerShape(x, w, h, r) {
  x.beginPath();
  x.moveTo(r, 0); x.lineTo(w - r * 1.4, 4); x.quadraticCurveTo(w, 0, w - 6, r);
  x.lineTo(w - 2, h - r); x.quadraticCurveTo(w, h, w - r, h - 4);
  x.lineTo(r * 1.2, h); x.quadraticCurveTo(0, h, 4, h - r);
  x.lineTo(0, r * 1.3); x.quadraticCurveTo(0, 0, r, 0); x.closePath();
}
export function caption(x, text, cx, cy, size, rot = -0.06) {
  x.save(); x.translate(cx, cy); x.rotate(rot);
  x.font = `${size}px Anton`; const w = x.measureText(text).width + size * .8, h = size * 1.35;
  x.fillStyle = INK; x.fillRect(-w / 2 + 5, -h / 2 + 5, w, h);
  x.fillStyle = MUSTARD; x.fillRect(-w / 2, -h / 2, w, h);
  x.strokeStyle = INK; x.lineWidth = 4; x.strokeRect(-w / 2, -h / 2, w, h);
  x.fillStyle = INK; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(text, 0, 2);
  x.restore();
}

export async function makeSticker(src, cap) {
  const c = document.createElement('canvas'); c.width = c.height = 512; const x = c.getContext('2d');
  x.translate(256, 240); x.rotate(-0.05); x.translate(-200, -200);
  x.save(); stickerShape(x, 400, 400, 60); x.fillStyle = '#fff'; x.shadowColor = 'rgba(0,0,0,.25)'; x.shadowOffsetY = 6; x.shadowBlur = 0; x.fill(); x.restore();
  x.save(); x.translate(16, 16); stickerShape(x, 368, 368, 50); x.clip(); x.drawImage(src, 0, 0, 368, 368); x.restore();
  x.setTransform(1, 0, 0, 1, 0, 0);
  caption(x, cap, 256, 448, 50);
  return toBlob(c);
}

export async function makeGif(frames, size, cap, delay = 90) {
  const gif = GIFEncoder();
  const seq = [...frames, ...frames.slice(1, -1).reverse()];
  const c = document.createElement('canvas'); c.width = c.height = size; const x = c.getContext('2d', { willReadFrequently: true });
  for (const f of seq) {
    x.putImageData(new ImageData(new Uint8ClampedArray(f), size, size), 0, 0);
    caption(x, cap, size / 2, size - 30, 26);
    const data = x.getImageData(0, 0, size, size).data;
    const pal = quantize(data, 128); const idx = applyPalette(data, pal);
    gif.writeFrame(idx, size, size, { palette: pal, delay });
  }
  gif.finish();
  return new Blob([gif.bytes()], { type: 'image/gif' });
}

let demoCache;
export async function demoStickers() {
  if (demoCache) return demoCache;
  const out = [];
  const moods = [['smile', 'CAP !'], ['scream', 'AU SECOURS'], ['wink', 'PAS CAP ?'], ['cry', 'POULE MOUILLÉE'], ['smile', 'LÉGENDE', true], ['scream', 'ÇA SONNE']];
  const bgs = ['#E9A9B4', '#2747A3', '#E3A72F', '#9C8AC9', '#2E6B4E', '#D9502F'];
  for (let i = 0; i < moods.length; i++) {
    const [mood, cap, crowned] = moods[i];
    const img = await capiImage({ mood, crowned });
    const src = document.createElement('canvas'); src.width = src.height = 400; const s = src.getContext('2d');
    s.fillStyle = bgs[i]; s.fillRect(0, 0, 400, 400); s.drawImage(img, 90, 40, 220, 300);
    out.push({ blob: await makeSticker(src, cap), name: `capi-${i}.png`, label: 'Capi' });
  }
  // GIF Capi qui saute
  const img = await capiImage({ mood: 'scream' });
  const size = 200, frames = [];
  const c = document.createElement('canvas'); c.width = c.height = size; const x = c.getContext('2d', { willReadFrequently: true });
  for (let k = 0; k < 12; k++) {
    x.fillStyle = '#E3A72F'; x.fillRect(0, 0, size, size);
    const y = 40 - Math.abs(Math.sin(k / 12 * Math.PI)) * 34;
    x.drawImage(img, 55, y, 90, 108);
    frames.push(x.getImageData(0, 0, size, size).data);
  }
  out.push({ blob: await makeGif(frames, size, 'ÇA SONNE'), name: 'capi.gif', label: 'GIF Capi' });
  demoCache = out; return out;
}

export async function makeStory(f, stickerBlob, who) {
  const c = document.createElement('canvas'); c.width = 1080; c.height = 1920; const x = c.getContext('2d');
  x.fillStyle = CREAM; x.fillRect(0, 0, 1080, 1920);
  x.fillStyle = INK; x.font = '150px Anton'; x.textAlign = 'center';
  x.fillText("T'ES PAS CAP ?", 540, 250);
  if (f.wrapped) {
    x.font = '110px Anton'; x.fillText('LE VERDICT', 540, 470);
    f.pod.forEach(([n, p], i) => { x.font = `${i ? 80 : 110}px Anton`; x.fillText(`${i + 1}. ${n.toUpperCase()} · ${p} PTS`, 540, 700 + i * 170); });
  } else {
    const df = byId[f.id], cat = CATS[df.cat];
    if (stickerBlob) { const im = await createImageBitmap(stickerBlob); x.drawImage(im, 140, 380, 800, 800); }
    else { x.fillStyle = cat.bg; x.fillRect(190, 420, 700, 700); x.strokeStyle = INK; x.lineWidth = 8; x.strokeRect(190, 420, 700, 700); const im = await capiImage({ mood: 'scream' }); x.drawImage(im, 340, 520, 400, 480); }
    x.fillStyle = INK; x.font = '90px Anton';
    const words = df.t.toUpperCase().split(' '); let line = '', y = 1330;
    for (const w of words) { if (x.measureText(line + w).width > 920) { x.fillText(line.trim(), 540, y); line = ''; y += 100; } line += w + ' '; }
    x.fillText(line.trim(), 540, y);
    x.font = '600 52px Archivo'; x.fillText(`${who} · ${f.dur} s · réponse en ${Math.round(f.resp)} s`, 540, y + 100);
  }
  const im = await capiImage({}); x.drawImage(im, 440, 1600, 200, 240);
  x.font = '48px Anton'; x.fillStyle = TOMATO; x.fillText('PAS CAP · L\u2019APP DE DÉFIS ENTRE POTES', 540, 1885);
  return toBlob(c);
}
