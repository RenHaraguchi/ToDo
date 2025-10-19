import { useState } from 'react';
import Sidebar from './components/Sidebar';
import TasksPage from './pages/TasksPage';
import HabitsPage from './pages/HabitsPage';

export default function App(){
  const [page, setPage] = useState<"tasks" | "habits">("tasks");

  return (
    <div className = "min-h-screen grid grid-cols-10 bg-white text-slate-900">
      <aside className="col-span-2 p-6">
        <Sidebar page={page} onNavigate={setPage} />
      </aside>
      <main className="col-span-8 p-6">
        {page === "tasks" ? <TasksPage /> : <HabitsPage />}
      </main>
    </div>
  );
}
