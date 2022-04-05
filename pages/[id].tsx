import React from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  Flex,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useBoolean,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { ChevronDown, Edit2, Plus, Trash2 } from "react-feather";
import { Cell } from "react-table";
import { formatDistanceToNow } from "date-fns";
import { useForm } from "react-hook-form";

import useCollections from "../data/useCollections";
import useLinks from "../data/useLinks";
import useCollection from "../data/useCollection";

import InsertLinkModal from "../components/InsertLinkModal";
import Table from "../components/Table";

const NameEditable = (props: {
  name: string;
  onSubmit: (values: { name: string }) => void;
}) => {
  const { name, onSubmit } = props;
  const form = useForm({ defaultValues: { name } });
  return (
    <Box as="form" onSubmit={form.handleSubmit(onSubmit)}>
      <Input size="sm" {...form.register("name")} />
    </Box>
  );
};

const Collection: NextPage = () => {
  const router = useRouter();
  const collectionId = router.query.id;
  const toast = useToast();
  const { deleteCollection } = useCollections();
  const { links, error, insertLink } = useLinks(collectionId);
  const { collection, updateCollection } = useCollection(collectionId);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setisLoading] = useBoolean();
  const [isEditable, setIsEditable] = useBoolean();
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
    setIsEditable.off();
  }, [collectionId]);

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

  const handleRenameCollection = () => {
    setIsEditable.on();
  };

  const handleEditableOnSubmit = async (values: { name: string }) => {
    await updateCollection(values);
    setIsEditable.off();
  };

  return (
    <Box padding="4">
      <Flex mb="8" justifyContent={"space-between"}>
        <Box>
          <Menu>
            {isEditable ? (
              <NameEditable
                name={collection.name}
                onSubmit={handleEditableOnSubmit}
              />
            ) : (
              <MenuButton
                as={Button}
                variant={"ghost"}
                rightIcon={<ChevronDown size={16} />}
                size="sm"
              >
                {collection.name}
              </MenuButton>
            )}
            <MenuList>
              <MenuItem
                icon={<Edit2 size={16} />}
                onClick={handleRenameCollection}
              >
                Rename
              </MenuItem>
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
