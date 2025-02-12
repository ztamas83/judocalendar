import { DateTime } from "luxon";
import {
  Timestamp,
  DocumentSnapshot,
  SnapshotOptions,
} from "firebase/firestore";

export interface UserData {
  id: string;
  participations: Set<string>;
  role?: string;
  currentBelt: number;
  createdAt?: DateTime;
  updatedAt?: DateTime;
  lastLogin: DateTime;
}

// Firestore data converter
export const userConverter = {
  toFirestore: (user: UserData): any => {
    const firestoreData = {
      updatedAt: Timestamp.now(),
    } as any;

    if (user.participations) {
      firestoreData.participations = Array.from(user.participations);
    }

    if (user.currentBelt > 0) {
      firestoreData.currentBelt = user.currentBelt;
    }
    return firestoreData;
  },
  fromFirestore: (
    snapshot: DocumentSnapshot,
    options?: SnapshotOptions
  ): UserData => {
    const data = snapshot.data(options);
    console.log(data);
    if (!data) {
      throw new Error("Invalid data");
    }
    return {
      id: snapshot.id,
      role: data.role ?? "unknown",
      currentBelt: data.currentBelt ?? -1,
      participations: new Set(data.participations ?? []),
      lastLogin: data.lastLogin,
      createdAt: DateTime.fromJSDate(data.createdAt?.toDate() ?? 0),
      // Map other fields as needed
    };
  },
};
