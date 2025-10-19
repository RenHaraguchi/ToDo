import { useState, type FormEvent} from "react";
import type { Todo } from "../types";

export default function TasksPage() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [text, setText] = useState('');

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        const value = text.trim();
        if (!value) return;
        setTodos((prev) => [...prev, { id: Date.now(), text: value, done: false }]);
        setText('');
    }

    function toggle(id: number) {
        setTodos((prev) =>
            prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
        );
    }

    function remove(id: number) {
        setTodos((prev) => prev.filter((t) => t.id !== id));
    }

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
                <button 
                    type="submit"
                    disabled={!text.trim()}
                    className="px-3 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    追加
                </button>
            </form>

            <ul className="todo-list">
                {todos.map((todo) => (
                    <li key={todo.id} className="todo-item">
                        <label>
                            <input
                                type="checkbox"
                                checked={todo.done}
                                onChange={() => toggle(todo.id)}
                                aria-label={`${todo.text} を${todo.done ? '未完了' : '完了'}にする`}
                            />
                            <span className={todo.done ? 'done' : ''}>{todo.text}</span>
                        </label>
                        <button
                            className="delete"
                            onClick={() => remove(todo.id)}
                            aria-label={`${todo.text} を削除`}
                            title="削除"
                        >
                            削除
                        </button>
                    </li>
                ))}
            </ul>

            <p className="meta">
                残り {todos.filter((t) => !t.done).length} 件 / 合計 {todos.length} 件
            </p>
        </div>
    );
}
