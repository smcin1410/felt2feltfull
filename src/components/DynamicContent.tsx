type DynamicContentProps = {
  title: string;
  placeholder: string;
};

export default function DynamicContent({ title, placeholder }: DynamicContentProps) {
  return (
    <section className="flex flex-col items-center text-center gap-2 py-8">
      <h2 className="text-2xl md:text-3xl font-bold neon-text mb-2">{title}</h2>
      <div className="text-gray-400 italic">{placeholder}</div>
    </section>
  );
} 