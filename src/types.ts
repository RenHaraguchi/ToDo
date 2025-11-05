export type Todo = {
    id: number;
    text: string;
    done: boolean;
    due?: string;
};

export type Habit = {
    id: number;
    name: string;
    history: boolean[]; 
};

export type HabitCardProps = {
    name: string;
    history: boolean[];       
    onClickCard: () => void;  
};