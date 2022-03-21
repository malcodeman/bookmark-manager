import React from "react";
import {
  Box,
  Button,
  Center,
  Container,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  Heading,
  Input,
  Text,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { supabase } from "../utils/supabaseClient";

const schema = yup
  .object({
    email: yup
      .string()
      .required("Email is required.")
      .email("Email need to be valid."),
  })
  .required();

const Auth = () => {
  const form = useForm({
    defaultValues: { email: "" },
    resolver: yupResolver(schema),
  });
  const [isSubmited, setIsSubmited] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleOnSubmit = async () => {
    try {
      setIsLoading(true);
      const resp = await supabase.auth.signIn({
        email: "malcodeman@gmail.com",
      });
      if (resp.error) {
        throw resp.error;
      }
      setIsSubmited(true);
    } catch (er) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Grid gridTemplateColumns="320px 1fr" minHeight="100vh">
      <Box padding="16" backgroundColor="#2c323d">
        <Heading fontSize="2xl">Bookmark manager</Heading>
      </Box>
      <Center padding="16">
        <Container maxW="container.sm">
          {isSubmited ? (
            <Text>Email sent.</Text>
          ) : (
            <form onSubmit={form.handleSubmit(handleOnSubmit)}>
              <FormControl mb="4">
                <FormLabel htmlFor="email">Email</FormLabel>
                <Input {...form.register("email")} />
                <FormHelperText>
                  {form.formState.errors.email?.message}
                </FormHelperText>
              </FormControl>
              <Button type="submit" isFullWidth isLoading={isLoading}>
                Login
              </Button>
            </form>
          )}
        </Container>
      </Center>
    </Grid>
  );
};

export default Auth;
