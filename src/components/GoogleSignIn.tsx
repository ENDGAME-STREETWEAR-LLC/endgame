"use client";

import { createClient } from "@/utils/supabase/client";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import MainApp from "./MainApp";

export default function GoogleSignIn() {
  const supabase = createClient();
  const [session, setSession] = useState<null | Session>(null);
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);
  if (!session) {
    return (
      <Auth
        //onlyThirdPartyProviders
        //providers={["google"]}
        redirectTo="http://localhost:3000/auth/callback"
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
      />
    );
  } else {
    return <MainApp />;
  }
}
