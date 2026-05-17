import { use, createContext, type PropsWithChildren } from "react";
import { supabase } from "@/utils/supabase";
import { Session, User } from "@supabase/supabase-js";

import { useStorageState } from "../hooks/useStorageState";

const AuthContext = createContext<{
  signIn: () => void;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
}>({
  signIn: () => null,
  signOut: () => null,
  session: null,
  isLoading: false,
});

// Use this hook to access the user info.
export function useSession() {
  const value = use(AuthContext);
  if (!value) {
    throw new Error("useSession must be wrapped in a <SessionProvider />");
  }

  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState("session");

  return (
    <AuthContext.Provider
      value={{
        signIn: async () => {
          // Perform sign-in logic here

          const {
            data: { session },
          } = await supabase.auth.getSession();
          console.log("context: ", session);
          if (session?.access_token) {
            setSession(session?.access_token);
          }
        },
        signOut: () => {
          setSession(null);
        },
        session,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
