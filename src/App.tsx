import { useState, type FormEvent, type ChangeEvent } from 'react';
import './App.css';

type Todo = {
  id: number;
  text: string;
  done: boolean;
};

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;
    setTodos((prev) => [...prev, { id: Date.now(), text: value, done: false }]);
    setText('');
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setText(e.target.value);
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
    <div className="app">
      <h1>ToDo</h1>

      <form onSubmit={handleSubmit} className="todo-form" aria-label="ToDo 追加フォーム">
        <input
          value={text}
          onChange={handleChange}
          placeholder="やることを入力して Enter"
          aria-label="新しいToDo"
          autoFocus
        />
        <button type="submit" disabled={!text.trim()}>
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
