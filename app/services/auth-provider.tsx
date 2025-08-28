import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  User,
} from "firebase/auth";
import { auth as clientAuth, db } from "~/firebase.client";
import {
  useContext,
  createContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { useNavigate } from "react-router";
import { useFirestore } from "./firebase-hooks";
import { Collections } from "./firebase-data-service";
import { DateTime } from "luxon";
import { useUserData } from "~/services/user-data-hook";

const initialState: AuthState = {
  isAuthenticated: false,
  isInitialized: false,
  user: undefined,
};

interface AuthStateDispatch {
  type: string;
  payload: AuthState;
}

interface AuthState {
  isAuthenticated: boolean;
  isInitialized?: boolean;
  user: User | undefined;
}

const reducer = (state: AuthState, action: AuthStateDispatch) => {
  if (action.type === "INITIALISE") {
    const { isAuthenticated, user } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
    };
  }

  return state;
};

export function useAuth() {
  return useContext(AuthContext);
}

const AuthContext = createContext({
  ...initialState,
  loginWithGoogle: () => Promise.resolve(),
  logout: () => Promise.resolve(),
});

// AuthProvider.propTypes = {
//   children: PropTypes.node,
// };

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();
  const fs = useFirestore();

  const logout = async () => {
    await clientAuth.signOut();
    navigate("/");
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();

    await logout();
    console.log("loginWIthGoogle - Signed out");

    try {
      const res = await signInWithPopup(clientAuth, provider);
      console.log("loginWIthGoogle - Signed in");
      console.log(res);
      console.log(res.user.uid);

      dispatch({
        type: "INITIALISE",
        payload: { isAuthenticated: true, user: res.user },
      });
    } catch (err) {
      console.error("Sign in error", err);
    }
  };

  useEffect(() => {
    const unsubscribe = clientAuth.onAuthStateChanged((user) => {
      if (user) {
        dispatch({
          type: "INITIALISE",
          payload: { isAuthenticated: true, user },
        });
      } else {
        dispatch({
          type: "INITIALISE",
          payload: { isAuthenticated: false, user: undefined },
        });
      }
      dispatch({
        type: "INITIALISE",
        payload: {
          isAuthenticated: !!user,
          user: user ?? undefined,
        },
      });
    });
    return unsubscribe;
  }, [dispatch]);

  useEffect(() => {
    if (state.isAuthenticated && state.user) {
      // fs.updateDocument(Collections.USERS, state.user.uid, {
      //   lastLogin: DateTime.now(),
      // });
    }
  }, [state]);

  // const value = {
  //   signInWithGoogle,
  //   state.user,
  // };

  return (
    <AuthContext.Provider value={{ loginWithGoogle, logout, ...state }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };

// Add this new component in the same file
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isInitialized } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, isInitialized, navigate]);

  if (!isInitialized) return null;

  return isAuthenticated ? <>{children}</> : null;
}
