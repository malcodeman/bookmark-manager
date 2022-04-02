import React from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";
import { Bookmark, Trash2 } from "react-feather";
import { map } from "ramda";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { supabase } from "../utils/supabaseClient";
import useCollections from "../data/useCollections";

type Link = {
  id: number;
  link: string;
};

const schema = yup
  .object({
    url: yup.string().required("URL is required.").url("URL need to be valid."),
  })
  .required();

const Collection: NextPage = () => {
  const router = useRouter();
  const collectionId = router.query.id;
  const [links, setLinks] = React.useState<Link[]>([]);
  const toast = useToast();
  const form = useForm({
    defaultValues: { url: "" },
    resolver: yupResolver(schema),
  });
  const { deleteCollection } = useCollections();

  React.useEffect(() => {
    if (collectionId) {
      getLinks(Number(collectionId));
    }
  }, [collectionId]);

  const getLinks = async (id: number) => {
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

  const handleOnSubmit = async (data: { url: string }) => {
    handleAddLink(Number(collectionId), data.url);
    form.reset();
  };

  const handleAddLink = async (id: number, link: string) => {
    const { data, error } = await supabase
      .from("links")
      .insert([{ collection_id: Number(id), link }])
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
      <div>
        Collection {collectionId}{" "}
        <Button
          leftIcon={<Trash2 size={16} />}
          onClick={() => handleDeleteCollection(Number(collectionId))}
        >
          Delete
        </Button>
      </div>
      {map(
        (item) => (
          <Text key={item.id}>{item.link}</Text>
        ),
        links
      )}
      <form onSubmit={form.handleSubmit(handleOnSubmit)}>
        <FormControl>
          <FormLabel htmlFor="url">URL</FormLabel>
          <Input {...form.register("url")} />
          <FormHelperText>{form.formState.errors.url?.message}</FormHelperText>
        </FormControl>
        <Button leftIcon={<Bookmark size={16} />} type="submit">
          Save
        </Button>
      </form>
    </div>
  );
};

export default Collection;
