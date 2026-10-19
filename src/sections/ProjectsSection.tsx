import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { useRef } from 'react';
import FadeIn from '../components/FadeIn';
import LiveProjectButton from '../components/LiveProjectButton';
import { PROJECTS, type Project } from '../content';
import { ProjectVisual } from '../visuals/ProjectVisuals';

const RADIUS = 'rounded-[40px] sm:rounded-[50px] md:rounded-[60px]';

function ProjectCard({ project, index, total, progress }: { project: Project; index: number; total: number; progress: MotionValue<number> }) {
  const targetScale = 1 - (total - 1 - index) * 0.03;
  const scale = useTransform(progress, [index / total, 1], [1, targetScale]);

  return (
    <div className="sticky top-24 flex h-[85vh] items-start justify-center md:top-32">
      <motion.article
        style={{ scale, top: `${index * 28}px`, transformOrigin: 'top center' }}
        className={`relative w-full max-w-6xl border-2 border-[#D7E2EA] bg-[#0C0C0C] p-4 sm:p-6 md:p-8 ${RADIUS}`}
      >
        <div className="mb-4 flex flex-wrap items-end justify-between gap-4 px-2 sm:mb-6 sm:px-4">
          <div className="flex items-end gap-4 sm:gap-6">
            <span className="hero-heading font-black leading-none" style={{ fontSize: 'clamp(3rem, 10vw, 140px)' }}>
              {String(index + 1).padStart(2, '0')}
            </span>
            <div className="flex flex-col gap-1 pb-1 sm:pb-3">
              <span className="text-xs font-light uppercase tracking-widest text-[#D7E2EA]/60 sm:text-sm">{project.category}</span>
              <h3 className="font-medium uppercase leading-none text-[#D7E2EA]" style={{ fontSize: 'clamp(1.3rem, 3vw, 2.6rem)' }}>{project.name}</h3>
            </div>
          </div>
          <div className="pb-1 sm:pb-3">
            <LiveProjectButton href={project.link} label={project.linkLabel} />
          </div>
        </div>

        <div className="flex gap-3 sm:gap-4">
          <div className="flex w-[40%] flex-col gap-3 sm:gap-4">
            <div
              className={`relative flex flex-col justify-end overflow-hidden p-5 sm:p-7 md:p-9 ${RADIUS}`}
              style={{ height: 'clamp(130px, 16vw, 230px)', background: `radial-gradient(90% 120% at 0% 100%, ${project.accent}59, transparent 65%), #141517` }}
            >
              <span className="font-black leading-none" style={{ color: project.accent, fontSize: 'clamp(1.8rem, 5vw, 4.5rem)' }}>{project.stat.value}</span>
              <span className="mt-1 text-[0.65rem] font-light uppercase leading-snug tracking-wider text-[#D7E2EA]/70 sm:text-sm">{project.stat.label}</span>
            </div>
            <div
              className={`flex flex-col justify-between gap-3 overflow-hidden bg-[#D7E2EA] p-5 text-[#0C0C0C] sm:p-7 md:p-9 ${RADIUS}`}
              style={{ height: 'clamp(160px, 22vw, 340px)' }}
            >
              <p className="line-clamp-4 font-light leading-snug sm:line-clamp-5 md:line-clamp-6" style={{ fontSize: 'clamp(0.7rem, 1.25vw, 1.1rem)' }}>{project.summary}</p>
              <div className="hidden flex-wrap gap-1.5 sm:flex">
                {project.tags.map(tag => (
                  <span key={tag} className="rounded-full border border-[#0C0C0C]/30 px-3 py-1 text-xs font-medium uppercase tracking-wider">{tag}</span>
                ))}
              </div>
            </div>
          </div>
          <div className={`w-[60%] overflow-hidden ${RADIUS}`}>
            <ProjectVisual id={project.id} accent={project.accent} />
          </div>
        </div>
      </motion.article>
    </div>
  );
}

export default function ProjectsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });

  return (
    <section
      id="projects"
      className="relative z-10 -mt-10 rounded-t-[40px] bg-[#0C0C0C] px-5 pb-20 pt-20 sm:-mt-12 sm:rounded-t-[50px] sm:px-8 sm:pt-24 md:-mt-14 md:rounded-t-[60px] md:px-10 md:pt-32"
    >
      <FadeIn as="h2" y={40} className="hero-heading mb-12 text-center font-black uppercase leading-none tracking-tight sm:mb-16 md:mb-20" style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}>
        Project
      </FadeIn>
      <div ref={containerRef}>
        {PROJECTS.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} total={PROJECTS.length} progress={scrollYProgress} />
        ))}
      </div>
    </section>
  );
}
