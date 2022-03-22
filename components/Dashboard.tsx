import React from "react";
import { Box, Button, Grid, Text } from "@chakra-ui/react";

import { supabase } from "../utils/supabaseClient";
import { useSession } from "../hooks/useSession";

const Dashboard = () => {
  const session = useSession();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <Grid gridTemplateColumns="320px 1fr" minHeight="100vh">
      <Box backgroundColor="#2c323d">
        <Text>{session?.user?.email}</Text>
        <Button onClick={handleSignOut}>Log out</Button>
      </Box>
      <Box>Bookmarks</Box>
    </Grid>
  );
};

export default Dashboard;
