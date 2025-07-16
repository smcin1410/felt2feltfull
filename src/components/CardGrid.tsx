type Card = {
  id: string;
  image: string;
  title: string;
  href: string;
};

type CardGridProps = {
  title: string;
  cards: Card[];
};

export default function CardGrid({ title, cards }: CardGridProps) {
  return (
    <section className="py-8">
      <h2 className="text-2xl md:text-3xl font-bold neon-text mb-6 text-center">{title}</h2>
      <div className="flex gap-6 overflow-x-auto pb-4 md:grid md:grid-cols-3 md:gap-8 md:overflow-x-visible md:pb-0">
        {cards.map((card) => (
          <a
            key={card.id}
            href={card.href}
            className="min-w-[260px] max-w-xs flex-shrink-0 rounded-xl overflow-hidden shadow-lg hover:scale-105 transition transform duration-200 md:min-w-0 md:max-w-none relative group"
          >
            <img
              src={card.image}
              alt={card.title}
              className="w-full h-64 object-cover object-center"
              loading="lazy"
            />
            {/* Magazine-style gradient fade and overlay title */}
            <div className="absolute bottom-0 left-0 w-full h-2/5 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />
            <div className="absolute bottom-4 left-0 w-full flex justify-center z-20">
              <h3 className="text-xl font-semibold text-white neon-text text-center drop-shadow-lg px-2">
                {card.title}
              </h3>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
} 