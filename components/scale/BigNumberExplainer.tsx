function formatTrillion(valueBn: number) {
  const trillions = valueBn / 1000;
  if (trillions >= 100) return trillions.toFixed(0);
  if (trillions >= 10) return trillions.toFixed(1);
  return trillions.toFixed(2);
}

function formatYears(valueBn: number) {
  const years = valueBn * 31.7;
  if (years >= 1000) return `${Math.round(years).toLocaleString()} years`;
  return `${years.toFixed(0)} years`;
}

type BigNumberExplainerProps = {
  valueBn: number;
  label: string;
  currencyLabel?: string;
};

export function BigNumberExplainer({
  valueBn,
  label,
  currencyLabel = "EUR",
}: BigNumberExplainerProps) {
  const trillions = valueBn / 1000;
  const barCount = Math.min(30, Math.ceil(trillions));
  const fraction = trillions - Math.floor(trillions);

  return (
    <div className="rounded-3xl border border-[#ece2d6] bg-white/85 p-6 shadow-sm">
      <div className="text-xs uppercase tracking-[0.25em] text-[#7a6f63]">
        Scale explainer
      </div>
      <h3 className="mt-2 text-lg font-semibold text-[#1f1d1a]">
        {label}
      </h3>

      <div className="mt-3 grid gap-3 text-sm text-[#5f564c]">
        <div>
          <span className="font-semibold text-[#1f1d1a]">{valueBn.toLocaleString()} billion</span> {currencyLabel}
          <span className="ml-2 text-[#7a6f63]">= {formatTrillion(valueBn)} trillion {currencyLabel}</span>
        </div>
        <div>
          If you counted <span className="font-semibold text-[#1f1d1a]">1 per second</span>, this number would take
          <span className="ml-1 font-semibold text-[#1f1d1a]">{formatYears(valueBn)}</span>.
        </div>
        <div>
          <span className="font-semibold text-[#1f1d1a]">1 billion</span> equals 1,000 million —
          so this is <span className="font-semibold text-[#1f1d1a]">{valueBn.toLocaleString()}</span> million‑millions.
        </div>
      </div>

      <div className="mt-4">
        <div className="text-xs uppercase tracking-[0.2em] text-[#7a6f63]">
          Trillion blocks (1 block = 1 trillion)
        </div>
        <div className="mt-2 grid grid-cols-10 gap-2">
          {Array.from({ length: barCount }).map((_, index) => {
            const isPartial = index === barCount - 1 && fraction > 0 && trillions < barCount;
            const fill = isPartial ? Math.max(0.15, fraction) : 1;
            return (
              <div
                key={index}
                className="h-3 rounded-full border border-[#e5dbcf] bg-[#fff6ea]"
              >
                <div
                  className="h-full rounded-full bg-[#e07a5f]"
                  style={{ width: `${fill * 100}%` }}
                />
              </div>
            );
          })}
        </div>
        {trillions > 30 ? (
          <div className="mt-2 text-xs text-[#7a6f63]">
            Showing first 30 trillion blocks out of {formatTrillion(valueBn)} trillion.
          </div>
        ) : null}
      </div>

      <div className="mt-4 rounded-2xl border border-[#efe5da] bg-[#fbf8f4] px-4 py-3 text-xs text-[#7a6f63]">
        Tip: use the total‑wealth view to see big numbers; switch to per‑capita for a human‑scale view.
      </div>
    </div>
  );
}
