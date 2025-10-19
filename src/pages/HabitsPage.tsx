import { useState, type FormEvent } from "react";
import type { Habit } from "../types";

export default function HabitsPage() {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [name, setName] = useState("");

    function addHabit(e: FormEvent) {
        e.preventDefault();
        const v = name.trim();
        if (!v) return;
        setHabits(prev => [...prev, { id: Date.now(), name: v, doneToday: false }]);
        setName("");
    }
    function toggleToday(id: number) {
        setHabits(prev => prev.map(h => (h.id === id ? { ...h, doneToday: !h.doneToday } : h)));
    }
    function removeHabit(id: number) {
        setHabits(prev => prev.filter(h => h.id !== id));
    }

    return (
        <div className="w-full">
            <h2 className="text-2xl font-bold mb-6">Habit</h2>

            <form onSubmit={addHabit} className="flex gap-2 mb-3" aria-label="習慣追加フォーム">
                <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="例）英単語30語、10分瞑想、腕立て20回"
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

            <ul className="grid gap-2">
                {habits.map(h => (
                    <li key={h.id} className="flex items-center justify-between bg-gray-100 border border-gray-200 rounded-xl px-3 py-2">
                        <label className="flex items-center gap-3">
                            <input type="checkbox" checked={h.doneToday} onChange={() => toggleToday(h.id)} />
                            <span>{h.name}</span>
                        </label>
                        <button
                            onClick={() => removeHabit(h.id)}
                            className="px-1.5 leading-none text-sm text-slate-600 hover:text-red-600"
                            aria-label={`${h.name} を削除`}
                        >
                            削除
                        </button>
                    </li>
                ))}
            </ul>

            {habits.length === 0 && (
                <p className="text-sm text-gray-500">まずは上のフォームから習慣を追加してみましょう。</p>
            )}
        </div>
    );
}
