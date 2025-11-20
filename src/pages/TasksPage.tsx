import { useEffect, useState, type FormEvent } from "react";
import type { Todo } from "../types";
import DueDatePicker from "../components/DueDatePicker";
import { useAppStore } from "../app-store/context";
import { useFirebase } from "../hooks/useFirebase";


export default function TasksPage() {
    const { todos, setTodos } = useAppStore();
    const [text, setText] = useState('');
    const [due, setDue] = useState('');

    const { fetchTodos } = useFirebase();

    const today = new Date().toISOString().slice(0, 10);

    useEffect(() => {
        const load = async () => {
            // if(todos.length > 0) return; 
            const data = await fetchTodos();
            setTodos(data);
        }
        load();
    }, [fetchTodos, setTodos, todos.length]);


    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        const value = text.trim();
        if (!value) return;
        setTodos((prev) => [...prev, { id: Date.now(), text: value, done: false, due: due || undefined }]);
        setText('');
        setDue('');
    }

    function toggle(id: number) {
        setTodos((prev) =>
            prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
        );
    }

    function remove(id: number) {
        setTodos((prev) => prev.filter((t) => t.id !== id));
    }

    function isOverdue(t: Todo) {
        return !!t.due && !t.done && t.due < today;
    }

    function updateDue(id: number, newDue: string) {
        setTodos(prev =>
            prev.map(t => (t.id === id ? { ...t, due: newDue || undefined } : t)),
        );
    }

    const sortedTodos = [...todos].sort((a, b) => {
        if (a.due && b.due) return a.due.localeCompare(b.due); // 期日あり同士は昇順
        if (a.due) return -1;  // aだけ期日あり → 先
        if (b.due) return 1;   // bだけ期日あり → 後
        return 0;              // 両方なし → そのまま
    });

    return (
        <div className="w-full">
            <h2 className="text-2xl font-bold mb-6">ToDo</h2>

            <form onSubmit={handleSubmit} className="todo-form flex gap-2 mb-3" aria-label="ToDo 追加フォーム">
                <input
                    value={text}
                    onChange={e => setText(e.target.value)}
                    placeholder="例）ESを提出する、買い物に行く、書類を提出する"
                    className="flex-1 px-2.5 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-sky-400"
                />
                <DueDatePicker
                    value={due}
                    onChange={setDue}
                    min={today}
                    className="px-2.5 py-2"
                />
                <button
                    type="submit"
                    disabled={!text.trim()}
                    className="px-3 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    追加
                </button>
            </form>

            <ul className="todo-list">
                {sortedTodos.map((todo) => (
                    <li key={todo.id} className="todo-item bg-slate-100 rounded-lg p-3 mb-2 flex items-center border-2">
                        <label className="flex-1 min-w-0">
                            <input
                                type="checkbox"
                                checked={todo.done}
                                onChange={() => toggle(todo.id)}
                                aria-label={`${todo.text} を${todo.done ? '未完了' : '完了'}にする`}
                                className="mr-3 align-middle"
                            />
                            <span className={todo.done ? 'done' : ''}>{todo.text}</span>
                        </label>
                        <div className="ml-3 shrink-0 flex items-center gap-2">
                            <DueDatePicker
                                value={todo.due ?? ""}
                                onChange={(v) => updateDue(todo.id, v)}  // 選択したら即反映
                                min={today}
                                // ← 見た目は今までの“小さめのピル”と同じ色分け
                                className={
                                    'inline-flex items-center rounded px-2 py-0.5 text-[11px] ' +
                                    (todo.due
                                        ? (isOverdue(todo) ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600')
                                        : 'bg-gray-100 text-gray-600')
                                }
                            />
                            <button
                                onClick={() => remove(todo.id)}
                                aria-label={`${todo.text} を削除`}
                                title="削除"
                                className="px-1.5 leading-none text-sm text-slate-600 hover:text-red-600"
                            >
                                削除
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            <p className="meta">
                残り {todos.filter((t) => !t.done).length} 件 / 合計 {todos.length} 件
            </p>
        </div>
    );
}
