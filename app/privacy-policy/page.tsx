export default function PrivacyPolicyPage() {
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
              Privacy policy
            </p>
            <h1 className="mt-1 font-[var(--font-display)] text-4xl font-semibold text-[#1d1b19] md:text-5xl">
              Privacy Policy
            </h1>
            <p className="mt-2 text-sm text-[#5f564c] md:text-base">
              Effective date: February 3, 2026
            </p>
          </header>

          <section className="rounded-3xl border border-[#ece2d6] bg-white/90 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#1f1d1a]">Overview</h2>
            <p className="mt-3 text-sm text-[#5f564c]">
              Gabbar Singh Tax is a public information platform. At this time, we do
              not collect personal data directly from you. The site is intended to
              help you explore tax information and compare public data sources.
            </p>
          </section>

          <section className="rounded-3xl border border-[#ece2d6] bg-white/90 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#1f1d1a]">Analytics</h2>
            <p className="mt-3 text-sm text-[#5f564c]">
              We use Google Analytics to understand aggregate traffic and improve
              the product. Google Analytics may set cookies or collect usage
              information such as pages visited, device type, and approximate
              location. We do not receive personally identifying information from
              Google Analytics.
            </p>
          </section>

          <section className="rounded-3xl border border-[#ece2d6] bg-white/90 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#1f1d1a]">Data Sources</h2>
            <p className="mt-3 text-sm text-[#5f564c]">
              We reference public data sources for tax and fiscal indicators. While
              we strive for accuracy, data can be delayed, revised, or incomplete.
              Please verify critical information with official sources.
            </p>
          </section>

          <section className="rounded-3xl border border-[#ece2d6] bg-white/90 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#1f1d1a]">Contact</h2>
            <p className="mt-3 text-sm text-[#5f564c]">
              If you have questions about this policy, contact us via the GitHub or
              LinkedIn links in the footer.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
