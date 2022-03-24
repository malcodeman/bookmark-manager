import React from "react";
import {
  Box,
  Button,
  Grid,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { ChevronDown, LogOut, Settings } from "react-feather";

import { supabase } from "../utils/supabaseClient";
import { useSession } from "../hooks/useSession";

import Account from "./Account";

const Dashboard = () => {
  const session = useSession();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <Grid gridTemplateColumns="320px 1fr" minHeight="100vh">
      <Box backgroundColor="#2c323d">
        <Menu>
          <MenuButton
            as={Button}
            borderRadius="0"
            width={"100%"}
            rightIcon={<ChevronDown size={16} />}
          >
            {session?.user?.email}
          </MenuButton>
          <MenuList>
            <MenuItem icon={<Settings size={16} />}>Settings</MenuItem>
            <MenuItem onClick={handleSignOut} icon={<LogOut size={16} />}>
              Log out
            </MenuItem>
          </MenuList>
        </Menu>
      </Box>
      <Box>
        Bookmarks
        <Account />
      </Box>
    </Grid>
  );
};

export default Dashboard;
