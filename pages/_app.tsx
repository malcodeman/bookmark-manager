import { ChakraProvider } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { none, equals } from "ramda";
import type { AppProps } from "next/app";

import { PUBLIC_ROUTES } from "../lib/constants";

import useAuth from "../data/useAuth";

import Layout from "../components/Layout";

function MyApp({ Component, pageProps }: AppProps) {
  const { session } = useAuth();
  const router = useRouter();
  const pathname = router.pathname;
  const isProtectedRoute =
    session && none((item) => equals(pathname, item), PUBLIC_ROUTES);

  return (
    <ChakraProvider>
      {isProtectedRoute ? (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      ) : (
        <Component {...pageProps} />
      )}
    </ChakraProvider>
  );
}

export default MyApp;
