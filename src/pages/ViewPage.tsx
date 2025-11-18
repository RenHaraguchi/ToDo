import { useMemo } from "react";
import { useAppStore } from "../app-store/context"; 
import type { Todo, Habit } from "../types";

// ===== 日付ユーティリティ（YYYY-MM-DD 前提で安全に比較） =====
function toYmd(d: Date) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}
function addDaysYmd(ymd: string, days: number) {
    const [y, m, d] = ymd.split("-").map(Number);
    const dt = new Date(y!, (m! - 1), d!);
    dt.setDate(dt.getDate() + days);
    return toYmd(dt);
}
function todayYmd() {
    return toYmd(new Date());
}

export default function ViewPage() {
    const { todos, habits } = useAppStore();
    const today = todayYmd();
    const until = addDaysYmd(today, 7); // 1週間先（今日から7日後）まで
    const last7 = useMemo(
        () => Array.from({ length: 7}, (_, i) => addDaysYmd(today, -i)),
        [today]
    );

    // 期限切れタスク（未完了）を抽出して日付昇順→テキストで安定ソート
    const overdueTodos = useMemo(() => {
        return todos
            .filter((t) : t is Todo & { due: string} => !!t.due)
            .filter(t => !t.done && t.due < today)
            .sort((a, b) => a.due.localeCompare(b.due) || a.text.localeCompare(b.text));
    }, [todos, today]);

    // 1週間以内の〆切タスク（未完了）を抽出して日付昇順→テキストで安定ソート
    const upcomingTodos = useMemo(() => {
        return todos
            .filter((t): t is Todo & { due: string } => !!t.due)
            .filter(t => !t.done && t.due >= today && t.due <= until)
            .sort((a, b) => a.due.localeCompare(b.due) || a.text.localeCompare(b.text));
    }, [todos, today, until]);

    return (
        <div className="space-y-8">
            {/* 習慣：全件表示 */}
            <section>
                <h2 className="text-2xl font-bold mb-3">習慣</h2>
                {habits.length === 0 ? (
                    <p className="text-sm text-slate-500">まだ習慣がありません。</p>
                ) : (
                    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {habits.map((h: Habit) => (
                            <li key={h.id} className="rounded-lg border bg-white p-3">
                                <div className="font-medium">{h.name}</div>
                                {/* 直近7日の簡易ドット表示（history を左→右に最新と仮定して適当に可視化） */}
                                <div className="mt-2 flex gap-1">
                                    {last7.map((ymd) => {
                                        const done = (h.done ?? []).includes(ymd);
                                        return (
                                            <span
                                                key={ymd}
                                                className={"inline-block size-2 rounded-full " + (done ? "bg-emerald-500" : "bg-slate-300")}
                                                title={`${ymd}:${done ? "達成" : "未達"}`}
                                            />
                                        );
                                    })}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            {/* タスク：期限切れのものを表示 */}
            <section>
                <h2 className="text-2xl font-bold mb-3">期限切れのタスク</h2>
                {overdueTodos.length === 0 ? (
                    <p className="text-sm text-slate-500">
                        期限切れのタスクはありません。
                    </p>
                ) : (
                    <ul className="space-y-2">
                        {overdueTodos.map(t => (
                            <li key={t.id} className="flex items-center justify-between rounded-lg border bg-white px-3 py-2">
                                <div className="min-w-0">
                                    <div className="truncate">{t.text}</div>
                                    <div className="text-xs text-slate-500">締切: {t.due}</div>
                                </div>
                                    {/* 必要ならここに「完了にする」や「期日変更」ボタンを置けます */}
                            </li>
                        ))}
                    </ul>
                )}
            </section>


            {/* タスク：1週間以内に締切のものを表示 */}
            <section>
                <h3 className="text-2xl font-bold mb-3">1週間以内のタスク</h3>
                {upcomingTodos.length === 0 ? (
                    <p className="text-sm text-slate-500">
                        直近1週間以内に締切のタスクはありません。（期間：{today} 〜 {until}）
                    </p>
                ) : (
                    <ul className="space-y-2">
                        {upcomingTodos.map(t => (
                            <li key={t.id} className="flex items-center justify-between rounded-lg border bg-white px-3 py-2">
                                <div className="min-w-0">
                                    <div className="truncate">{t.text}</div>
                                    <div className="text-xs text-slate-500">締切: {t.due}</div>
                                </div>
                                {/* 必要ならここに「完了にする」や「期日変更」ボタンを置けます */}
                            </li>
                        ))}
                    </ul>
                )}
                <p className="mt-2 text-xs text-slate-400">表示期間：{today} 〜 {until}</p>
            </section>
        </div>
    );
}
