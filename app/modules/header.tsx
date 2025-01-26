import { useContext } from "react";
import { Link } from "react-router";
import { useAuth } from "~/services/auth-provider";

export default function Header() {
  const { loginWithGoogle, logout, user } = useAuth();

  return (
    <header className="bg-gray-800 text-white p-4">
      <nav className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link to="/" className="text-xl font-bold">
            JudoCalendar
          </Link>
          <Link
            to="/profile"
            className="hover:text-gray-500 transition-colors pointer-events-none"
          >
            My Profile
          </Link>
          <Link
            to="/trainings"
            className="hover:text-gray-500 transition-colors"
          >
            Trainings
          </Link>
          <Link
            to="/techniques"
            className="hover:text-gray-500 transition-colors disabled:opacity-50 "
          >
            Techniques
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-2">
              <img
                src={user.photoURL}
                alt={user.displayName}
                className="border rounded-full h-10"
              />
              <button
                onClick={logout}
                className="text-xs rounded-md bg-red-600 p-1"
              >
                Logout
              </button>
            </div>
          ) : (
            <button onClick={loginWithGoogle} className="text-xs">
              Login
            </button>
          )}
          {/* <span>{user?.displayName}</span>
          <Link
            to="/logout"
            className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Logout
          </Link> */}
        </div>
      </nav>
    </header>
  );
}
