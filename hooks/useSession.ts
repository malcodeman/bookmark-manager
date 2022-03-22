import React from "react";
import { Session } from "@supabase/supabase-js";

import { supabase } from "../utils/supabaseClient";

const useSession = () => {
  const [session, setSession] = React.useState<Session | null>(null);

  React.useEffect(() => {
    setSession(supabase.auth.session());
    supabase.auth.onAuthStateChange((_event, session) => {
      return setSession(session);
    });
  }, []);

  return session;
};

export { useSession };
