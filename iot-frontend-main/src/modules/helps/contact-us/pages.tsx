import { useEffect } from "react";

import Image from "next/image";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import { Box, Divider, Flex, Heading, Text } from "@chakra-ui/react";

import { useLayoutState } from "@/common/hooks";
import { ContentContainer } from "@/common/layouts";
const ContactUs = () => {
  const { push } = useRouter();
  const { data: session } = useSession();
  const { setBreadCrumb } = useLayoutState();

  useEffect(() => {
    setBreadCrumb("Bantuan");
    if (session?.user?.status === "inactive") {
      push("/helps/waiting-approval");
    }
  }, [session]);

  return (
    <Flex className="contact-us" direction="column" w="full" position="relative" h={{ base: "120vh", md: "72vh" }}>
      <Flex minH="235px" w="full" justify="center" align="center">
        <Box position="relative" h="full" w="full">
          <Image src="/images/painting.jpeg" alt="image" fill />
        </Box>
        <Heading color="white" position="absolute">
          Hubungi Kami
        </Heading>
      </Flex>
      <Flex w="full" h="full" align="center" px={45}>
        <ContentContainer h="full" w="100%">
          <Flex className="caption-wrapper" direction={{ base: "column", md: "row" }} w="100%" h="100%" align="center">
            <Flex
              direction="column"
              className="left-content"
              w={{ base: "100%", md: "35%" }}
              rowGap="20px"
              mb={{ base: "30px", md: "initial" }}
            >
              <Heading fontSize="heading.3" mb="10px">
                Bagaimana kami dapat membantu?
              </Heading>
              <Box w="80%">
                <Text fontWeight="medium" mb="20px">
                  Kami memiliki beberapa cara untuk memberikan informasi lebih lanjut tentang iothub.
                </Text>
                <Text fontWeight="medium">Kirim email, atau bicara langsung dengan kami melalui telepon.</Text>
              </Box>
            </Flex>
            <Divider orientation="vertical" px={4} display={{ base: "none", md: "initial" }} />
            <Flex className="contact-wrapper" direction={{ base: "column", md: "row" }} columnGap={12}>
              <Flex
                direction="column"
                className="email"
                align={{ base: "center", md: "flex-start" }}
                mb={{ base: "20px", md: "initial" }}
                rowGap={2}
              >
                <Box w="70px" h="70px" position="relative" bg="white">
                  <Image src="/svg/email-circle.svg" alt="app-logo" fill />
                </Box>
                <Text fontWeight="semibold">Email</Text>
                <Text>Email support@iotplatform.com</Text>
              </Flex>
              <Flex direction="column" className="phone" align={{ base: "center", md: "flex-start" }} rowGap={2}>
                <Box w="70px" h="70px" position="relative" bg="white">
                  <Image src="/svg/phone-circle.svg" alt="app-logo" fill />
                </Box>
                <Text>PIC A : +62 XXX XXXX XXXX</Text>
                <Text>PIC B : +62 XXX XXXX XXXX</Text>
              </Flex>
            </Flex>
          </Flex>
        </ContentContainer>
      </Flex>
    </Flex>
  );
};

export default ContactUs;
