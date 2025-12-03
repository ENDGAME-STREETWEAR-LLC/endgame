/* eslint-disable  @typescript-eslint/no-explicit-any */

"use client";

import { createContext, PropsWithChildren, useContext } from "react";
import { createClient } from "@/utils/supabase/client";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Session, SupabaseClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { CircleLoader } from "react-spinners";

export const AuthContext = createContext<[Session, SupabaseClient]>(
  null as any
);

export const AuthContextProvider = (props: PropsWithChildren) => {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<null | Session>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
      console.log(session?.user.user_metadata.name);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <>
      {loading && <CircleLoader color="white" />}
      {!session && !loading ? (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
          <div className="flex flex-col gap-[32px] row-start-2 items-center justify-center sm:items-start">
            <Auth
              onlyThirdPartyProviders
              providers={["google"]}
              redirectTo={process.env.NEXT_PUBLIC_REDIRECT_URL}
              supabaseClient={supabase}
              appearance={{ theme: ThemeSupa }}
            />
          </div>
        </div>
      ) : (
        session && (
          <AuthContext.Provider value={[session, supabase]}>
            {props.children}
          </AuthContext.Provider>
        )
      )}
    </>
  );
};

export default () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error(
      "useAuthStore must be used from within AuthContextProvider component."
    );

  return context;
};
