import React from "react";
import {
  Box,
  Button,
  Grid,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { ChevronDown, LogOut, Settings } from "react-feather";
import { map } from "ramda";

import { supabase } from "../utils/supabaseClient";
import { useSession } from "../hooks/useSession";

import Account from "./Account";

type Collection = {
  id: number;
  name: string;
};

const Dashboard = () => {
  const session = useSession();
  const [collections, setCollections] = React.useState<Collection[]>([]);

  React.useEffect(() => {
    getCollections();
  }, [session]);

  const getCollections = async () => {
    try {
      const user = supabase.auth.user();
      const { data, error, status } = await supabase
        .from("collections")
        .select(`id, name`)
        .eq("user_id", user?.id);

      if (error && status !== 406) {
        throw error;
      }
      if (data) {
        setCollections(data);
      }
    } catch (error) {}
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handleAddCollection = async () => {
    const user = supabase.auth.user();
    const { data, error } = await supabase
      .from("collections")
      .insert([{ user_id: user?.id, name: "Untitled" }], {
        returning: "minimal",
      });
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
        <Text paddingX="2">Collection</Text>
        {map(
          (item) => (
            <Text paddingX="2">{item.name}</Text>
          ),
          collections
        )}
        <Button onClick={handleAddCollection}>Add collection</Button>
      </Box>
      <Box>
        Bookmarks
        <Account />
      </Box>
    </Grid>
  );
};

export default Dashboard;
