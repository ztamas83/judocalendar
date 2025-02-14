import { Card, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { AdditionalUserInfo, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { useAuth } from "~/services/auth-provider";
import { useFirestore } from "~/services/firebase-hooks";
import { useUserData } from "~/services/user-data-hook";
import { EditIcon } from "@mui/icons-material";
import { CardContent } from "~/components/ui/card";
import { ProgressData } from "~/components/progress-data";

type LoaderData = {
  user: User;
  additionalInfo: AdditionalUserInfo;
};

const subPages = [
  {
    label: "Profile",
    value: "profile",
  },
  {
    label: "Settings",
    value: "settings",
  },
  {
    label: "Progress",
    value: "progress",
  },
];

export default function Profile() {
  const { user } = useAuth();
  const fb = useFirestore();

  const [isLoggedin, userData, setUserdata] = useUserData(user);
  const [editMode, setEditMode] = useState(false);
  const [selectedSubPage, setSelectedSubPage] = useState("profile");

  if (!userData || !isLoggedin) {
    return <div>User data not available</div>;
  }

  function renderContent() {
    switch (selectedSubPage) {
      case "profile":
        return (
          <div className="flex flex-col items-center justify-center min-h-screen">
            <Card>
              <CardContent>
                <div className="grid grid-cols-1 grid-rows-auto">
                  <div className="grid grid-cols-3">
                    <div />
                    <img
                      src={user.photoURL ?? ""}
                      alt={user.uid}
                      className="w-24 h-24 rounded-full mb-4"
                    />
                    <div className="grid text-right">Edit</div>
                  </div>
                  <h1 className="grid text-2xl text-center font-bold mb-2">
                    {user.displayName}{" "}
                    {userData?.role == "admin" ? "(Admin)" : ""}
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
                        disabled={!editMode}
                        value={userData.currentBelt ?? 6}
                        label="Current belt"
                        onChange={(event) =>
                          setUserdata({
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
          </div>
        );
      case "progress":
        return (
          <div>
            <ProgressData />
          </div>
        );
    }
  }

  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-gray-100 p-4">
        <nav>
          <ul className="space-y-2">
            {subPages.map((page) => (
              <li key={page.value}>
                <button
                  onClick={() => setSelectedSubPage(page.value)}
                  className={`w-full text-left px-4 py-2 rounded ${
                    selectedSubPage === page.value
                      ? "bg-blue-500 text-white"
                      : "hover:bg-gray-200"
                  }`}
                >
                  {page.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <main className="flex-1">{renderContent()}</main>
    </div>
  );
}
