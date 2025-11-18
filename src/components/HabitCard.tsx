import { useMemo } from "react";
import type { HabitCardProps } from "../types";

function lastNDaysIso(n: number): string[] {
    const t = new Date();
    const t0 = new Date(t.getFullYear(), t.getMonth(), t.getDate());
    const iso = (d: Date) =>
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
            d.getDate()
        ).padStart(2, "0")}`;
    const res: string[] = [];
    for (let i = 0; i < n; i++) {
        const d = new Date(t0);
        d.setDate(d.getDate() - i);
        res.push(iso(d));
    }
    return res;
}


export default function HabitCard({ name, doneDates, onClickCard }: HabitCardProps) {
    const doneSet = useMemo(() => new Set(doneDates), [doneDates]);
    const days = useMemo(() => lastNDaysIso(28), []);

    return (
        <button
            type="button"
            onClick={onClickCard}
            className="text-left rounded-xl border p-3 hover:shadow-sm transition bg-white"
            aria-label={`${name} の達成日を選択`}
        >
            <div className="font-medium mb-3">{name}</div>
            <div className="grid grid-cols-7 gap-1">
                {days.map((ymd) => {
                    const done = doneSet.has(ymd);
                    return (
                        <div
                            key={ymd}
                            className={[
                                "h-5 w-5 rounded-sm",
                                done ? "bg-red-500" : "bg-gray-200",
                            ].join(" ")}
                            title={ymd + (done ? "：達成" : "：未達")}
                            aria-label={ymd + (done ? "：達成" : "：未達")}
                        />
                    );
                })}
            </div>
        </button>
    );
}