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
  beltHistory?: [
    {
      kyu: number;
      date: DateTime;
    }
  ];
  createdAt?: DateTime;
  updatedAt?: DateTime;
  lastLogin: DateTime;
  isAdmin: boolean;
}

// Firestore data converter
export const userConverter = {
  toFirestore: (user: Partial<UserData>): any => {
    console.log("storing user", user);
    return {
      updatedAt: Timestamp.now(),
      participations: Array.from(user.participations ?? []),
      beltHistory:
        user.beltHistory?.map((bh) => ({
          kyu: bh.kyu,
          date: Timestamp.fromMillis(bh.date.toMillis()),
        })) || null,
    } as any;
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
    const userDao = {
      id: snapshot.id,
      role: data.role ?? "unknown",
      beltHistory:
        data.beltHistory?.map((bh: any) => ({
          kyu: bh.kyu,
          date: DateTime.fromJSDate(bh.date.toDate()),
        })) ?? [],
      participations: new Set(data.participations ?? []),
      lastLogin: data.lastLogin,
      createdAt: DateTime.fromJSDate(data.createdAt?.toDate() ?? 0),
      // Map other fields as needed
      isAdmin: data.role === "admin",
    };

    if (userDao.beltHistory.length === 0) {
      userDao.beltHistory.push({ kyu: 6, date: userDao.createdAt });
    }

    console.log("created userDao:", userDao);

    return userDao;
  },
};
