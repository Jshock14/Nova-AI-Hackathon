import { Icon } from "@/components/ui/icon";

const items = [
  {
    icon: "schedule",
    title: "Time Saved",
    subtitle: "Faster recovery routing",
    iconBg: "bg-green-100 text-green-600",
  },
  {
    icon: "sentiment_satisfied",
    title: "Less Stress",
    subtitle: "Smart ranked alternatives",
    iconBg: "bg-sky-100 text-sky-600",
  },
  {
    icon: "flight",
    title: "Direct Booking",
    subtitle: "Complete purchase on airline sites",
    iconBg: "bg-purple-100 text-purple-600",
  },
];

export function TrustIndicators() {
  return (
    <div className="mt-10 grid w-full max-w-[900px] grid-cols-1 gap-6 sm:grid-cols-3">
      {items.map((item) => (
        <div key={item.title} className="flex items-center gap-3 text-left">
          <span className={`flex size-10 items-center justify-center rounded-full ${item.iconBg}`}>
            <Icon name={item.icon} size={18} />
          </span>
          <div>
            <p className="text-base font-bold text-slate-900">{item.title}</p>
            <p className="text-sm text-slate-500">{item.subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
