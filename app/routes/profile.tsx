import {
  AdditionalUserInfo,
  getAdditionalUserInfo,
  GoogleAuthProvider,
  OperationType,
  User,
  UserCredential,
} from "firebase/auth";
import { ad } from "node_modules/react-router/dist/development/route-data-Cw8htKcF.mjs";
import { ClientLoaderFunction, useLoaderData } from "react-router";
import { useAuth } from "~/services/auth-provider";

type LoaderData = {
  user: User;
  additionalInfo: AdditionalUserInfo;
};

export const clientLoader: ClientLoaderFunction = async ({ request }) => {};

export default function Profile() {
  const { user } = useAuth();

  const additionalInfo = getAdditionalUserInfo({
    user: user,
    providerId: "google.com",
    operationType: OperationType.SIGN_IN,
  } as UserCredential);

  if (!user) {
    return <div>User data not available</div>;
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="flex flex-col items-center">
          <img
            src={user.photoURL}
            alt={user.uid}
            className="w-24 h-24 rounded-full mb-4"
          />
          <h1 className="text-2xl font-bold mb-2">{user.displayName}</h1>
          <p className="text-gray-600">{user.email}</p>
          <p className="text-gray-600">{user.uid}</p>
        </div>
      </div>
    </div>
  );
}
