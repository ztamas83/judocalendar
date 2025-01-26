import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  User,
} from "firebase/auth";
import { auth as clientAuth } from "~/firebase.client";
import { useContext, createContext, useEffect, useReducer } from "react";

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

  const logout = async () => {
    await clientAuth.signOut();
  };

  const loginWithGoogle = async () => {
    signOut(clientAuth).then(() => console.log("Signed out"));
    const provider = new GoogleAuthProvider();

    signInWithPopup(clientAuth, provider)
      .then((res) => {
        console.log("Signed in");
        dispatch({
          type: "INITIALISE",
          payload: { isAuthenticated: true, user: res.user },
        });
      })
      .catch((err) => {
        console.error("Sign in error", err);
      });
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
