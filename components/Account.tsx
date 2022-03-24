import React from "react";
import {
  Button,
  Container,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { useSession } from "../hooks/useSession";
import { supabase } from "../utils/supabaseClient";

const schema = yup
  .object({
    username: yup.string().required("Username is required."),
  })
  .required();

const Account = () => {
  const form = useForm({
    defaultValues: { username: "" },
    resolver: yupResolver(schema),
  });
  const session = useSession();

  React.useEffect(() => {
    getProfile();
  }, [session]);

  const getProfile = async () => {
    try {
      const user = supabase.auth.user();
      const { data, error, status } = await supabase
        .from("profiles")
        .select(`username, website, avatar_url`)
        .eq("id", user?.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      form.setValue("username", data.username);
    } catch (error) {}
  };

  const handleOnSubmit = async (values: { username: string }) => {
    try {
      const user = supabase.auth.user();
      if (user) {
        const updates = {
          id: user.id,
          username: values.username,
          updated_at: new Date(),
        };
        const { error } = await supabase.from("profiles").upsert(updates);

        if (error) {
          throw error;
        }
      }
    } catch (error) {}
  };

  return (
    <Container maxW="container.sm">
      <form onSubmit={form.handleSubmit(handleOnSubmit)}>
        <FormControl mb="4">
          <FormLabel htmlFor="username">Username</FormLabel>
          <Input {...form.register("username")} />
          <FormHelperText>
            {form.formState.errors.username?.message}
          </FormHelperText>
        </FormControl>
        <Button type="submit">Update</Button>
      </form>
    </Container>
  );
};

export default Account;
