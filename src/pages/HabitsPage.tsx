import { useEffect, useMemo, useState, type FormEvent } from "react";
import HabitCard from "../components/HabitCard";
import type { Habit } from "../types";

import { useAppStore } from "../app-store/context";
import { Button } from "../components/ui/button";
import { Calendar } from "../components/ui/calendar";
import { ja } from "date-fns/locale";

import { useFirebase } from "../hooks/useFirebase";


function dateToYmd(d?: Date) {
    if (!d) return "";
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

function toLocalMidnight(d: Date) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function daysDiffFromToday(iso: string): number | null {
    const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!m) return null;
    const today = toLocalMidnight(new Date());
    const target = toLocalMidnight(new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
    const diffMs = today.getTime() - target.getTime();
    const ONE_DAY = 24 * 60 * 60 * 1000;
    return Math.round(diffMs / ONE_DAY);
}



export default function HabitsPage() {
    const { habits, setHabits } = useAppStore();
    const [name, setName] = useState("");

    const [isOpen, setIsOpen] = useState(false);
    const [targetHabitId, setTargetHabitId] = useState<number | null>(null);

    const { fetchHabits } = useFirebase();

    const { today0, earliest0 } = useMemo(() => {

        const t0 = toLocalMidnight(new Date());
        const e0 = new Date(t0);
        e0.setDate(e0.getDate() - 27);
        return { today0: t0, earliest0: e0 };
    }, []);

    useEffect(() => {
        const load = async () => {
            // if(habits.length > 0) return; 
            const data = await fetchHabits();
            setHabits(data);
        }
        load();
    }, [fetchHabits, setHabits, habits.length]);


    function addHabit(e: FormEvent) {
        e.preventDefault();
        const v = name.trim();
        if (!v) return;
        const newHabit: Habit = { id: Date.now(), name: v, done: [] };
        setHabits(prev => [...prev, newHabit]);
        setName("");
    }

    function markDoneByDate(habitId: number, date: Date) {
        const iso = dateToYmd(toLocalMidnight(date));
        const diff = daysDiffFromToday(iso);
        if (diff == null || diff < 0 || diff > 27) {
            alert("直近28日（今日含む）のみ登録できます。");
            return;
        }
        setHabits(prev =>
            prev.map(h => {
                if (h.id !== habitId) return h;
                const doneArr = Array.isArray(h.done) ? h.done : []; // ← 防御
                return doneArr.includes(iso) ? h : { ...h, done: [...doneArr, iso] };
            })
        );
    }

    // ドット押下で呼ばれる（押す場所は既存のまま）
    function openPicker(habitId: number) {
        setTargetHabitId(habitId);
        setIsOpen(true);
    }

    // カレンダー選択時
    function handleSelect(d?: Date) {
        if (!d || targetHabitId == null) return;
        markDoneByDate(targetHabitId, d);
        setIsOpen(false);
        setTargetHabitId(null);
    }

    return (
        <div className="w-full relative">
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
                        doneDates={Array.isArray(h.done) ? h.done : []}
                        onClickCard={() => openPicker(h.id)}
                    />
                ))}
            </div>

            {habits.length === 0 && (
                <p className="text-sm text-gray-500 mt-2">まずは上のフォームから習慣を追加してみましょう。</p>
            )}

            {isOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
                    role="dialog"
                    aria-modal="true"
                    onClick={() => {
                        setIsOpen(false);
                        setTargetHabitId(null);
                    }}
                >
                    <div
                        className="bg-white rounded-xl shadow-xl p-3 w-[20rem] max-w-[92vw]"
                        onClick={e => e.stopPropagation()}
                    >
                        <Calendar
                            mode="single"
                            locale={ja}
                            // selected={today0}
                            onSelect={handleSelect}
                            defaultMonth={today0}
                            // 直近28日のみ選択可能にする
                            disabled={[
                                { before: earliest0 },
                                { after: today0 },
                            ]}
                            initialFocus
                        />
                        <div className="flex justify-between items-center gap-2 p-2 border-t mt-2">
                            <div className="text-xs text-gray-500">
                                選択可能： {dateToYmd(earliest0)} 〜 {dateToYmd(today0)}
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-xs"
                                    onClick={() => {
                                        setIsOpen(false);
                                        setTargetHabitId(null);
                                    }}
                                >
                                    閉じる
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
