import React from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  Flex,
  Text,
  useBoolean,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { Plus, Trash2 } from "react-feather";
import { map } from "ramda";

import useCollections from "../data/useCollections";
import useLinks from "../data/useLinks";

import InsertLinkModal from "../components/InsertLinkModal";

const Collection: NextPage = () => {
  const router = useRouter();
  const collectionId = router.query.id;
  const toast = useToast();
  const { deleteCollection } = useCollections();
  const { links, error, insertLink } = useLinks(collectionId);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setisLoading] = useBoolean();

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
    <div>
      <Flex justifyContent={"space-between"}>
        <Box>
          Collection {collectionId}{" "}
          <Button
            leftIcon={<Trash2 size={16} />}
            onClick={() => handleDeleteCollection(Number(collectionId))}
          >
            Delete
          </Button>
        </Box>
        <Button leftIcon={<Plus size={16} />} onClick={onOpen}>
          Add link
        </Button>
      </Flex>
      {map(
        (item) => (
          <Text key={item.id}>{item.link}</Text>
        ),
        links
      )}
      <InsertLinkModal
        isOpen={isOpen}
        isLoading={isLoading}
        onClose={onClose}
        onSubmit={handleOnSubmit}
      />
    </div>
  );
};

export default Collection;
