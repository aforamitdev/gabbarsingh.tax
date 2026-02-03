import data from "@/data/india-tax-health.json";
import { IndiaTaxMap } from "@/components/tax/IndiaTaxMap";

export default function IndiaTaxHealthPage() {
  return (
    <div className="min-h-screen bg-[#f7f2ea] text-[#1f1d1a]">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 top-0 h-64 w-64 rounded-full bg-[radial-gradient(circle_at_center,_#f4b47d,_transparent_65%)] opacity-60" />
          <div className="absolute right-[-120px] top-40 h-80 w-80 rounded-full bg-[radial-gradient(circle_at_center,_#7dd9c5,_transparent_60%)] opacity-60" />
          <div className="absolute bottom-[-220px] left-1/3 h-96 w-96 rounded-full bg-[radial-gradient(circle_at_center,_#f7e1a3,_transparent_60%)] opacity-70" />
        </div>

        <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 pb-12 pt-8 md:px-10">
          <header className="flex flex-col gap-3">
            <p className="text-xs uppercase tracking-[0.3em] text-[#6b6156]">
              India tax health
            </p>
            <h1 className="mt-1 font-[var(--font-display)] text-4xl font-semibold text-[#1d1b19] md:text-5xl">
              India Tax Health
            </h1>
            <span className="inline-flex w-fit items-center rounded-full border border-[#f4b47d] bg-[#fff1e8] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#a3572c]">
              Under Construction
            </span>
            <p className="mt-2 max-w-2xl text-sm text-[#5f564c] md:text-base">
              Key tax and fiscal indicators with sources. Data is stored in a JSON
              file so it can be reused across the app.
            </p>
          </header>

          <section className="rounded-3xl border border-[#ece2d6] bg-white/85 p-6 shadow-sm backdrop-blur">
            <h2 className="text-lg font-semibold text-[#1f1d1a]">Facts</h2>
            <div className="mt-4 grid gap-3 text-sm text-[#5f564c]">
              <div>
                <span className="font-semibold text-[#1f1d1a]">Population filing ITRs (FY 2023–24): </span>
                {data.facts.population_filing_itr_fy2023_24.percent_of_population}%
              </div>
              <div>
                <span className="font-semibold text-[#1f1d1a]">Corporate vs personal income tax (Net, as of 17 Jun 2024): </span>
                Corporate ₹{data.facts.direct_tax_split_as_of_2024_06_17.corporate_tax_rs_crore} cr, Personal ₹{data.facts.direct_tax_split_as_of_2024_06_17.personal_income_tax_rs_crore} cr
              </div>
              <div>
                <span className="font-semibold text-[#1f1d1a]">Fiscal deficit: </span>
                FY 2024–25 BE {data.facts.fiscal_deficit.fy2024_25_be_percent_gdp}% of GDP; FY 2023–24 PA {data.facts.fiscal_deficit.fy2023_24_pa_percent_gdp}% of GDP
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-[#ece2d6] bg-white/85 p-6 shadow-sm backdrop-blur">
            <h2 className="text-lg font-semibold text-[#1f1d1a]">State GST Share (Dec 2023)</h2>
            <p className="mt-2 text-sm text-[#5f564c]">
              Total GST collection: ₹{data.state_gst_collection_dec_2023.total_rs_crore} cr
            </p>
            <div className="mt-4 rounded-2xl border border-[#efe5da] bg-[#fbf8f4] p-4">
              <IndiaTaxMap states={data.state_gst_collection_dec_2023.states} />
            </div>
            <div className="mt-4 grid gap-2 text-xs text-[#5f564c]">
              {data.state_gst_collection_dec_2023.states.map((item) => (
                <div
                  key={item.state}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-[#efe5da] bg-[#fbf8f4] px-4 py-2"
                >
                  <span className="font-semibold text-[#1f1d1a]">{item.state}</span>
                  <span>₹{item.gst_dec_2023_rs_crore} cr</span>
                  <span>{item.share_of_total_percent}%</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-[#ece2d6] bg-white/85 p-6 shadow-sm backdrop-blur">
            <h2 className="text-lg font-semibold text-[#1f1d1a]">Sources</h2>
            <ul className="mt-3 list-disc pl-5 text-sm text-[#5f564c]">
              <li>ITR filers: {data.facts.population_filing_itr_fy2023_24.source.name}</li>
              <li>Direct taxes: {data.facts.direct_tax_split_as_of_2024_06_17.source.name}</li>
              <li>Fiscal deficit: {data.facts.fiscal_deficit.source.name}</li>
              <li>GST state data: {data.state_gst_collection_dec_2023.source.name}</li>
              <li>Map source: {data.map.source.name} ({data.map.source.license})</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
