import React from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { Button, Text, useToast } from "@chakra-ui/react";
import { map } from "ramda";

import { supabase } from "../utils/supabaseClient";

type Link = {
  id: number;
  link: string;
};

const Collection: NextPage = () => {
  const router = useRouter();
  const id = router.query.id;
  const [links, setLinks] = React.useState<Link[]>([]);
  const toast = useToast();

  React.useEffect(() => {
    getLinks();
  }, [id]);

  const getLinks = async () => {
    const { data, error } = await supabase
      .from("links")
      .select(`id, link`)
      .eq("collection_id", id);
    if (error) {
      toast({
        title: `${error.message}`,
        status: "error",
        isClosable: true,
      });
    }
    if (data) {
      setLinks(data);
    }
  };

  const handleAddLink = async () => {
    const { data, error } = await supabase
      .from("links")
      .insert([{ collection_id: Number(id), link: "test" }])
      .single();
    if (error) {
      toast({
        title: `${error.message}`,
        status: "error",
        isClosable: true,
      });
    }
    if (data) {
      setLinks([...links, data]);
    }
  };

  return (
    <div>
      <div>Collection {id}</div>
      {map(
        (item) => (
          <Text key={item.id}>{item.link}</Text>
        ),
        links
      )}
      <Button onClick={handleAddLink}>Add link</Button>
    </div>
  );
};

export default Collection;
