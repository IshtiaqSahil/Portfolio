import FadeIn from '../components/FadeIn';
import { SKILLS } from '../content';

export default function ServicesSection() {
  return (
    <section id="skills" className="rounded-t-[40px] bg-white px-5 py-20 sm:rounded-t-[50px] sm:px-8 sm:py-24 md:rounded-t-[60px] md:px-10 md:py-32">
      <FadeIn as="h2" y={40} className="mb-16 text-center font-black uppercase leading-none tracking-tight text-[#0C0C0C] sm:mb-20 md:mb-28" style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}>
        Skills
      </FadeIn>
      <ul className="mx-auto max-w-5xl">
        {SKILLS.map((skill, i) => (
          <FadeIn
            as="li"
            key={skill.name}
            delay={i * 0.1}
            className="flex items-start gap-6 py-8 sm:gap-10 sm:py-10 md:gap-14 md:py-12"
            style={{ borderTop: i === 0 ? 'none' : '1px solid rgba(12, 12, 12, 0.15)' }}
          >
            <span className="flex-none font-black leading-none text-[#0C0C0C]" style={{ fontSize: 'clamp(3rem, 10vw, 140px)', width: '1.3em' }}>
              {String(i + 1).padStart(2, '0')}
            </span>
            <div className="flex flex-col gap-2 pt-1 text-[#0C0C0C] sm:gap-3 md:pt-3">
              <h3 className="font-medium uppercase" style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}>{skill.name}</h3>
              <p className="max-w-2xl font-light leading-relaxed opacity-60" style={{ fontSize: 'clamp(0.85rem, 1.6vw, 1.25rem)' }}>{skill.description}</p>
            </div>
          </FadeIn>
        ))}
      </ul>
    </section>
  );
}
