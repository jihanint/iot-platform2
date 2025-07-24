import { useEffect } from "react";
import { AiOutlineMail } from "react-icons/ai";

import { useSession } from "next-auth/react";

import { Box, Divider, Flex, Input, InputGroup, InputLeftElement, Text } from "@chakra-ui/react";

import { useLayoutState } from "@/common/hooks";

import BaseLayout from "../components/BaseLayout";

const MyProfile = () => {
  const { data: session } = useSession();
  const { setBreadCrumb } = useLayoutState();

  useEffect(() => {
    setBreadCrumb("Pengaturan - Profile");
  }, []);

  console.log("session", session?.user.roles?.[0]);

  return (
    <BaseLayout as="section">
      <Box px={{ base: 2, md: "initial" }}>
        <Flex w={{ base: "100%", md: "50%" }} gap={4} mt={8}>
          <InputGroup flexDirection="column">
            <Text fontWeight="semibold">Nama Depan</Text>
            <Input type="text" placeholder="Nama depan" defaultValue={session?.user?.first_name} />
          </InputGroup>
          <InputGroup flexDirection="column">
            <Text fontWeight="semibold">Nama Belakang</Text>
            <Input type="tel" placeholder="Nama belakang" defaultValue={session?.user?.last_name} />
          </InputGroup>
        </Flex>
        <Divider py={4} w={{ base: "100%", md: "50%" }} />
        <Flex direction="column" w={{ base: "100%", md: "40%" }} mt={7}>
          <Text fontWeight="semibold">Email</Text>
          <InputGroup flexDirection="column" mb="35px">
            <InputLeftElement pointerEvents="none">
              <AiOutlineMail color="gray.100" fontSize={20} />
            </InputLeftElement>
            <Input disabled type="text" placeholder="Alamat email" defaultValue={session?.user?.email} />
          </InputGroup>
          <InputGroup flexDirection="column">
            <Text fontWeight="semibold">Peran</Text>
            <Input
              disabled
              type="text"
              placeholder="Peran"
              value={session?.user.roles?.[0] + " - " + session?.user.status}
            />
          </InputGroup>
        </Flex>
      </Box>
    </BaseLayout>
  );
};

export default MyProfile;
