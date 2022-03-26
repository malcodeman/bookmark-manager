import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";

import { useSession } from "../hooks/useSession";

import Layout from "../components/Layout";

function MyApp({ Component, pageProps }: AppProps) {
  const session = useSession();
  return (
    <ChakraProvider>
      {session ? (
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
