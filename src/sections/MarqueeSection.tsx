import { useEffect, useRef, useState } from 'react';
import { Blocks, Code2, Cpu, Database, Gamepad2, Ghost, Layers, Music, Network, Server, ShieldCheck, Ship, Terminal, Wallet, Zap, type LucideIcon } from 'lucide-react';

// Tiles drawn in code from your projects, stats and stack (stand-ins for the template's GIFs).
type Tile =
  | { kind: 'project'; title: string; caption: string; accent: string; icon: LucideIcon }
  | { kind: 'stat'; value: string; caption: string; accent: string }
  | { kind: 'tech'; title: string; caption: string; icon: LucideIcon };

const ROW_ONE: Tile[] = [
  { kind: 'project', title: 'ARGUS', caption: 'Shipping-document verification', accent: '#F5A524', icon: Ship },
  { kind: 'stat', value: '1.0000', caption: 'ARGUS benchmark score', accent: '#F5A524' },
  { kind: 'tech', title: 'Python', caption: 'Agents & backends', icon: Terminal },
  { kind: 'project', title: 'Verity', caption: 'AI agent certification', accent: '#4DA2FF', icon: ShieldCheck },
  { kind: 'tech', title: 'Sui', caption: 'On-chain certificates', icon: Blocks },
  { kind: 'stat', value: '7', caption: 'Agents running in parallel', accent: '#F5A524' },
  { kind: 'project', title: 'HelixMC', caption: 'Minecraft network', accent: '#34D5C8', icon: Server },
  { kind: 'tech', title: 'Java', caption: 'Plugins & mods', icon: Code2 },
  { kind: 'stat', value: '3', caption: 'Judge models in Verity', accent: '#4DA2FF' },
  { kind: 'tech', title: 'FastAPI', caption: 'Python APIs', icon: Zap },
  { kind: 'tech', title: 'Walrus', caption: 'Evidence storage', icon: Database },
];

const ROW_TWO: Tile[] = [
  { kind: 'project', title: 'Spotify HUD', caption: 'Fabric mod · MC 26.2', accent: '#1ED760', icon: Music },
  { kind: 'tech', title: 'Fabric', caption: 'Client-side modding', icon: Layers },
  { kind: 'stat', value: '520', caption: 'Emails in the ARGUS benchmark', accent: '#F5A524' },
  { kind: 'project', title: 'Finance Tracker', caption: 'Google Sheets web app', accent: '#B79CFF', icon: Wallet },
  { kind: 'tech', title: 'Node.js', caption: 'Express servers', icon: Cpu },
  { kind: 'stat', value: '30+', caption: 'Versions of HelixSpawn', accent: '#34D5C8' },
  { kind: 'project', title: 'SCP Horror', caption: 'Unity 6 · in development', accent: '#FF3B30', icon: Ghost },
  { kind: 'tech', title: 'Unity 6', caption: 'Game development', icon: Gamepad2 },
  { kind: 'stat', value: '~1,100', caption: 'Lines in HelixSpawn', accent: '#34D5C8' },
  { kind: 'tech', title: 'Velocity', caption: 'Proxy networks', icon: Network },
];

function TileCard({ tile }: { tile: Tile }) {
  const base = 'relative h-[270px] w-[420px] flex-none overflow-hidden rounded-2xl';
  if (tile.kind === 'project') {
    const Icon = tile.icon;
    return (
      <div className={base} style={{ background: `radial-gradient(110% 120% at 85% 0%, ${tile.accent}55, transparent 60%), linear-gradient(160deg, #17181b, #0f1012)` }}>
        <Icon className="absolute right-6 top-6 h-10 w-10" style={{ color: tile.accent }} strokeWidth={1.5} />
        <div className="absolute bottom-6 left-6 right-6">
          <p className="mb-1 text-sm font-light uppercase tracking-widest text-[#D7E2EA]/60">{tile.caption}</p>
          <p className="text-5xl font-black uppercase leading-none text-[#D7E2EA]">{tile.title}</p>
        </div>
      </div>
    );
  }
  if (tile.kind === 'stat') {
    return (
      <div className={`${base} border border-white/10 bg-[#121315]`}>
        <div className="absolute inset-0 opacity-60" style={{ background: `radial-gradient(60% 70% at 20% 100%, ${tile.accent}40, transparent 70%)` }} />
        <div className="absolute bottom-6 left-6 right-6">
          <p className="text-7xl font-black leading-none" style={{ color: tile.accent }}>{tile.value}</p>
          <p className="mt-2 text-base font-light uppercase tracking-wider text-[#D7E2EA]/70">{tile.caption}</p>
        </div>
      </div>
    );
  }
  const Icon = tile.icon;
  return (
    <div className={`${base} grid place-items-center bg-[#D7E2EA]`}>
      <div className="text-center text-[#0C0C0C]">
        <Icon className="mx-auto mb-4 h-12 w-12" strokeWidth={1.5} />
        <p className="text-4xl font-black uppercase leading-none">{tile.title}</p>
        <p className="mt-2 text-sm font-light uppercase tracking-widest opacity-60">{tile.caption}</p>
      </div>
    </div>
  );
}

export default function MarqueeSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current) return;
      const sectionTop = sectionRef.current.offsetTop;
      setOffset((window.scrollY - sectionTop + window.innerHeight) * 0.3);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const rowOne = [...ROW_ONE, ...ROW_ONE, ...ROW_ONE];
  const rowTwo = [...ROW_TWO, ...ROW_TWO, ...ROW_TWO];

  return (
    <section ref={sectionRef} className="flex flex-col gap-3 overflow-hidden bg-[#0C0C0C] pb-10 pt-24 sm:pt-32 md:pt-40" aria-label="Highlights">
      <div className="flex w-max gap-3" style={{ transform: `translateX(${offset - 200}px)`, willChange: 'transform' }}>
        {rowOne.map((tile, i) => <TileCard key={i} tile={tile} />)}
      </div>
      <div className="flex w-max gap-3" style={{ transform: `translateX(${-(offset - 200)}px)`, willChange: 'transform' }}>
        {rowTwo.map((tile, i) => <TileCard key={i} tile={tile} />)}
      </div>
    </section>
  );
}
