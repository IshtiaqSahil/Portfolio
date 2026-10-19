// All site text lives here. Edit this file to change what the page says.

export const NAME = 'ishtiaq';
export const CONTACT_EMAIL = 'ishtiaqsahil8@gmail.com';

// Put a photo at public/portrait.png and set this to `${import.meta.env.BASE_URL}portrait.png`.
// While it's null, the hero shows a 3D orb instead.
export const PORTRAIT_URL: string | null = null;

export const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: `mailto:${CONTACT_EMAIL}` },
];

export const HERO_TAGLINE = 'a developer and modder building ai agents, game servers and mods that ship';

export const ABOUT_TEXT =
  "I build things that have to be right, not just plausible. AI pipelines that know when they're unsure, judges that check each other, and game servers that stay up when real players log in. Two hackathon certificates so far, and I keep maintaining what I build after the demo. Let's build something real together!";

export const SKILLS = [
  {
    name: 'AI Agent Systems',
    description:
      'Multi-agent pipelines that split work across parallel agents, with confidence gating so uncertain answers are held back instead of guessed.',
  },
  {
    name: 'LLM Evaluation',
    description:
      'Judging AI output with independent models and multilingual test suites, so a score means something and is hard to game.',
  },
  {
    name: 'Blockchain Integration',
    description:
      'Writing verifiable records to Sui and storing evidence on Walrus, so results can be checked by anyone without trusting the person who ran them.',
  },
  {
    name: 'Minecraft Infrastructure',
    description:
      'Velocity proxy networks with hub and survival servers, plus custom Paper plugins and Fabric client mods written from scratch.',
  },
  {
    name: 'Web Apps & Games',
    description:
      'Practical Node and Express tools for real people, Python and FastAPI backends, and a Unity 6 horror game in development.',
  },
];

export type ProjectId = 'argus' | 'verity' | 'helix' | 'spotify' | 'finance' | 'scp';

export type Project = {
  id: ProjectId;
  name: string;
  category: string;
  accent: string;
  stat: { value: string; label: string };
  summary: string;
  tags: string[];
  link?: string; // live demo or repo URL; leave undefined to show a disabled button
  linkLabel?: string;
};

export const PROJECTS: Project[] = [
  {
    id: 'argus',
    name: 'ARGUS',
    category: 'Hackathon · Averis × Monash',
    accent: '#F5A524',
    stat: { value: '1.0000', label: 'score on a 520-email benchmark' },
    summary:
      'Checks Shipping Instructions against Bills of Lading. Seven field agents run in parallel, then a confidence gate modelled on the fruit fly olfactory circuit decides what is certain enough to pass.',
    tags: ['Python', 'FastAPI', 'Multi-agent', 'Vercel'],
  },
  {
    id: 'verity',
    name: 'Verity',
    category: 'Hackathon · MUBA Hacks 2026',
    accent: '#4DA2FF',
    stat: { value: '3', label: 'judge models, 3 test languages' },
    summary:
      'Certifies AI agents. Three models judge each agent, tests run in English, Chinese and Japanese, and the verdict is written to Sui with the evidence on Walrus.',
    tags: ['Sui', 'Walrus', 'Gonka', 'LLM evaluation'],
  },
  {
    id: 'helix',
    name: 'HelixMC',
    category: 'Minecraft network',
    accent: '#34D5C8',
    stat: { value: '30+', label: 'versions of HelixSpawn, ~1,100 lines' },
    summary:
      'A Velocity network with a hub and Rust-style survival servers, running on plugins I wrote myself: HelixSpawn for spawning and LoopManager for timed systems. Formerly Project Re-genesis.',
    tags: ['Java', 'Velocity', 'Paper'],
    linkLabel: 'Join Server',
  },
  {
    id: 'spotify',
    name: 'Spotify HUD',
    category: 'Fabric mod · MC 26.2',
    accent: '#1ED760',
    stat: { value: '26.2', label: 'Minecraft version' },
    summary:
      'A now-playing HUD inside Minecraft with play, pause and skip, and Spotify sign-in handled in game with OAuth.',
    tags: ['Java', 'Fabric', 'Spotify API', 'OAuth'],
  },
  {
    id: 'finance',
    name: 'Finance Tracker',
    category: 'Web app · for my brother',
    accent: '#B79CFF',
    stat: { value: 'Sheets', label: 'as the database' },
    summary:
      'A budgeting app that keeps a Google Sheet as its database so everything stays editable by hand, with a Node and Express app on top, hosted on Render.',
    tags: ['Node.js', 'Express', 'Sheets API', 'Render'],
  },
  {
    id: 'scp',
    name: 'SCP Horror',
    category: 'Unity 6 · in development',
    accent: '#FF3B30',
    stat: { value: 'WIP', label: 'in active development' },
    summary:
      'A first-person horror game set in the SCP universe. Containment breaches, tight corridors and things that move when you are not looking.',
    tags: ['Unity 6', 'C#', 'Game design'],
    linkLabel: 'Coming Soon',
  },
];
