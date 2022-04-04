import React from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useBoolean,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { ChevronDown, Plus, Trash2 } from "react-feather";
import { Cell } from "react-table";
import { formatDistanceToNow } from "date-fns";

import useCollections from "../data/useCollections";
import useLinks from "../data/useLinks";
import useCollection from "../data/useCollection";

import InsertLinkModal from "../components/InsertLinkModal";
import Table from "../components/Table";

const Collection: NextPage = () => {
  const router = useRouter();
  const collectionId = router.query.id;
  const toast = useToast();
  const { deleteCollection } = useCollections();
  const { links, error, insertLink } = useLinks(collectionId);
  const { collection } = useCollection(collectionId);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setisLoading] = useBoolean();
  const columns = React.useMemo(
    () => [
      {
        Header: "URL",
        accessor: "link",
      },
      {
        Header: "Created",
        accessor: "created_at",
        Cell: function scoreCell(props: Cell) {
          return (
            <Text>
              {formatDistanceToNow(new Date(props.value), { addSuffix: true })}
            </Text>
          );
        },
      },
    ],
    []
  );

  React.useEffect(() => {
    if (error) {
      toast({
        title: `${error.message}`,
        status: "error",
        isClosable: true,
      });
    }
  }, [error]);

  const handleOnSubmit = async (data: { url: string }) => {
    setisLoading.on();
    const resp = await insertLink(data.url);
    setisLoading.off();
    if (resp.error) {
      toast({
        title: `${error.message}`,
        status: "error",
        isClosable: true,
      });
    } else {
      onClose();
    }
  };

  const handleDeleteCollection = async (id: number) => {
    const resp = await deleteCollection(id);
    if (resp.error) {
      toast({
        title: `${resp.error.message}`,
        status: "error",
        isClosable: true,
      });
    }
    if (resp.data) {
      router.push("/");
    }
  };

  return (
    <Box padding="4">
      <Flex mb="8" justifyContent={"space-between"}>
        <Box>
          <Menu>
            <MenuButton>
              <Button
                variant={"ghost"}
                rightIcon={<ChevronDown size={16} />}
                size="sm"
              >
                {collection.name}
              </Button>
            </MenuButton>
            <MenuList>
              <MenuItem
                icon={<Trash2 size={16} />}
                onClick={() => handleDeleteCollection(Number(collectionId))}
              >
                Delete
              </MenuItem>
            </MenuList>
          </Menu>
        </Box>
        <Button size="sm" leftIcon={<Plus size={16} />} onClick={onOpen}>
          Add link
        </Button>
      </Flex>
      <Table columns={columns} data={links} />
      <InsertLinkModal
        isOpen={isOpen}
        isLoading={isLoading}
        onClose={onClose}
        onSubmit={handleOnSubmit}
      />
    </Box>
  );
};

export default Collection;
