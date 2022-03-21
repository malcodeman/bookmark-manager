import React from "react";
import type { NextPage } from "next";

import { supabase } from "../utils/supabaseClient";

import Auth from "../components/Auth";

const Home: NextPage = () => {
  const [session, setSession] = React.useState(null);

  React.useEffect(() => {
    setSession(supabase.auth.session());

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return <div>{session ? <div>Loggedin in</div> : <Auth />}</div>;
};

export default Home;
