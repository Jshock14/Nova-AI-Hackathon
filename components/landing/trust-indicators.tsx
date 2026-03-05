import { Icon } from "@/components/ui/icon";

const items = [
  {
    icon: "check_circle",
    iconBg: "bg-green-100 dark:bg-green-900/30 text-green-600",
    title: "Real-time updates.",
  },
  {
    icon: "calendar_today",
    iconBg: "bg-blue-100 dark:bg-blue-900/30 text-blue-600",
    title: "24/7 Support.",
  },
  {
    icon: "flight",
    iconBg: "bg-purple-100 dark:bg-purple-900/30 text-purple-600",
    title: "Exclusive deals.",
  },
];

export function TrustIndicators() {
  return (
    <div className="mt-16 flex flex-wrap justify-center gap-12 text-slate-500 dark:text-slate-400">
      {items.map((item) => (
        <div key={item.title} className="flex flex-col items-center gap-3 text-center">
          <div
            className={`size-14 rounded-full flex items-center justify-center ${item.iconBg}`}
          >
            <Icon name={item.icon} size={28} />
          </div>
          <p className="text-slate-800 dark:text-white font-medium leading-none">
            {item.title}
          </p>
        </div>
      ))}
    </div>
  );
}
