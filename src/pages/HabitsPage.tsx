import { useState, type FormEvent } from "react";
import HabitCard from "../components/HabitCard";
import type { Habit } from "../types";

function daysDiffFromToday(iso: string): number | null {
    const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!m) return null;
    const toLocalMidnight = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const today = toLocalMidnight(new Date());
    const target = toLocalMidnight(new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
    const diffMs = today.getTime() - target.getTime();
    const ONE_DAY = 24 * 60 * 60 * 1000;
    return Math.round(diffMs / ONE_DAY);
}

export default function HabitsPage() {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [name, setName] = useState("");

    function addHabit(e: FormEvent) {
        e.preventDefault();
        const v = name.trim();
        if (!v) return;
        setHabits(prev => [...prev, { id: Date.now(), name: v, history: Array(28).fill(false) }]);
        setName("");
    }

    function markByDate(habitId: number) {
        const input = prompt("達成した日付を YYYY-MM-DD で入力（例: 2025-10-19）");
        if (!input) return;
        const diff = daysDiffFromToday(input);
        if (diff == null) return alert("フォーマットは YYYY-MM-DD です。");
        if (diff < 0 || diff > 27) return alert("直近28日（今日含む）だけ指定できます。");

        setHabits(prev =>
            prev.map(h =>
                h.id !== habitId
                    ? h
                    : { ...h, history: h.history.map((d, i) => (i === diff ? true : d)) }
            )
        );
    }

    return (
        <div className="w-full">
            <h2 className="text-2xl font-bold mb-6">習慣トラッカー</h2>

            <form onSubmit={addHabit} className="flex gap-2 mb-4" aria-label="習慣追加フォーム">
                <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="例）5分筋トレ、2km走る、5分勉強、5分読書"
                    className="flex-1 px-2.5 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-sky-400"
                />
                <button
                    type="submit"
                    disabled={!name.trim()}
                    className="px-3 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    追加
                </button>
            </form>

            <div className="grid grid-cols-4 gap-4">
                {habits.map(h => (
                    <HabitCard
                        key={h.id}
                        name={h.name}
                        history={h.history}
                        onClickCard={() => markByDate(h.id)}
                    />
                ))}
            </div>

            {habits.length === 0 && (
                <p className="text-sm text-gray-500 mt-2">まずは上のフォームから習慣を追加してみましょう。</p>
            )}
        </div>
    );
}
