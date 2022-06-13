import React from "react";
import {
  Box,
  Button,
  Flex,
  Grid,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { ChevronDown, Folder, LogOut, Plus, Settings } from "react-feather";
import { map, equals, type, dec } from "ramda";
import Link from "next/link";
import { useRouter } from "next/router";
import { useKeyboardEvent } from "@react-hookz/web";

import { supabase } from "../utils/supabaseClient";
import { useSession } from "../hooks/useSession";
import useCollections from "../data/useCollections";
import AccountModal from "./AccountModal";

type Props = {
  children: React.ReactNode;
};

const Layout = (props: Props) => {
  const { children } = props;
  const session = useSession();
  const router = useRouter();
  const id = router.query.id;
  const toast = useToast();
  const { collections, error, insertCollection } = useCollections();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleAddCollection = async () => {
    const resp = await insertCollection();
    if (resp.error) {
      toast({
        title: `${resp.error.message}`,
        status: "error",
        isClosable: true,
      });
    }
    if (resp.data) {
      router.push(`/${resp.data.id}`);
    }
  };

  React.useEffect(() => {
    if (error) {
      toast({
        title: `${error.message}`,
        status: "error",
        isClosable: true,
      });
    }
  }, [error, toast]);

  useKeyboardEvent(
    true,
    (ev) => {
      const key = Number(ev.key);
      if (type(key) === "Number") {
        const col = collections[dec(key)];
        if (col) {
          router.push(`/${col.id}`);
        }
      }
    },
    [],
    { eventOptions: { passive: true } }
  );
  useKeyboardEvent("c", handleAddCollection, [], { event: "keyup" });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
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
            <MenuItem onClick={onOpen} icon={<Settings size={16} />}>
              Settings
            </MenuItem>
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
              <Link key={item.id} href={`/${item.id}`} passHref>
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
      <AccountModal isOpen={isOpen} onClose={onClose} />
    </Grid>
  );
};

export default Layout;
