import { useEffect } from "react";

import type { NextPage } from "next";
import { useRouter } from "next/router";

import { Flex, Heading, Text } from "@chakra-ui/react";

const DashboardPage: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the home page after 2 seconds
    const redirectTimer = setTimeout(() => {
      router.push("/");
    }, 2000);

    return () => clearTimeout(redirectTimer);
  }, [router]);
  return (
    <Flex justify="center" align="center" w="full" h="100vh" direction="column">
      <Heading>404 - Page Not Found</Heading>
      <Text>Redirecting...</Text>
    </Flex>
  );
};

export default DashboardPage;
