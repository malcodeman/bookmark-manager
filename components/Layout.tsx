import React from "react";
import {
  Box,
  Button,
  Flex,
  Grid,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { ChevronDown, Folder, LogOut, Plus, Settings } from "react-feather";
import { map, equals } from "ramda";
import Link from "next/link";
import { useRouter } from "next/router";

import { supabase } from "../utils/supabaseClient";
import { useSession } from "../hooks/useSession";

type Collection = {
  id: number;
  name: string;
};
type Props = {
  children: React.ReactNode;
};

const Layout = (props: Props) => {
  const { children } = props;
  const session = useSession();
  const [collections, setCollections] = React.useState<Collection[]>([]);
  const router = useRouter();
  const id = router.query.id;

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
    router.push("/");
  };

  const handleAddCollection = async () => {
    const user = supabase.auth.user();
    const { data, error } = await supabase
      .from("collections")
      .insert([{ user_id: user?.id, name: "Untitled" }])
      .single();
    setCollections([...collections, data]);
    router.push(`/${data.id}`);
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
        <Box marginY={16}>
          <Flex paddingX={4} mb={4} justifyContent="space-between">
            <Text>Collections</Text>
            <Plus size={20} onClick={handleAddCollection} cursor="pointer" />
          </Flex>
          {map(
            (item) => (
              <Link key={item.id} href={`/${item.id}`}>
                <Button
                  leftIcon={<Folder size={16} />}
                  variant={"ghost"}
                  justifyContent={"flex-start"}
                  isFullWidth
                  borderRadius={"none"}
                  size={"sm"}
                  paddingX={4}
                  isActive={equals(item.id, Number(id))}
                >
                  {item.name}
                </Button>
              </Link>
            ),
            collections
          )}
        </Box>
      </Box>
      <Box>{children}</Box>
    </Grid>
  );
};

export default Layout;
