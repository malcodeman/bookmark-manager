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

import useCollections from "../data/useCollections";
import useLinks from "../data/useLinks";

const schema = yup
  .object({
    url: yup.string().required("URL is required.").url("URL need to be valid."),
  })
  .required();

const Collection: NextPage = () => {
  const router = useRouter();
  const collectionId = router.query.id;
  const toast = useToast();
  const form = useForm({
    defaultValues: { url: "" },
    resolver: yupResolver(schema),
  });
  const { deleteCollection } = useCollections();
  const { links, error, insertLink } = useLinks(collectionId);

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
    const resp = await insertLink(data.url);
    if (resp.error) {
      toast({
        title: `${error.message}`,
        status: "error",
        isClosable: true,
      });
    }
    form.reset();
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
