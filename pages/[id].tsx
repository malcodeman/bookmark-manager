import React from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  Center,
  Editable,
  EditableInput,
  EditablePreview,
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
import { ChevronDown, Edit2, Plus, Trash2 } from "react-feather";
import { Cell } from "react-table";
import { formatDistanceToNow } from "date-fns";
import { length } from "ramda";
import * as yup from "yup";

import useCollections from "../data/useCollections";
import useLinks from "../data/useLinks";
import useCollection from "../data/useCollection";

import InsertLinkModal from "../components/InsertLinkModal";
import Table from "../components/Table";

const schema = yup
  .object({
    url: yup.string().required().url(),
  })
  .required();

const Collection: NextPage = () => {
  const router = useRouter();
  const collectionId = router.query.id;
  const toast = useToast();
  const { deleteCollection } = useCollections();
  const {
    links,
    error: linksError,
    insertLink,
    deleteLink,
  } = useLinks(collectionId);
  const {
    collection,
    error: collectionError,
    updateCollection,
  } = useCollection(collectionId);
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
      {
        accessor: "id",
        Cell: function idCell(props: Cell) {
          return (
            <Button
              size="sm"
              leftIcon={<Trash2 size={16} />}
              onClick={() => handleDeleteLink(props.value)}
            >
              Delete
            </Button>
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
    if (linksError) {
      toast({
        title: `${linksError.message}`,
        status: "error",
        isClosable: true,
      });
    }
  }, [linksError]);

  React.useEffect(() => {
    if (collectionError) {
      toast({
        title: `${collectionError.message}`,
        status: "error",
        isClosable: true,
      });
      router.push("/");
    }
  }, [collectionError]);

  const handleDeleteLink = async (id: number) => {
    const resp = await deleteLink(id);
    if (resp.error) {
      toast({
        title: `${resp.error.message}`,
        status: "error",
        isClosable: true,
      });
    }
  };

  const handleOnSubmit = async (data: { url: string }) => {
    setisLoading.on();
    const resp = await insertLink(data.url);
    setisLoading.off();
    if (resp.error) {
      toast({
        title: `${resp.error.message}`,
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
      toast({
        title: `Collection deleted.`,
        status: "info",
        isClosable: true,
      });
      router.push("/");
    }
  };

  const handleRenameCollection = () => {
    setIsEditable.on();
  };

  const handleEditableOnSubmit = async (nextValue: string) => {
    await updateCollection({ name: nextValue });
    setIsEditable.off();
  };

  const handleAddLink = async () => {
    try {
      const url = await navigator.clipboard.readText();
      await schema.validate({ url });
      handleOnSubmit({ url });
    } catch {
      onOpen();
    }
  };

  return (
    <Box padding="4">
      <Flex mb="8" justifyContent={"space-between"}>
        <Box>
          <Menu>
            {isEditable ? (
              <Editable
                startWithEditView
                defaultValue={collection.name}
                onSubmit={handleEditableOnSubmit}
              >
                <EditablePreview />
                <EditableInput />
              </Editable>
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
        <Button size="sm" leftIcon={<Plus size={16} />} onClick={handleAddLink}>
          Add link
        </Button>
      </Flex>
      {length(links) === 0 ? (
        <Center>
          <Text>No links added yet</Text>
        </Center>
      ) : (
        <Table columns={columns} data={links} />
      )}
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
