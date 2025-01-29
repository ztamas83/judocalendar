import { Card, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import {
  AdditionalUserInfo,
  getAdditionalUserInfo,
  GoogleAuthProvider,
  OperationType,
  User,
  UserCredential,
} from "firebase/auth";
import { DocumentSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ClientLoaderFunction } from "react-router";
import { CardContent } from "~/components";
import { UserData, userConverter } from "~/models/userData";
import { useAuth } from "~/services/auth-provider";
import { Collections } from "~/services/firebase-data-service";
import { useFirestore } from "~/services/firebase-hooks";
import { useUserData } from "~/services/user-data-hook";

type LoaderData = {
  user: User;
  additionalInfo: AdditionalUserInfo;
};

export const clientLoader: ClientLoaderFunction = async ({ request }) => {};

export default function Profile() {
  const { user } = useAuth();
  const fb = useFirestore();

  const [userData, setUserdata] = useUserData(user);

  if (!userData) {
    return <div>User data not available</div>;
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Card>
        <CardContent>
          <div className="flex items-center flex-col">
            <img
              src={user.photoURL}
              alt={user.uid}
              className="w-24 h-24 rounded-full mb-4"
            />
            <h1 className="text-2xl font-bold mb-2">
              {user.displayName} {userData?.role == "admin" ? "(Admin)" : ""}
            </h1>
            <div className="p-2 mb-2">
              Participations: {userData?.participations}
            </div>
            <div className="w-full">
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Current belt
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  defaultValue={6}
                  value={userData.currentBelt}
                  label="Current belt"
                  onChange={(event) =>
                    setUserdata({
                      ...userData,
                      currentBelt: +event.target.value,
                    })
                  }
                >
                  <MenuItem value={6}>White</MenuItem>
                  <MenuItem value={5}>Yellow</MenuItem>
                  <MenuItem value={4}>Orange</MenuItem>
                  <MenuItem value={3}>Green</MenuItem>
                  <MenuItem value={2}>Blue</MenuItem>
                  <MenuItem value={1}>Brown</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="flex flex-col items-center">

        </div>
      </div> */}
    </div>
  );
}
