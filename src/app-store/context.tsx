import { createContext, useContext } from "react";
import type { Todo, Habit } from "../types";

export type Store = {
    todos: Todo[];
    setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
    habits: Habit[];
    setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
};

export const StoreCtx = createContext<Store | null>(null);

export function useAppStore() {
    const ctx = useContext(StoreCtx);
    if (!ctx) throw new Error("useAppStore must be used inside <AppProvider>");
    return ctx;
}
