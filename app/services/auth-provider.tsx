import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  User,
} from "firebase/auth";
import { auth as clientAuth } from "~/firebase.client";
import { useContext, createContext, useEffect, useReducer } from "react";
import { useNavigate } from "react-router";

const initialState: AuthState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

interface AuthStateDispatch {
  type: string;
  payload: AuthState;
}

interface AuthState {
  isAuthenticated: boolean;
  isInitialized?: boolean;
  user: User | null;
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
          payload: { isAuthenticated: false, user: null },
        });
      }
      dispatch({
        type: "INITIALISE",
        payload: {
          isAuthenticated: !!user,
          user: user,
        },
      });
    });
    return unsubscribe;
  }, [dispatch]);

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
