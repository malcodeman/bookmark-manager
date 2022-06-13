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
  Spinner,
  Text,
  useBoolean,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { ChevronDown, Edit2, Plus, Trash2 } from "react-feather";
import { Cell } from "react-table";
import { formatDistanceToNow } from "date-fns";
import { equals, length } from "ramda";
import * as yup from "yup";
import { useKeyboardEvent } from "@react-hookz/web";

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
    isLoading: isLoadingCollection,
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
    [deleteLink, toast]
  );

  React.useEffect(() => {
    if (linksError) {
      toast({
        title: `${linksError.message}`,
        status: "error",
        isClosable: true,
      });
    }
  }, [linksError, toast]);

  React.useEffect(() => {
    if (collectionError) {
      toast({
        title: `${collectionError.message}`,
        status: "error",
        isClosable: true,
      });
      router.push("/");
    }
  }, [collectionError, router, toast]);

  useKeyboardEvent("n", onOpen, [], { event: "keyup" });

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

  const renderMain = () => {
    if (isLoadingCollection) {
      return (
        <Center>
          <Spinner />
        </Center>
      );
    }
    if (equals(length(links), 0)) {
      return (
        <Center>
          <Text>No links added yet</Text>
        </Center>
      );
    }
    return <Table columns={columns} data={links} />;
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
      {renderMain()}
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
