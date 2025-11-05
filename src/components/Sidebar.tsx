type Props = {
    page: "tasks" | "habits";
    onNavigate: (p: "tasks" | "habits") => void;
};

export default function Sidebar({ page, onNavigate }: Props) {
    return (
        <nav className="border-r border-gray-200">
            <h1 className="text-2xl font-semibold mb-10">My Productivity</h1>
            {/* <nav>
                <h2 className="mb-2">表示</h2>
                <button
                    className={
                        "w-full text-left px-3 py-2 rounded-lg border mb-2 " +
                        (page === "view"
                            ? "bg-slate-900 text-white border-slate-900"
                            : "bg-white hover:bg-gray-50 border-gray-300")
                    }
                    onClick={() => onNavigate("view")}
                >
                    ToDo
                </button>
            </nav> */}
            <nav className="grid gap-2">
                <h2>入力</h2>
                <button
                    className={
                        "text-left px-3 py-2 rounded-lg border " +
                        (page === "tasks"
                            ? "bg-slate-900 text-white border-slate-900"
                            : "bg-white hover:bg-gray-50 border-gray-300")
                    }
                    onClick={() => onNavigate("tasks")}
                >
                    単一タスク
                </button>
                <button
                    className={
                        "text-left px-3 py-2 rounded-lg border " +
                        (page === "habits"
                            ? "bg-slate-900 text-white border-slate-900"
                            : "bg-white hover:bg-gray-50 border-gray-300")
                    }
                    onClick={() => onNavigate("habits")}
                >
                    習慣トラッカー
                </button>
            </nav>
        </nav>
    );
}
