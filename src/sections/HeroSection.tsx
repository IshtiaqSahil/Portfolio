import FadeIn from '../components/FadeIn';
import Magnet from '../components/Magnet';
import ContactButton from '../components/ContactButton';
import { HERO_TAGLINE, NAME, NAV_LINKS, PORTRAIT_URL } from '../content';

function Orb() {
  // Shown until a portrait is added in content.ts
  return (
    <div className="relative mx-auto aspect-square w-[78%] sm:mb-[18%]" aria-hidden="true">
      <div className="absolute inset-[-18%] rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(182,0,168,.35), rgba(118,33,176,.18) 45%, transparent 70%)' }} />
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle at 32% 26%, #ffffff 0%, #D7E2EA 6%, #BBCCD7 14%, #7621B0 42%, #2a0638 72%, #0C0C0C 100%)',
          boxShadow: 'inset -24px -30px 60px rgba(0,0,0,.65), inset 10px 14px 30px rgba(255,255,255,.12), 0 30px 80px -20px rgba(182,0,168,.55)',
        }}
      />
      <div className="absolute inset-[-9%] rounded-full border border-[#BBCCD7]/20" style={{ transform: 'rotateX(72deg)' }} />
      <div className="absolute inset-[-20%] rounded-full border border-[#BBCCD7]/10" style={{ transform: 'rotateX(72deg) rotateY(12deg)' }} />
    </div>
  );
}

export default function HeroSection() {
  return (
    <section className="relative flex h-screen flex-col" style={{ overflowX: 'clip' }}>
      <FadeIn as="nav" delay={0} y={-20} className="flex justify-between px-6 pt-6 md:px-10 md:pt-8" aria-label="Primary">
        {NAV_LINKS.map(link => (
          <a
            key={link.label}
            href={link.href}
            className="text-sm font-medium uppercase tracking-wider text-[#D7E2EA] transition-opacity duration-200 hover:opacity-70 md:text-lg lg:text-[1.4rem]"
          >
            {link.label}
          </a>
        ))}
      </FadeIn>

      <div className="overflow-hidden">
        <FadeIn
          as="h1"
          delay={0.15}
          y={40}
          className="hero-heading mt-6 w-full whitespace-nowrap text-center text-[11.4vw] font-black uppercase leading-none tracking-tight sm:mt-4 sm:text-[12.2vw] md:-mt-5 md:text-[13vw] lg:text-[13.9vw]"
        >
          Hi, i&apos;m {NAME}
        </FadeIn>
      </div>

      <div className="absolute left-1/2 top-1/2 z-10 w-[280px] -translate-x-1/2 -translate-y-1/2 sm:bottom-0 sm:top-auto sm:w-[360px] sm:translate-y-0 md:w-[440px] lg:w-[520px]">
        <FadeIn delay={0.6} y={30}>
          <Magnet padding={150} magnetStrength={3} activeTransition="transform 0.3s ease-out" inactiveTransition="transform 0.6s ease-in-out" wrapperClassName="w-full" innerClassName="w-full">
            {PORTRAIT_URL ? <img src={PORTRAIT_URL} alt="Portrait of Ishtiaq" className="block w-full" /> : <Orb />}
          </Magnet>
        </FadeIn>
      </div>

      <div className="relative z-20 mt-auto flex items-end justify-between px-6 pb-7 sm:pb-8 md:px-10 md:pb-10">
        <FadeIn
          as="p"
          delay={0.35}
          y={20}
          className="max-w-[160px] font-light uppercase leading-snug tracking-wide text-[#D7E2EA] sm:max-w-[220px] md:max-w-[260px]"
          style={{ fontSize: 'clamp(0.75rem, 1.4vw, 1.5rem)' }}
        >
          {HERO_TAGLINE}
        </FadeIn>
        <FadeIn delay={0.5} y={20}>
          <ContactButton />
        </FadeIn>
      </div>
    </section>
  );
}
