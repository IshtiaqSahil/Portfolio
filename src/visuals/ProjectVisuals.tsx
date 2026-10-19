import type { CSSProperties, ReactNode } from 'react';
import type { ProjectId } from '../content';

// Illustrations drawn in code for each project. Replace any of them with a real
// screenshot by swapping the component for an <img className="h-full w-full object-cover" />.

const MONO = 'ui-monospace, "Cascadia Code", Consolas, monospace';

function Frame({ accent, children, style }: { accent: string; children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      className="relative flex h-full w-full items-center justify-center overflow-hidden"
      style={{
        background: `radial-gradient(120% 90% at 70% 10%, ${accent}26, transparent 60%), #111214`,
        ...style,
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,.09) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
          maskImage: 'radial-gradient(80% 80% at 50% 50%, #000 40%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(80% 80% at 50% 50%, #000 40%, transparent 100%)',
        }}
      />
      {children}
    </div>
  );
}

function ArgusVisual({ accent }: { accent: string }) {
  const nodes = Array.from({ length: 7 }, (_, i) => 52 + i * 56);
  const docs = [
    { y: 104, label: 'SI', out: 156 },
    { y: 240, label: 'BL', out: 292 },
  ];
  return (
    <Frame accent={accent}>
      <svg viewBox="0 0 560 440" className="relative h-full w-full p-[6%]" role="img" aria-label="Two documents feed seven agents that converge on a confidence gate">
        {docs.map(d => (
          <g key={d.label}>
            <rect x={24} y={d.y} width={90} height={104} rx={8} fill="rgba(255,255,255,.04)" stroke="rgba(215,226,234,.25)" />
            {[22, 36, 50, 64, 78].map((o, i) => (
              <line key={o} x1={38} x2={i % 2 ? 84 : 100} y1={d.y + o + 8} y2={d.y + o + 8} stroke="rgba(255,255,255,.18)" strokeWidth={3} strokeLinecap="round" />
            ))}
            <text x={38} y={d.y + 22} fill="#D7E2EA" fontSize={15} fontWeight={600} fontFamily={MONO}>{d.label}</text>
          </g>
        ))}
        {nodes.map((y, i) => (
          <g key={y}>
            {docs.map(d => (
              <path key={d.label} id={`ag-${d.label}-${i}`} d={`M114 ${d.out} C 190 ${d.out}, 190 ${y}, 258 ${y}`} fill="none" stroke={accent} strokeOpacity={d.label === 'SI' ? 0.5 : 0.3} strokeWidth={1.2} />
            ))}
            <path id={`ag-m-${i}`} d={`M282 ${y} C 350 ${y}, 350 220, 380 220`} fill="none" stroke={accent} strokeOpacity={0.55} strokeWidth={1.2} />
            <circle cx={270} cy={y} r={12} fill="#111214" stroke={accent} strokeWidth={1.4} />
            <circle cx={270} cy={y} r={3.5} fill={accent} />
          </g>
        ))}
        {[0, 2, 4, 6].map((i, k) =>
          [`ag-${k % 2 ? 'BL' : 'SI'}-${i}`, `ag-m-${i}`].map((id, j) => (
            <circle key={id} r={2.6} fill={accent}>
              <animateMotion dur="2.4s" repeatCount="indefinite" begin={`${k * 0.55 + j * 1.2}s`}>
                <mpath href={`#${id}`} />
              </animateMotion>
            </circle>
          )),
        )}
        {[44, 32, 21].map((r, i) => (
          <circle key={r} cx={420} cy={220} r={r} fill="none" stroke={accent} strokeOpacity={[0.3, 0.55, 0.9][i]} strokeWidth={1.2} />
        ))}
        {[0, 1.1].map(b => (
          <circle key={b} cx={420} cy={220} r={12} fill="none" stroke={accent}>
            <animate attributeName="r" values="12;56" dur="2.2s" begin={`${b}s`} repeatCount="indefinite" />
            <animate attributeName="stroke-opacity" values=".8;0" dur="2.2s" begin={`${b}s`} repeatCount="indefinite" />
          </circle>
        ))}
        <circle cx={420} cy={220} r={9} fill={accent} />
        <text x={420} y={290} textAnchor="middle" fill="rgba(215,226,234,.6)" fontSize={11} fontFamily={MONO} letterSpacing={1.5}>CONFIDENCE GATE</text>
        <path d="M464 220 L 506 220" stroke={accent} strokeWidth={1.6} />
        <circle cx={522} cy={220} r={16} fill={accent} />
        <path d="M514 220 l6 6 l10 -12" fill="none" stroke="#0C0C0C" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
        <text x={420} y={372} textAnchor="middle" fill="#D7E2EA" fontSize={34} fontWeight={900} fontFamily="Kanit, sans-serif">1.0000</text>
      </svg>
    </Frame>
  );
}

function VerityVisual({ accent }: { accent: string }) {
  const card = 'rounded-xl border border-[#D7E2EA]/20 bg-[#0e141c]/80';
  const label = 'text-[0.6rem] uppercase tracking-[0.12em] text-[#D7E2EA]/50';
  return (
    <Frame accent={accent}>
      <div className="relative grid w-[86%] max-w-[460px] gap-3" style={{ fontFamily: MONO }}>
        <div className={`${card} grid gap-1.5 p-3.5`}>
          <span className={label}>agent under test</span>
          <b className="text-base text-[#D7E2EA]">support-bot-v2</b>
          <div className="flex gap-1.5">
            {['EN', '中文', '日本語'].map(l => (
              <span key={l} className="rounded-md px-2 py-1 text-[0.65rem]" style={{ background: `${accent}24`, color: accent }}>{l}</span>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2.5">
          {[['A', 0.92], ['B', 0.88], ['C', 0.95]].map(([j, v]) => (
            <div key={j} className={`${card} grid gap-2 p-3`}>
              <span className={label}>Judge {j}</span>
              <div className="h-1 overflow-hidden rounded bg-white/10">
                <div className="h-full" style={{ width: `${(v as number) * 100}%`, background: accent }} />
              </div>
              <b className="text-xl text-[#D7E2EA]" style={{ fontFamily: 'Kanit, sans-serif' }}>{Math.round((v as number) * 100)}</b>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between rounded-xl border p-3" style={{ borderColor: `${accent}80`, background: `${accent}1a` }}>
          <span className={label}>consensus</span>
          <b className="flex items-center gap-2 text-sm" style={{ color: accent }}>
            <span className="grid h-5 w-5 place-items-center rounded-full text-[0.65rem] text-[#0C0C0C]" style={{ background: accent }}>✓</span>
            Certified
          </b>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {['0x8f3a…c21', '0x1b77…e90', '0x4d0e…a5f'].map((h, i) => (
            <div key={h} className={`${card} grid gap-1 p-2`} style={i === 2 ? { borderColor: accent, boxShadow: `0 0 24px -6px ${accent}` } : undefined}>
              <span className={label}>{i === 2 ? 'Sui cert' : 'Sui'}</span>
              <code className="truncate text-[0.6rem] text-[#D7E2EA]">{h}</code>
            </div>
          ))}
          <div className={`${card} grid gap-1 border-dashed p-2`}>
            <span className={label}>Walrus</span>
            <code className="truncate text-[0.6rem] text-[#D7E2EA]">evidence</code>
          </div>
        </div>
      </div>
    </Frame>
  );
}

function HelixVisual({ accent }: { accent: string }) {
  const players = [150, 220, 290];
  const servers = [
    { y: 70, name: 'Hub', sub: 'LOBBY' },
    { y: 186, name: 'Survival 1', sub: 'RUST-STYLE' },
    { y: 302, name: 'Survival 2', sub: 'RUST-STYLE' },
  ];
  return (
    <Frame accent={accent}>
      <svg viewBox="0 0 540 440" className="relative h-full w-full p-[5%]" role="img" aria-label="Players connect through a Velocity proxy to a hub and two survival servers" fontFamily={MONO}>
        {players.map((y, i) => (
          <path key={y} id={`hx-i-${i}`} d={`M70 ${y} C 105 ${y}, 105 220, 140 220`} fill="none" stroke={accent} strokeOpacity={0.4} strokeWidth={1.4} />
        ))}
        {servers.map((s, i) => (
          <path key={s.y} id={`hx-o-${i}`} d={`M250 220 C 300 220, 300 ${s.y + 34}, 350 ${s.y + 34}`} fill="none" stroke={accent} strokeOpacity={0.4} strokeWidth={1.4} />
        ))}
        {players.map(y => (
          <g key={y}>
            <circle cx={52} cy={y} r={18} fill="rgba(255,255,255,.06)" stroke="rgba(215,226,234,.25)" />
            <rect x={46} y={y - 9} width={12} height={12} fill="#8b939c" />
            <rect x={44} y={y + 4} width={16} height={7} fill="#8b939c" opacity={0.6} />
          </g>
        ))}
        <text x={52} y={336} textAnchor="middle" fill="rgba(215,226,234,.5)" fontSize={10}>PLAYERS</text>
        <rect x={140} y={186} width={110} height={68} rx={10} fill="#0c1513" stroke={accent} />
        <rect x={154} y={200} width={8} height={8} fill={accent} />
        <text x={154} y={228} fill="#D7E2EA" fontSize={13}>Velocity</text>
        <text x={154} y={244} fill="rgba(215,226,234,.5)" fontSize={9.5}>PROXY</text>
        {servers.map(s => (
          <g key={s.y}>
            <rect x={350} y={s.y} width={150} height={68} rx={10} fill="#0c1513" stroke="rgba(215,226,234,.25)" />
            {[0, 1, 2].map(k => (
              <rect key={k} x={476 - k * 11} y={s.y + 14} width={7} height={7} fill={accent} opacity={1 - k * 0.3} />
            ))}
            <text x={366} y={s.y + 32} fill="#D7E2EA" fontSize={13}>{s.name}</text>
            <text x={366} y={s.y + 50} fill="rgba(215,226,234,.5)" fontSize={9.5}>{s.sub}</text>
          </g>
        ))}
        {[{ x: 140, t: 'HelixSpawn', w: 104 }, { x: 260, t: 'LoopManager', w: 112 }].map(p => (
          <g key={p.t}>
            <rect x={p.x} y={396} width={p.w} height={26} rx={13} fill={`${accent}29`} stroke={accent} strokeOpacity={0.6} />
            <text x={p.x + 12} y={413} fill={accent} fontSize={11}>{p.t}</text>
          </g>
        ))}
        {[...players.map((_, i) => `hx-i-${i}`), ...servers.map((_, i) => `hx-o-${i}`)].map((id, k) => (
          <circle key={id} r={3} fill={accent}>
            <animateMotion dur="1.8s" repeatCount="indefinite" begin={`${k * 0.45}s`}>
              <mpath href={`#${id}`} />
            </animateMotion>
          </circle>
        ))}
      </svg>
    </Frame>
  );
}

function SpotifyVisual({ accent }: { accent: string }) {
  return (
    <div className="relative h-full w-full overflow-hidden" style={{ background: 'linear-gradient(#6aa6ff 0%, #9cc4ff 45%, #cfe3ff 62%)', imageRendering: 'pixelated' }}>
      <div className="absolute right-[16%] top-[12%] aspect-square w-[11%]" style={{ background: '#fff6c8', boxShadow: '0 0 0 6px rgba(255,246,200,.35), 0 0 60px 20px rgba(255,246,200,.5)' }} />
      <div className="absolute left-[8%] top-[18%] h-[6%] w-[22%] bg-white/90" style={{ animation: 'cloud 60s linear infinite' }} />
      <div className="absolute left-[55%] top-[30%] h-[5%] w-[16%] bg-white/90" style={{ animation: 'cloud 80s linear infinite -30s' }} />
      <div
        className="absolute inset-x-0 bottom-[30%] h-[22%]"
        style={{
          background: '#4f8040',
          clipPath: 'polygon(0 60%, 8% 60%, 8% 40%, 18% 40%, 18% 20%, 26% 20%, 26% 45%, 38% 45%, 38% 30%, 50% 30%, 50% 55%, 62% 55%, 62% 25%, 70% 25%, 70% 10%, 78% 10%, 78% 35%, 90% 35%, 90% 50%, 100% 50%, 100% 100%, 0 100%)',
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-[31%]"
        style={{
          background:
            'linear-gradient(#6bb34a 0 14%, transparent 14%), repeating-linear-gradient(90deg, rgba(0,0,0,.08) 0 6.25%, transparent 6.25% 12.5%), repeating-linear-gradient(0deg, rgba(0,0,0,.08) 0 10%, transparent 10% 20%), #8a5a35',
        }}
      />
      <div className="absolute bottom-[6%] left-1/2 flex -translate-x-1/2 gap-0.5 border-2 border-black/60 bg-black/45 p-[3px]">
        {Array.from({ length: 9 }, (_, i) => (
          <i key={i} className={`block aspect-square w-[clamp(12px,2vw,24px)] border-2 ${i === 1 ? 'border-white' : 'border-[#3c3c3c]/70'} bg-[#8c8c8c]/45`} />
        ))}
      </div>
      <div className="absolute left-[6%] top-[7%] flex w-[min(72%,300px)] gap-3 border-2 border-black/60 bg-[#0c0c0c]/80 p-3" style={{ fontFamily: MONO }}>
        <div className="relative grid aspect-square w-[clamp(40px,22%,64px)] flex-none place-items-end p-1.5" style={{ background: `linear-gradient(135deg, ${accent}, #0c6b33 60%, #08331b)` }}>
          <div className="flex h-5 items-end gap-[3px]">
            {[0, -0.3, -0.6, -0.15].map(d => (
              <i key={d} className="block w-1 bg-white" style={{ animation: `eq 1s ease-in-out ${d}s infinite` }} />
            ))}
          </div>
        </div>
        <div className="grid min-w-0 flex-1 gap-1">
          <span className="truncate text-[0.75rem] text-white">Now playing</span>
          <span className="text-[0.65rem] text-[#a7a7a7]">Your Spotify queue</span>
          <div className="mt-1 h-1 bg-white/20"><div className="h-full w-[38%]" style={{ background: accent }} /></div>
          <div className="flex justify-between text-[0.6rem] text-[#a7a7a7]"><span>1:17</span><span>3:24</span></div>
          <div className="flex gap-3 text-[0.75rem] text-white"><span>⏮</span><span style={{ color: accent }}>⏸</span><span>⏭</span></div>
        </div>
      </div>
    </div>
  );
}

function FinanceVisual({ accent }: { accent: string }) {
  const rows: [string, string, string, string][] = [
    ['02 Oct', 'Groceries', '$84.20', accent],
    ['05 Oct', 'Transport', '$32.00', '#ff9f6e'],
    ['09 Oct', 'Bills', '$120.00', '#6ee0c0'],
    ['14 Oct', 'Groceries', '$61.75', accent],
    ['18 Oct', 'Fun', '$45.00', '#ffd36e'],
  ];
  const bars: [string, number, string][] = [['Groc', 0.85, accent], ['Trans', 0.32, '#ff9f6e'], ['Bills', 0.7, '#6ee0c0'], ['Fun', 0.45, '#ffd36e']];
  return (
    <Frame accent={accent}>
      <div className="relative grid w-[88%] max-w-[520px] gap-3" style={{ fontFamily: MONO }}>
        <div className="overflow-hidden rounded-xl border border-[#D7E2EA]/20 bg-[#100d18]/80 text-[0.68rem] text-[#D7E2EA]">
          <div className="grid grid-cols-[0.9fr_1.3fr_1fr] bg-white/5 px-3 py-2 text-[0.58rem] uppercase tracking-[0.1em] text-[#D7E2EA]/50">
            <span>Date</span><span>Category</span><span className="text-right">Amount</span>
          </div>
          {rows.map(([d, c, a, col]) => (
            <div key={d} className="grid grid-cols-[0.9fr_1.3fr_1fr] border-t border-white/10 px-3 py-2">
              <span>{d}</span>
              <span className="flex items-center gap-1.5"><i className="block h-1.5 w-1.5 rounded-sm" style={{ background: col }} />{c}</span>
              <span className="text-right tabular-nums">{a}</span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-[1fr_1.4fr] gap-3">
          <div className="grid content-center gap-1 rounded-xl border border-[#D7E2EA]/20 bg-[#100d18]/80 p-3">
            <span className="text-[0.58rem] uppercase tracking-[0.1em] text-[#D7E2EA]/50">spent</span>
            <b className="text-2xl text-[#D7E2EA]" style={{ fontFamily: 'Kanit, sans-serif' }}>$342.95</b>
          </div>
          <div className="grid h-24 grid-cols-4 items-end gap-2 rounded-xl border border-[#D7E2EA]/20 bg-[#100d18]/80 px-3 pb-2 pt-3">
            {bars.map(([l, h, c]) => (
              <div key={l} className="grid h-full grid-rows-[1fr_auto] items-end gap-1">
                <i className="block rounded-t" style={{ height: `${h * 100}%`, background: c }} />
                <span className="text-center text-[0.5rem] text-[#D7E2EA]/50">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Frame>
  );
}

function ScpVisual({ accent }: { accent: string }) {
  const hazard = 'repeating-linear-gradient(-45deg, #f2c200 0 18px, #141414 18px 36px)';
  const half = (side: 'left' | 'right', word: string) => (
    <div
      className={`absolute bottom-0 top-0 flex w-[50.5%] items-center ${side === 'left' ? 'left-0 justify-end pr-[7%]' : 'right-0 justify-start pl-[7%]'} `}
      style={{
        animation: `${side === 'left' ? 'doorL' : 'doorR'} 7s ease-in-out infinite`,
        background: `${hazard} 0 0 / 100% 22px no-repeat, ${hazard} 0 100% / 100% 22px no-repeat, linear-gradient(90deg, #2a2a2c, #39393c 50%, #2a2a2c)`,
        boxShadow: 'inset 0 0 60px rgba(0,0,0,.6)',
        [side === 'left' ? 'borderRight' : 'borderLeft']: '2px solid #111',
      }}
    >
      <span className="text-[clamp(0.9rem,2vw,1.5rem)] font-black tracking-[0.12em] text-white/15">{word}</span>
    </div>
  );
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#070303]">
      <div className="absolute inset-0 grid place-content-center gap-2 text-center" style={{ background: `radial-gradient(50% 50% at 50% 50%, ${accent}38, transparent 70%)`, color: accent }}>
        <span className="text-[0.65rem] uppercase tracking-[0.3em] opacity-80" style={{ fontFamily: MONO }}>containment cell</span>
        <b className="text-[clamp(2rem,5vw,4rem)] font-black leading-none" style={{ textShadow: `0 0 30px ${accent}99` }}>
          SCP-<span style={{ animation: 'flick 3.2s infinite' }}>███</span>
        </b>
        <span className="text-[0.65rem] uppercase tracking-[0.3em] opacity-80" style={{ fontFamily: MONO }}>breach detected</span>
      </div>
      {half('left', 'SECURE')}
      {half('right', 'CONTAIN')}
      <div className="absolute inset-x-0 top-0 h-2.5" style={{ background: accent, boxShadow: `0 0 40px 10px ${accent}8c`, animation: 'alarm 1.1s infinite' }} />
    </div>
  );
}

export function ProjectVisual({ id, accent }: { id: ProjectId; accent: string }) {
  switch (id) {
    case 'argus': return <ArgusVisual accent={accent} />;
    case 'verity': return <VerityVisual accent={accent} />;
    case 'helix': return <HelixVisual accent={accent} />;
    case 'spotify': return <SpotifyVisual accent={accent} />;
    case 'finance': return <FinanceVisual accent={accent} />;
    case 'scp': return <ScpVisual accent={accent} />;
  }
}
