type LiveProjectButtonProps = { href?: string; label?: string };

export default function LiveProjectButton({ href, label = 'Live Project' }: LiveProjectButtonProps) {
  const className =
    'inline-block whitespace-nowrap rounded-full border-2 border-[#D7E2EA] px-8 py-3 text-sm font-medium uppercase tracking-widest text-[#D7E2EA] transition-colors duration-200 sm:px-10 sm:py-3.5 sm:text-base';
  if (!href) {
    return <span className={`${className} cursor-default opacity-50`}>{label}</span>;
  }
  return (
    <a href={href} target="_blank" rel="noreferrer" className={`${className} hover:bg-[#D7E2EA]/10`}>
      {label}
    </a>
  );
}
