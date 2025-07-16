'use client';

type PromoBoxProps = {
  title: React.ReactNode;
  subtitle: string;
  cta?: { text: string };
  backgroundImage?: string;
};

export default function PromoBox({ title, subtitle, cta, backgroundImage }: PromoBoxProps) {
  return backgroundImage ? (
    <section
      className="relative flex flex-col items-center justify-center text-center rounded-xl overflow-hidden min-h-[180px] py-8 shadow-lg mb-8"
      style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      {/* Strong bottom fade for text readability */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/40 via-black/70 to-black/95 pointer-events-none" />
      <div className="relative z-20 flex flex-col items-center gap-2 px-4">
        <h2 className="text-4xl md:text-5xl font-bold neon-text mb-1 drop-shadow-lg font-monoton">{title}</h2>
        <p className="text-lg md:text-xl text-gray-100 drop-shadow">{subtitle}</p>
      </div>
    </section>
  ) : (
    <section className="bg-neutral-900 rounded-xl shadow-lg p-8 flex flex-col items-center text-center gap-4">
      <h2 className="text-3xl md:text-4xl font-bold neon-text mb-1">{title}</h2>
      <p className="text-lg md:text-xl text-gray-200 mb-3">{subtitle}</p>
      {cta && (
        <button
          className="inline-block px-6 py-2 rounded bg-pink-600 text-white font-semibold text-base shadow hover:bg-pink-500 transition"
          disabled
        >
          {cta.text}
        </button>
      )}
    </section>
  );
} 