export type Todo = {
    id: number;
    text: string;
    done: boolean;
    due?: string;
};

export type Habit = {
    id: number;
    name: string;
    doneToday: boolean; 
};