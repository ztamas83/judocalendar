import React from "react";
import { Card, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { AdditionalUserInfo, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { useUserData } from "~/services/user-data-hook";

import { ProgressData } from "~/components/progress-data";
import { ProfilePage } from "~/components/ProfilePage";

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
  const [isLoggedin, userData] = useUserData();

  const [selectedSubPage, setSelectedSubPage] = useState("profile");

  if (!userData || !isLoggedin) {
    return <div>User data not available</div>;
  }

  function renderContent() {
    switch (selectedSubPage) {
      case "profile":
        return (
          <>
            <ProfilePage />
          </>
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
