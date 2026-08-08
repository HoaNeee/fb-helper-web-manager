import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
} from "react";
import authService from "../services/auth-service";
import {
  deleteValueFromStorage,
  getValueFromStorage,
  setValueToStorage,
} from "@/utils/storage";
import { KEY_AUTH } from "@/constants/constants";
import type { User } from "@/services/user-service";
import userService from "@/services/user-service";

interface AuthState {
  user: User | null;
  loading: boolean;
  is_authenticated: boolean;
  error: string | null;
}

type AuthAction =
  | { type: "AUTH_START" }
  | {
      type: "AUTH_SUCCESS";
      payload: { user: User };
    }
  | { type: "AUTH_FAILURE"; error?: string | null }
  | { type: "AUTH_COMPLETED" }
  | { type: "LOGOUT" }
  | { type: "UPDATE_USER"; payload: User }
  | { type: "AUTH_TOKEN"; token: string };

interface AuthContextType {
  state: AuthState;
  login: (username: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string,
  ) => Promise<void>;
  logout: () => void;
}

const initialState: AuthState = {
  user: null,
  loading: true,
  is_authenticated: false,
  error: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "AUTH_START":
      return { ...state, loading: true };
    case "AUTH_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        loading: false,
        is_authenticated: true,
      };
    case "AUTH_TOKEN":
      return {
        ...state,
        loading: false,
        is_authenticated: true,
      };
    case "AUTH_FAILURE":
      return {
        ...state,
        user: null,
        loading: false,
        is_authenticated: false,
        error: action?.error,
      };
    case "LOGOUT":
      return {
        ...initialState,
        loading: false,
      };
    case "AUTH_COMPLETED":
      return {
        ...state,
        loading: false,
      };
    case "UPDATE_USER":
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = getValueFromStorage(KEY_AUTH.TOKEN);
        if (token) {
          dispatch({ type: "AUTH_START" });
          const user = await userService.getMe();
          dispatch({ type: "AUTH_SUCCESS", payload: { user } });
        } else {
          dispatch({ type: "AUTH_COMPLETED" });
        }
      } catch (error) {
        dispatch({ type: "AUTH_FAILURE", error: error?.message });
        await logout();
      }
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string): Promise<void> => {
    try {
      dispatch({ type: "AUTH_START" });
      const res = await authService.login({ username, password });
      setValueToStorage(KEY_AUTH.TOKEN, res.token);
      dispatch({ type: "AUTH_COMPLETED" });
      location.href = "/";
    } catch (error) {
      dispatch({ type: "AUTH_FAILURE" });
      throw error;
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string,
  ): Promise<void> => {
    try {
      dispatch({ type: "AUTH_START" });
      const response = await authService.register({
        username,
        email,
        password,
      });
    } catch (error) {
      dispatch({ type: "AUTH_FAILURE" });
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    deleteValueFromStorage(KEY_AUTH.TOKEN);
    dispatch({ type: "LOGOUT" });
  };

  const value: AuthContextType = {
    state,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
