type PromoBannerProps = {
  title: React.ReactNode;
  subtitle: string;
  cta: { text: string; href: string };
  backgroundImage: string;
  glowCta?: boolean;
};

export default function PromoBanner({ title, subtitle, cta, backgroundImage, glowCta }: PromoBannerProps) {
  return (
    <section
      className="relative flex flex-col items-center justify-center text-center rounded-xl overflow-hidden min-h-[260px] py-16 my-8 shadow-lg"
      style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      {/* Stronger magazine-style gradient fade at the bottom for better text contrast */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/40 via-black/70 to-black/95 pointer-events-none" />
      <div className="relative z-20 flex flex-col items-center gap-3 px-4">
        <h2 className="text-4xl md:text-5xl font-bold neon-text mb-1 drop-shadow-lg">{title}</h2>
        <p className="text-lg md:text-xl text-gray-100 mb-3 drop-shadow">{subtitle}</p>
        <a
          href={cta.href}
          className={`inline-block px-6 py-2 rounded bg-pink-600 text-white font-semibold text-base shadow hover:bg-pink-500 transition${glowCta ? ' btn-glow' : ''}`}
        >
          {cta.text}
        </a>
      </div>
    </section>
  );
} 