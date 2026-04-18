export default function HomePage() {
  return (
    <section className="space-y-4 text-center">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        Staxial
      </h1>
      <p className="mx-auto max-w-xl text-sm text-slate-300 sm:text-base">
        Monorepo foundation for a Social DeFi platform on the Stacks blockchain, combining
        social networking with programmable on-chain finance. This web app is the primary
        front-end surface for discovery and interaction.
      </p>
      <div className="pt-4">
        <a
          href="/celo-token"
          className="inline-block rounded-full bg-white px-6 py-3 text-sm font-bold text-black transition hover:bg-zinc-200"
        >
          Launch Celo Token Dashboard
        </a>
      </div>
    </section>
  );
}


