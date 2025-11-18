import { useEffect, useState } from "react";
import type { Todo, Habit } from "../types";
import { StoreCtx, type Store } from "./context";

function useLocalStorageState<T>(key: string, initial: T) {
    const [state, setState] = useState<T>(() => {
        try {
            const raw = typeof window !== "undefined" ? localStorage.getItem(key) : null;
            return raw ? (JSON.parse(raw) as T) : initial;
        } catch {
            return initial;
        }
    });
    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(state));
        } catch {
            /* storage容量/権限で失敗してもアプリは動作継続 */
        }
    }, [key, state]);

    return [state, setState] as const;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [todos, setTodos] = useLocalStorageState<Todo[]>("todoapp.todos.v1", []);
    const [habits, setHabits] = useLocalStorageState<Habit[]>("todoapp.habits.v1", []);
    const value: Store = { todos, setTodos, habits, setHabits };
    return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}
