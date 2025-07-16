type FeaturedPostProps = {
  title: string;
  post: {
    image: string;
    title: string;
    excerpt: string;
    readMoreLink: string;
  };
};

export default function FeaturedPost({ title, post }: FeaturedPostProps) {
  return (
    <section className="py-8">
      <h2 className="text-2xl md:text-3xl font-bold neon-text mb-6 text-center">{title}</h2>
      <div className="max-w-2xl mx-auto bg-neutral-900 rounded-xl overflow-hidden shadow-lg flex flex-col md:flex-row">
        <img
          src={post.image}
          alt={post.title}
          className="w-full md:w-64 h-48 object-cover object-center md:h-auto"
        />
        <div className="p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">{post.title}</h3>
            <p className="text-gray-300 mb-4">{post.excerpt}</p>
          </div>
          <a
            href={post.readMoreLink}
            className="inline-block px-5 py-2 rounded bg-pink-600 text-white font-semibold text-base shadow hover:bg-pink-500 transition self-start"
          >
            Read More
          </a>
        </div>
      </div>
    </section>
  );
} 