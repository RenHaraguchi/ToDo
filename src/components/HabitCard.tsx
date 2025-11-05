import { useMemo } from "react";
import type { HabitCardProps } from "../types";

export default function HabitCard({ name, history, onClickCard }: HabitCardProps) {
    const rows = useMemo(() => {
        const r: boolean[][] = [];
        for (let i = 0; i < 4; i++) r.push(history.slice(i * 7, i * 7 + 7));
        return r;
    }, [history]);

    const total = useMemo(() => history.filter(Boolean).length, [history]);

    return (
        <button
            type="button"
            onClick={onClickCard}
            className="rounded-2xl bg-white border border-gray-200 shadow-sm p-4 text-left hover:shadow transition"
            title="クリックして達成日を入力"
        >
            <div className="grid grid-cols-7 gap-1 ">
                {rows.flat().map((done, i) => (
                    <div
                        key={i}
                        className={"w-6 h-6 rounded-md " + (done ? "bg-red-500" : "bg-slate-200")}
                    />
                ))}
            </div>

            <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                    <span>🔥</span><span className="font-semibold">{total}</span>
                </div>
                <div className="opacity-80">{name}</div>
            </div>
        </button>
    );
}
