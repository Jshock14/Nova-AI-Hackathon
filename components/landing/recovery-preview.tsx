import { Icon } from "@/components/ui/icon";

export function RecoveryPreview() {
  return (
    <section className="w-full bg-slate-100 dark:bg-slate-900/50 py-16 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="order-2 md:order-1">
          <div className="aspect-video bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden relative border border-slate-200 dark:border-slate-700">
            <div className="absolute top-4 left-4 flex gap-2">
              <div className="size-3 rounded-full bg-red-400" />
              <div className="size-3 rounded-full bg-amber-400" />
              <div className="size-3 rounded-full bg-green-400" />
            </div>
            <div className="relative p-6 h-full flex flex-col pt-14">
              <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-100 dark:border-slate-600 flex items-center justify-between mb-4">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">NYC &gt; SFO</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">1:30 PM</p>
                </div>
                <div className="text-right">
                  <p className="text-red-600 dark:text-red-400 font-bold text-sm">DELAYED</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">10 hrs</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="order-1 md:order-2 text-left">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-slate-900 dark:text-white">
            Real-time recovery monitoring
          </h2>
          <ul className="space-y-4">
            <li className="flex items-center gap-3">
              <Icon name="check_circle" className="text-green-500 shrink-0" />
              <span className="font-medium text-slate-900 dark:text-slate-100">
                Automatically scan for flight changes
              </span>
            </li>
            <li className="flex items-center gap-3">
              <Icon name="check_circle" className="text-green-500 shrink-0" />
              <span className="font-medium text-slate-900 dark:text-slate-100">
                Instant notifications
              </span>
            </li>
            <li className="flex items-center gap-3">
              <Icon name="check_circle" className="text-green-500 shrink-0" />
              <span className="font-medium text-slate-900 dark:text-slate-100">
                Access to dedicated support
              </span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
