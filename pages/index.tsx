import React from "react";
import { NextPage } from "next";

import { useSession } from "../hooks/useSession";

import Signup from "../components/Signup";
import Dashboard from "../components/Dashboard";

const Home: NextPage = () => {
  const session = useSession();
  return <div>{session ? <Dashboard /> : <Signup />}</div>;
};

export default Home;
