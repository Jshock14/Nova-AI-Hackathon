interface PriceBreakdownProps {
  priceCents: number;
}

export function PriceBreakdown({ priceCents }: PriceBreakdownProps) {
  const baseFare = Math.round(priceCents * 0.876);
  const taxes = priceCents - baseFare;

  return (
    <div className="space-y-3 text-base">
      <Row label="Base Fare (1 Adult)" value={`$${(baseFare / 100).toFixed(2)}`} />
      <Row label="Taxes and Fees" value={`$${(taxes / 100).toFixed(2)}`} />
      <Row label="Redirect Service Fee" value="Waived" valueClass="font-semibold text-green-600" />

      <div className="mt-5 border-t border-slate-100 pt-5">
        <div className="flex items-end justify-between">
          <p className="text-2xl font-bold text-slate-900">Total Price</p>
          <div className="text-right">
            <p className="text-4xl font-black tracking-[-0.02em] text-primary">${(priceCents / 100).toFixed(2)}</p>
            <p className="text-[10px] text-slate-400">All prices in USD</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  valueClass,
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex items-center justify-between text-slate-600">
      <span>{label}</span>
      <span className={valueClass}>{value}</span>
    </div>
  );
}
