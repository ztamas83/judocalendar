import { DateTime } from "luxon";
import { Timestamp, DocumentSnapshot } from "firebase/firestore";

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
  toFirestore: (user: UserData) => {
    return {
      participations: user.participations
        ? Array.from(user.participations)
        : [],
      role: user.role ?? "user",
      currentBelt: user.currentBelt ?? 5,
      lastLogin: Timestamp.fromMillis(user.lastLogin.toMillis()),
      updatedAt: Timestamp.now(),
    };
  },
  fromFirestore: (snapshot: DocumentSnapshot, options?): UserData => {
    const data = snapshot.data(options);
    if (!data) {
      throw new Error("Invalid data");
    }
    return {
      id: snapshot.id,
      role: data.role ?? "user",
      currentBelt: data.currentBelt,
      participations: new Set(data.participations ?? []),
      lastLogin: data.lastLogin,
      createdAt: DateTime.fromJSDate(data.createdAt.toDate()),
      // Map other fields as needed
    };
  },
};
