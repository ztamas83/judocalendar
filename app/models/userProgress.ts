import { TrainingData } from "~/routes/trainings";
import { FirestoreItem } from "./firestoreItem";

interface TkpData extends FirestoreItem {
  kyu: number;
}

interface UserProgress {
  userId: string;
  coveredTkps: TkpData[];
}

export { type UserProgress };
