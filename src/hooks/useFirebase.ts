import { useCallback, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../utils/firebase";
import type { Todo, Habit } from "../types";

type UseFirebaseReturn = {
    loading: boolean;
    error: string | null;
    fetchTodos: () => Promise<Todo[]>;
    fetchHabits: () => Promise<Habit[]>;
};

export const useFirebase = (): UseFirebaseReturn => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // todos コレクションから取得
    const fetchTodos = useCallback(async (): Promise<Todo[]> => {
        setLoading(true);
        setError(null);
        try {
            const snap = await getDocs(collection(db, "todos"));
            const todos: Todo[] = snap.docs.map((doc) => {
                const data = doc.data() as Todo;
                return {
                    id: data.id,                    // Firestore のフィールド id
                    text: data.text ?? "",
                    done: Boolean(data.done),
                    // due が無い or 空なら undefined にしておく
                    due: data.due ? String(data.due) : undefined,
                };
            });
            return todos;
        } catch (e) {
            console.error("fetchTodos error", e);
            setError("タスクの取得に失敗しました。");
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    // habits コレクションから取得
    const fetchHabits = useCallback(async (): Promise<Habit[]> => {
        setLoading(true);
        setError(null);
        try {
            const snap = await getDocs(collection(db, "habits"));
            const habits: Habit[] = snap.docs.map((doc) => {
                const data = doc.data() as Habit;
                return {
                    id: data.id,
                    name: data.name ?? "",
                    // Firestore 側では string の配列として保存している前提
                    done: Array.isArray(data.done) ? data.done.map(String) : [],
                };
            });
            return habits;
        } catch (e) {
            console.error("fetchHabits error", e);
            setError("習慣の取得に失敗しました。");
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    return { loading, error, fetchTodos, fetchHabits };
};
