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
import { useRouter } from "next/router";
import Link from "next/link";

import useAuth from "../data/useAuth";

const schema = yup
  .object({
    email: yup
      .string()
      .required("Email is required.")
      .email("Email need to be valid."),
    password: yup
      .string()
      .required("Password is required.")
      .min(6, "Password should be at least 6 characters"),
  })
  .required();

const Signup = () => {
  const form = useForm({
    defaultValues: { email: "", password: "" },
    resolver: yupResolver(schema),
  });
  const [isSubmited, setIsSubmited] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();
  const { session, signUp } = useAuth();

  const handleOnSubmit = async (values: {
    email: string;
    password: string;
  }) => {
    setIsLoading(true);
    const resp = await signUp(values);
    setIsLoading(false);
    if (resp.user) {
      setIsSubmited(true);
    }
    if (resp.error) {
      form.setError("password", { message: resp.error.message });
    }
  };

  const renderMain = () => {
    if (session) {
      return (
        <Button isFullWidth onClick={() => router.push("/")}>
          Go to dashboard
        </Button>
      );
    }
    if (isSubmited) {
      return <Text>Email sent.</Text>;
    }
    return (
      <Box>
        <Box as="form" mb="20" onSubmit={form.handleSubmit(handleOnSubmit)}>
          <FormControl mb="4">
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input {...form.register("email")} data-cy="email-input" />
            <FormHelperText>
              {form.formState.errors.email?.message}
            </FormHelperText>
          </FormControl>
          <FormControl mb="4">
            <FormLabel htmlFor="password">Password</FormLabel>
            <Input
              {...form.register("password")}
              type="password"
              data-cy="password-input"
            />
            <FormHelperText>
              {form.formState.errors.password?.message}
            </FormHelperText>
          </FormControl>
          <Button
            type="submit"
            isFullWidth
            isLoading={isLoading}
            data-cy="cta-button"
          >
            Sign up
          </Button>
        </Box>
        <Text mb="2">Already have an account?</Text>
        <Link href="/signin" passHref>
          <Button variant={"outline"} isFullWidth>
            Sign in
          </Button>
        </Link>
      </Box>
    );
  };

  return (
    <Grid gridTemplateColumns={["1fr", "1fr", "320px 1fr"]} minHeight="100vh">
      <Box
        display={["none", "none", "block"]}
        padding="16"
        backgroundColor="#2c323d"
      >
        <Heading fontSize="2xl">Bookmark manager</Heading>
      </Box>
      <Center padding={["4", "8", "16"]}>
        <Container maxW="sm">{renderMain()}</Container>
      </Center>
    </Grid>
  );
};

export default Signup;
