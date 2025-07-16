type ResultsAreaProps = {
  placeholder: string;
};

export default function ResultsArea({ placeholder }: ResultsAreaProps) {
  return (
    <section className="bg-black/60 rounded-xl shadow-lg p-8 flex items-center justify-center text-gray-400 italic min-h-[120px]">
      {placeholder}
    </section>
  );
} 