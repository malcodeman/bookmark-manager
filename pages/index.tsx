import React from "react";
import { NextPage } from "next";
import { Button } from "@chakra-ui/react";

import { supabase } from "../utils/supabaseClient";
import { useSession } from "../hooks/useSession";

import Auth from "../components/Auth";
import Dashboard from "../components/Dashboard";

const Home: NextPage = () => {
  const session = useSession();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
  };

  return <div>{session ? <Dashboard /> : <Auth />}</div>;
};

export default Home;
