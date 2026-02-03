export default function TermsOfUsePage() {
  return (
    <div className="min-h-screen bg-[#f7f2ea] text-[#1f1d1a]">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 top-0 h-64 w-64 rounded-full bg-[radial-gradient(circle_at_center,_#f4b47d,_transparent_65%)] opacity-60" />
          <div className="absolute right-[-120px] top-40 h-80 w-80 rounded-full bg-[radial-gradient(circle_at_center,_#7dd9c5,_transparent_60%)] opacity-60" />
          <div className="absolute bottom-[-220px] left-1/3 h-96 w-96 rounded-full bg-[radial-gradient(circle_at_center,_#f7e1a3,_transparent_60%)] opacity-70" />
        </div>

        <div className="relative mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 pb-12 pt-10 md:px-10">
          <header className="flex flex-col gap-3">
            <p className="text-xs uppercase tracking-[0.3em] text-[#6b6156]">
              Terms of use
            </p>
            <h1 className="mt-1 font-[var(--font-display)] text-4xl font-semibold text-[#1d1b19] md:text-5xl">
              Terms of Use
            </h1>
            <p className="mt-2 text-sm text-[#5f564c] md:text-base">
              Effective date: February 3, 2026
            </p>
          </header>

          <section className="rounded-3xl border border-[#ece2d6] bg-white/90 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#1f1d1a]">Purpose</h2>
            <p className="mt-3 text-sm text-[#5f564c]">
              Gabbar Singh Tax provides information and tools for exploring tax
              calculations, global comparisons, and public fiscal data. The site is
              for informational purposes only and does not provide legal, tax, or
              financial advice.
            </p>
          </section>

          <section className="rounded-3xl border border-[#ece2d6] bg-white/90 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#1f1d1a]">Accuracy & Verification</h2>
            <p className="mt-3 text-sm text-[#5f564c]">
              Some data on this site may be incorrect, outdated, or incomplete.
              It is your responsibility to verify information with official
              sources before making decisions.
            </p>
          </section>

          <section className="rounded-3xl border border-[#ece2d6] bg-white/90 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#1f1d1a]">No Liability</h2>
            <p className="mt-3 text-sm text-[#5f564c]">
              By using this site, you agree that the operators are not liable for
              any damages, losses, or consequences arising from use of the
              information presented.
            </p>
          </section>

          <section className="rounded-3xl border border-[#ece2d6] bg-white/90 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#1f1d1a]">Contact</h2>
            <p className="mt-3 text-sm text-[#5f564c]">
              Questions can be directed via the GitHub or LinkedIn links in the
              footer.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
