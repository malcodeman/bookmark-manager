import { Button, Center, Text, useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";

import useCollections from "../data/useCollections";

const Dashboard = () => {
  const { insertCollection } = useCollections();
  const router = useRouter();
  const toast = useToast();

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

  return (
    <Center minHeight="100vh" flexDirection="column">
      <Text mb="2">Select a collection or create a new one</Text>
      <Button size="sm" onClick={handleAddCollection}>
        Create a new collection
      </Button>
    </Center>
  );
};

export default Dashboard;
