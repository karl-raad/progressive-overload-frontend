export interface Exercise {
    exerciseId: string;
    exerciseName: string;
    exerciseDate?: Date;
    exerciseReps: number[];
    exerciseWeights: number[];
    exerciseVolume?: number;
    userEmail: string;
}

export interface ExerciseData {
    exerciseDataId: string;
    exerciseDataName: string;
}