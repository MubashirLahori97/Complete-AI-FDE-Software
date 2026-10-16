export const visualAccents = {
  violet: { name: 'Violet', color: '#7564db', pale: '#eeeafd' },
  teal: { name: 'Teal', color: '#147d80', pale: '#ddf3ed' },
  coral: { name: 'Coral', color: '#b84a35', pale: '#ffede5' },
} as const;
export type VisualAccent = keyof typeof visualAccents;
export type PageFocus = 'heading' | 'area' | 'contact';
export const escapeHtml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (character) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]!,
  );
export function websiteDocument({
  title,
  accent,
  size,
  rule,
  channel = '',
  showArea = true,
  focus,
  interactionGate = false,
}: {
  title: string;
  accent: VisualAccent;
  size: number;
  rule: boolean;
  channel?: string;
  showArea?: boolean;
  focus?: PageFocus;
  interactionGate?: boolean;
}) {
  const palette = visualAccents[accent] || visualAccents.violet;
  const fontSize = Number.isFinite(size) ? Math.min(38, Math.max(22, size)) : 30;
  const safeChannel = JSON.stringify(channel).replace(/</g, '\\u003c');
  const focusSelector =
    focus === 'heading'
      ? 'h1'
      : focus === 'area'
        ? '#service-area'
        : focus === 'contact'
          ? '#contact'
          : '';
  const focusStyle = focusSelector
    ? `${focusSelector}{outline:2px dashed ${palette.color};outline-offset:5px;border-radius:4px}`
    : '';
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>My service website</title><style>
*{box-sizing:border-box}body{margin:0;color:#24293d;background:#fffaf0;font:15px/1.6 system-ui,sans-serif}main{padding:27px 25px 20px;min-height:330px}.brand{display:flex;align-items:center;gap:9px;font-size:11px;letter-spacing:.1em;font-weight:750}.mark{width:23px;height:23px;display:grid;place-items:center;border-radius:7px;background:${palette.color};color:white}.label{font-size:9px;letter-spacing:.15em;color:#716b60;margin:27px 0 12px}h1{color:${palette.color};font-size:${fontSize}px;line-height:1.12;letter-spacing:-.04em;margin:0 0 15px;overflow-wrap:anywhere;max-width:17ch;min-height:72px}p{font-size:12px;color:#686555;margin:11px 0}.services{display:flex;gap:6px;flex-wrap:wrap;margin:17px 0}.services span{padding:4px 8px;background:${palette.pale};border-radius:6px;font-size:9px;color:#3d4145}button{border:0;border-radius:8px;padding:11px 19px;color:white;background:${palette.color};font:600 12px system-ui;cursor:pointer;min-height:40px}button:focus-visible{outline:3px solid #292b40;outline-offset:4px}#details{font-size:12px;padding:12px;background:${palette.pale};border-radius:8px;margin-top:14px;color:#303849}#details[hidden]{display:none}footer{font-size:9px;margin-top:20px;border-top:1px solid #e2dccd;padding-top:12px;color:#77705e}@media(max-width:350px){main{padding:22px 18px}h1{font-size:${Math.min(fontSize, 32)}px}}
main{padding-top:22px}.label{margin-top:18px}h1{min-height:62px;margin-bottom:12px;font-size:${fontSize}px}.services{margin:12px 0}#details:not([hidden])+footer{display:none}
button:disabled{opacity:.6;cursor:wait}${focusStyle}
</style></head><body><main><div class="brand"><span class="mark" aria-hidden="true">↗</span>FIX & CO.</div><div class="label">YOUR LOCAL REPAIR SERVICE</div><h1>${escapeHtml(title.slice(0, 70)) || 'Your page title'}</h1><p>Appliance repairs${showArea ? ' <span id="service-area">in the North district.</span>' : '.'}<br>Monday–Friday · 9–5</p><div class="services"><span>Small repairs</span><span>Home visits</span><span>Clear estimates</span></div><button id="contact" type="button" aria-expanded="false" aria-controls="details"${interactionGate ? ' disabled' : ''}>Contact</button><div id="details" hidden>Call 0300 000 0000<br><small>Fictional contact details for this example.</small></div><footer>A small page with one useful purpose.</footer></main><script>
const button=document.querySelector('#contact');const details=document.querySelector('#details');const hasRule=${rule};const channel=${safeChannel};
function reportHeight(){if(channel)parent.postMessage({type:'fde-visual-height',channel,height:Math.ceil(document.body.getBoundingClientRect().height)},'*');}
button.addEventListener('click',()=>{if(hasRule){details.hidden=!details.hidden;button.setAttribute('aria-expanded',String(!details.hidden));}if(channel)parent.postMessage({type:'fde-visual-click',channel,open:!details.hidden,hasRule},'*');reportHeight();});
${channel ? `reportHeight();window.addEventListener('resize',reportHeight);window.addEventListener('message',event=>{if(event.source!==parent||event.data?.channel!==channel)return;if(event.data.type==='fde-visual-measure')reportHeight();if(event.data.type==='fde-visual-enable'&&${interactionGate}){button.disabled=false;parent.postMessage({type:'fde-visual-ready',channel},'*');}});` : ''}
</script></body></html>`;
}

export function transferPoint(progress: number) {
  const t = Math.max(0, Math.min(1, progress / 100));
  // A cubic curve shared by the SVG wire and its draggable-time packet.
  const x =
    (1 - t) ** 3 * 12 + 3 * (1 - t) ** 2 * t * 60 + 3 * (1 - t) * t * t * 120 + t ** 3 * 178;
  const y = (1 - t) ** 3 * 75 + 3 * (1 - t) ** 2 * t * 12 + 3 * (1 - t) * t * t * 138 + t ** 3 * 75;
  return { x, y };
}
