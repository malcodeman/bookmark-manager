import React from "react";
import { NextPage } from "next";

import { useSession } from "../hooks/useSession";

import Auth from "../components/Auth";
import Dashboard from "../components/Dashboard";

const Home: NextPage = () => {
  const session = useSession();
  return <div>{session ? <Dashboard /> : <Auth />}</div>;
};

export default Home;
