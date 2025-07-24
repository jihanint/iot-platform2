import { useEffect } from "react";

import Image from "next/image";
import { useSession } from "next-auth/react";

// Components
import { Box, Flex, Heading, Text } from "@chakra-ui/react";

import { useLayoutState } from "@/common/hooks";

const WaitingApproval = () => {
  const { data } = useSession();
  const { setBreadCrumb } = useLayoutState();

  useEffect(() => {
    setBreadCrumb("Bantuan");
  }, []);
  return (
    <Flex
      className="contact-us"
      direction="column"
      w="full"
      position="relative"
      h="72vh"
      justify="center"
      align="center"
    >
      <Box w="80px" h="80px" position="relative" bg="white" mb="40px">
        <Image src="/svg/three-dots-circle.svg" alt="app-logo" fill />
      </Box>
      <Flex direction="column" rowGap="20px" w="60%" textAlign="center">
        <Heading>Menunggu Persetujuan Admin</Heading>
        <Text>
          Permintaan Anda saat ini sedang menunggu ulasan oleh administrator iothub. Kami menghargai kesabaran Anda
          saat kami bekerja untuk memastikan hasil yang terbaik. Harap dicatat bahwa waktu pemrosesan dapat bervariasi
          berdasarkan jenis permintaan Anda dan beban kerja saat ini. Kami berkomitmen untuk memberikan Anda tanggapan
          tepat waktu dan mengambil tindakan yang diperlukan.
        </Text>
        <Text>
          Sementara itu, jika Anda memiliki pertanyaan atau masalah mendesak, silakan hubungi tim dukungan kami di
          support@iotplatform.com atau hubungi kami di +62-XXX XXXX XXXX. Kami memohon maaf atas segala ketidaknyamanan
          yang mungkin ditimbulkan oleh keterlambatan ini dan kami berterima kasih atas pengertian Anda.
        </Text>
        <Text>Terima kasih telah memilih layanan kami, dan kami berharap dapat membantu Anda sesegera mungkin.</Text>
      </Flex>
    </Flex>
  );
};

export default WaitingApproval;
