export interface Exercise {
    exerciseId: string;
    exerciseName?: string;
    exerciseDate?: Date;
    exerciseReps: number[];
    exerciseWeights: number[];
    exerciseVolume?: number;
}