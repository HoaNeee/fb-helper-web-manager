import userService from "@/services/user-service";
import { handleExceptionGlobal } from "@/utils/exception";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "./AuthContext";

type StatusFeatureFlag = "locked" | "unlocked";

interface FeatureFlags {
  comment_walk: StatusFeatureFlag;
  random_break_batch: StatusFeatureFlag;
  fix_steal_all_focus: StatusFeatureFlag;
  special_frame_hours: StatusFeatureFlag;
  random_time_task: StatusFeatureFlag;
}

interface FeatureContextType {
  featureFlags: FeatureFlags;
  getFeatureEnabled: (type: keyof FeatureFlags) => boolean;
}

const initialState: FeatureFlags = {
  comment_walk: "locked",
  random_break_batch: "locked",
  fix_steal_all_focus: "locked",
  special_frame_hours: "locked",
  random_time_task: "locked",
};

export const FeatureContext = createContext<FeatureContextType | undefined>(
  undefined,
);

export const useFeatureFlag = () => {
  const context = useContext(FeatureContext);
  if (!context) {
    throw new Error("useFeatureFlag must be used within a FeatureProvider");
  }
  return context;
};

export function FeatureProvider({ children }: { children: ReactNode }) {
  const { state: authState } = useAuth();

  const [featureFlags, setFeatureFlags] = useState<FeatureFlags>(initialState);

  const getFeatureEnabled = useCallback(
    (type: keyof FeatureFlags) => {
      return featureFlags[type] === "unlocked";
    },
    [featureFlags],
  );

  useEffect(() => {
    const fn = async () => {
      try {
        if (!authState.is_authenticated) return;
        const isPremium = await userService.checkPremium();
        if (isPremium) {
          setFeatureFlags({
            ...featureFlags,
            comment_walk: "unlocked",
            random_break_batch: "unlocked",
            fix_steal_all_focus: "unlocked",
            special_frame_hours: "unlocked",
            random_time_task: "unlocked",
          });
        }
      } catch (error) {
        handleExceptionGlobal(error);
        setFeatureFlags(initialState);
      }
    };
    fn();
  }, [authState.is_authenticated]);
  return (
    <FeatureContext.Provider value={{ featureFlags, getFeatureEnabled }}>
      {children}
    </FeatureContext.Provider>
  );
}
