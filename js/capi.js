// Capi : petite flamme dessinée à la main, aplat tomate, contour encre.
const INK = '#1A1714';
const TOMATO = '#D9502F';
const MUSTARD = '#E3A72F';
const CREAM = '#F3EDE2';

const BODY = 'M50 5 C58 20 77 30 82 52 C88 80 74 112 50 113 C25 114 13 93 16 70 C18 55 26 47 31 34 C35 45 39 49 44 50 C40 32 43 17 50 5 Z';
const INNER = 'M51 52 C60 63 67 73 67 87 C67 100 59 107 50 107 C40 107 33 100 33 89 C33 77 44 70 51 52 Z';

function eyes(mood) {
  if (mood === 'scream') {
    return `<g stroke="${INK}" stroke-width="3" fill="${CREAM}">
      <circle cx="39" cy="72" r="9"/><circle cx="62" cy="72" r="9"/></g>
      <circle cx="39" cy="72" r="2.6" fill="${INK}"/><circle cx="62" cy="72" r="2.6" fill="${INK}"/>`;
  }
  if (mood === 'wink') {
    return `<g stroke="${INK}" stroke-width="3" fill="${CREAM}"><circle cx="39" cy="73" r="8"/></g>
      <circle cx="40.5" cy="74" r="3.6" fill="${INK}"/>
      <path d="M55 73 Q62 68 69 73" fill="none" stroke="${INK}" stroke-width="3.2" stroke-linecap="round"/>`;
  }
  if (mood === 'cry') {
    return `<g stroke="${INK}" stroke-width="3" fill="${CREAM}">
      <circle cx="39" cy="73" r="8"/><circle cx="61" cy="73" r="8"/></g>
      <circle cx="39" cy="76" r="3.4" fill="${INK}"/><circle cx="61" cy="76" r="3.4" fill="${INK}"/>
      <path d="M33 64 L44 67 M67 64 L56 67" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
      <path d="M64 83 C61 89 61 93 64 94 C67 93 67 89 64 83 Z" fill="#2747A3" stroke="${INK}" stroke-width="2"/>`;
  }
  return `<g stroke="${INK}" stroke-width="3" fill="${CREAM}">
    <circle cx="39" cy="73" r="8"/><circle cx="61" cy="73" r="8"/></g>
    <circle cx="41" cy="74" r="3.6" fill="${INK}"/><circle cx="63" cy="74" r="3.6" fill="${INK}"/>`;
}

function mouth(mood) {
  if (mood === 'scream') return `<path d="M42 88 C42 82 58 82 58 88 L57 101 C55 106 45 106 43 101 Z" fill="${INK}"/><path d="M45 101 C47 97 53 97 55 101" fill="${TOMATO}"/>`;
  if (mood === 'cry') return `<path d="M43 97 Q50 91 57 97" fill="none" stroke="${INK}" stroke-width="3.2" stroke-linecap="round"/>`;
  return `<path d="M41 91 Q51 99 60 88" fill="none" stroke="${INK}" stroke-width="3.2" stroke-linecap="round"/>`;
}

function crown() {
  return `<path d="M33 9 L38 -6 L45 4 L50 -9 L55 4 L62 -6 L67 9 Z" fill="${MUSTARD}" stroke="${INK}" stroke-width="3" stroke-linejoin="round" transform="translate(0 6)"/>`;
}

export function capiSVG({ size = 120, mood = 'smile', crowned = false, cls = '' } = {}) {
  const top = crowned ? -14 : 0;
  return `<svg class="capi ${cls}" width="${size}" height="${size * 1.2}" viewBox="0 ${top} 100 ${120 - top}" xmlns="http://www.w3.org/2000/svg" aria-label="Capi">
    <path d="${BODY}" fill="${TOMATO}" stroke="${INK}" stroke-width="3.2" stroke-linejoin="round" transform="translate(2.5 2.5)" opacity="0"/>
    <path d="${BODY}" fill="${TOMATO}" stroke="${INK}" stroke-width="3.2" stroke-linejoin="round"/>
    <path d="${INNER}" fill="${MUSTARD}" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/>
    <path d="M30 40 C28 46 26 50 24 56" stroke="${CREAM}" stroke-width="3" stroke-linecap="round" fill="none" opacity=".75"/>
    ${eyes(mood)}${mouth(mood)}${crowned ? crown() : ''}
  </svg>`;
}

export function capiImage(opts) {
  return new Promise(res => {
    const img = new Image();
    const svg = capiSVG({ size: 200, ...opts });
    img.onload = () => res(img);
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  });
}
