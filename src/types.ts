export type Todo = {
    id: number;
    text: string;
    done: boolean;
    due?: string;
};

export type Habit = {
    id: number;
    name: string;
    done: string[];
};

export type HabitCardProps = {
    name: string;
    doneDates: string[];       
    onClickCard: () => void; 
};