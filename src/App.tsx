import { useState, type FormEvent, type ChangeEvent } from 'react';


type Todo = {
  id: number;
  text: string;
  done: boolean;
  due?: string;
};

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState('');
  const [due, setDue] = useState('');

  const [editingDueId, setEditingDueId] = useState<number | null>(null);
  const today = new Date().toISOString().slice(0, 10);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;
    setTodos(prev => [...prev, { id: Date.now(), text: value, done: false, due: due || undefined }]);
    setText('');
    setDue('');
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setText(e.target.value);
  }

  function toggle(id: number) {
    setTodos(prev =>
      prev.map(t => (t.id === id ? { ...t, done: !t.done } : t)),
    );
  }

  function remove(id: number) {
    setTodos(prev => prev.filter(t => t.id !== id));
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
    <div className="max-w-[480px] mx-auto my-12 p-4">
      <h1 className="text-2xl font-bold mb-10">ToDo</h1>

      <form
        onSubmit={handleSubmit}
        className="flex gap-2 mb-3"
        aria-label="ToDo 追加フォーム"
      >
        <input
          value={text}
          onChange={handleChange}
          placeholder="やることを入力して Enter"
          aria-label="新しいToDo"
          autoFocus
          className="flex-1 px-2.5 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-sky-400"
        />
        <input
          type="date"
          value={due}
          onChange={e => setDue(e.target.value)}
          min={today}
          aria-label="期限"
          className="px-2.5 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-sky-400"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="px-3 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          追加
        </button>
      </form>

      <ul className="list-none p-0 m-0 grid gap-2">
        {sortedTodos.map(todo => (
          <li
            key={todo.id}
            className="flex items-start justify-between bg-gray-100 border border-gray-200 rounded-xl px-3 py-2 text-slate-900"
          >
            <div className="flex items-start gap-3 flex-1">
              <input
                id={`todo-${todo.id}`}
                type="checkbox"
                checked={todo.done}
                onChange={() => toggle(todo.id)}
                className="mt-1"
                aria-label={`${todo.text} を${todo.done ? '未完了' : '完了'}にする`}
              />

              <label htmlFor={`todo-${todo.id}`} className="select-none cursor-pointer">
                <div className={todo.done ? 'line-through opacity-60' : ''}>{todo.text}</div>
              </label>
            </div>

            <div className="flex items-center gap-2 pl-3">
              {editingDueId === todo.id ? (
                <input
                  type="date"
                  value={todo.due ?? ''}
                  onChange={(e) => updateDue(todo.id, e.target.value)}
                  onBlur={() => setEditingDueId(null)}
                  min={today}
                  className="px-2 py-1 border border-gray-300 rounded-md text-xs"
                  autoFocus
                  aria-label="締切日を変更"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setEditingDueId(todo.id)}
                  className={
                    'inline-flex items-center rounded px-2 py-0.5 text-[11px] ' +
                    (todo.due
                      ? (isOverdue(todo) ? 'bg-red-100 text-red-700' : 'bg-sky-100 text-sky-700')
                      : 'bg-gray-100 text-gray-600')
                  }
                  title={todo.due ? 'クリックして締切を変更' : 'クリックして締切を設定'}
                >
                  {todo.due ? (
                    <>
                      締切 {todo.due}
                      {isOverdue(todo) && <span className="ml-1">（期限切れ）</span>}
                    </>
                  ) : (
                    '期日なし'
                  )}
                </button>
              )}

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

      <p className="text-xs text-gray-600 mt-2">
        残り {todos.filter(t => !t.done).length} 件 / 合計 {todos.length} 件
      </p>
    </div>
  );
}
