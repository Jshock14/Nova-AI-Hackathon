interface PriceBreakdownProps {
  priceCents: number;
}

export function PriceBreakdown({ priceCents }: PriceBreakdownProps) {
  const alternativeTravel = Math.round(priceCents * 0.75);
  const taxes = Math.round(priceCents * 0.15);
  const redirectFee = priceCents - alternativeTravel - taxes;

  return (
    <div className="flex flex-col gap-3 mb-6">
      <div className="flex justify-between text-slate-600 dark:text-slate-400 text-sm">
        <span>Alternative Travel</span>
        <span>${(alternativeTravel / 100).toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-slate-600 dark:text-slate-400 text-sm">
        <span>Tax &amp; Fees</span>
        <span>${(taxes / 100).toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-slate-600 dark:text-slate-400 text-sm">
        <span>Redirect Fee</span>
        <span>${(redirectFee / 100).toFixed(2)}</span>
      </div>
      <div className="border-t border-slate-200 dark:border-slate-700 my-3 pt-4 flex justify-between items-end">
        <span className="text-slate-900 dark:text-slate-100 font-bold">Total</span>
        <p className="text-2xl font-bold text-primary leading-none">
          ${(priceCents / 100).toFixed(2)}
        </p>
      </div>
    </div>
  );
}
