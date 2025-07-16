type HeroProps = {
  title: string;
  subtitle: string;
  cta: { text: string; href: string };
};

export default function Hero({ title, subtitle, cta }: HeroProps) {
  return (
    <section
      className="relative flex flex-col items-center text-center gap-6 py-10 overflow-hidden"
      style={{ backgroundImage: 'url(/stock-photos/empty-table.png)', backgroundSize: 'cover', backgroundPosition: 'center 90%' }}
    >
      {/* Gradient overlay for text contrast, same as PromoBanner */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/40 via-black/70 to-black/95 pointer-events-none" />
      <h1 className="text-4xl md:text-5xl font-bold neon-text mb-2 relative z-20">{title}</h1>
      <p className="text-lg md:text-xl text-gray-200 max-w-2xl mb-4 relative z-20">{subtitle}</p>
      <a
        href={cta.href}
        className="inline-block px-8 py-3 rounded bg-pink-600 text-white font-semibold text-lg shadow hover:bg-pink-500 transition btn-glow relative z-20"
      >
        {cta.text}
      </a>
    </section>
  );
} 