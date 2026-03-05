import { Icon } from "@/components/ui/icon";

const extras = [
  { icon: "wifi", label: "Wi-Fi" },
  { icon: "airline_seat_legroom_normal", label: "Legroom" },
  { icon: "restaurant", label: "Food" },
];

export function AmenitiesCard() {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <h4 className="text-slate-900 dark:text-slate-100 text-sm font-bold uppercase tracking-wider mb-4">
        Extras
      </h4>
      <div className="mb-4">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-3">Included Amenities</p>
        <div className="flex flex-wrap gap-4">
          {extras.map((item) => (
            <div
              key={item.icon}
              className="flex items-center gap-2 text-slate-700 dark:text-slate-300"
            >
              <Icon name={item.icon} size={20} />
              <span className="text-sm">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-3">Payment Type</p>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer text-sm">
            <input type="radio" name="payment" defaultChecked className="accent-primary" />
            Credit Card
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-sm">
            <input type="radio" name="payment" className="accent-primary" />
            Airline Credit
          </label>
        </div>
      </div>
    </div>
  );
}
