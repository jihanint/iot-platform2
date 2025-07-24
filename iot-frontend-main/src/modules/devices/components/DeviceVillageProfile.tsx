import type { FC } from "react";

import { Box, GridItem, SimpleGrid, Text } from "@chakra-ui/react";

import { ContentContainer } from "@/common/layouts";
import type { DeviceProfile, VillageProfile } from "@/interfaces/region/village";
import { dayjs } from "@/lib/dayjs";
import { getIndonesianTimeDivision } from "@/utils/helper";

const VillageInfoBox = ({ title, value }: { title: string; value: any }) => (
  <Box>
    <Text mb="12px" color="greymed.1">
      {title}
    </Text>
    <Text>{value}</Text>
  </Box>
);
interface VillageProfileProps {
  type: "village_profile" | "device_profile";
  villageProfile?: VillageProfile;
  deviceProfile?: DeviceProfile;
}
const DeviceVillageProfile: FC<VillageProfileProps> = ({ type, villageProfile, deviceProfile }) => {
  if (type === "village_profile" && villageProfile) {
    return (
      <Box as="section">
        <ContentContainer py={3}>
          <SimpleGrid columns={{ base: 2, md: 3, lg: 5 }} spacing={12} rowGap={{ base: 5, md: 12 }}>
            <GridItem>
              <VillageInfoBox title="ID Lapangan" value={villageProfile.field_id} />
            </GridItem>
            <GridItem>
              <VillageInfoBox title="Lokasi" value={`${villageProfile.long}, ${villageProfile.lat}`} />
            </GridItem>
            <GridItem>
              <VillageInfoBox title="Populasi" value={villageProfile.population} />
            </GridItem>
            <GridItem>
              <VillageInfoBox
                title="Tanggal Pemasangann"
                value={`${dayjs(villageProfile.install_date).format("DD/MM/YY HH:mm")} ${getIndonesianTimeDivision(
                  villageProfile.install_date
                )}`}
              />
            </GridItem>
            <GridItem>
              <VillageInfoBox
                title="Kontak Perwakilan"
                value={`${villageProfile.pic_name} (+${villageProfile.pic_phone})`}
              />
            </GridItem>
          </SimpleGrid>
        </ContentContainer>
      </Box>
    );
  } else if (type === "device_profile" && deviceProfile) {
    return (
      <Box as="section">
        <ContentContainer py={3}>
          <SimpleGrid columns={{ base: 2, md: 3, lg: 5 }} spacing={12} rowGap={{ base: 5, md: 12 }}>
            <GridItem>
              <VillageInfoBox title="ID Perangkat" value={deviceProfile.device_id} />
            </GridItem>
            <GridItem>
              <VillageInfoBox title="Kode Perangkat" value={deviceProfile.device_code} />
            </GridItem>
            <GridItem>
              <VillageInfoBox title="Merek" value={deviceProfile.brand} />
            </GridItem>
            <GridItem>
              <VillageInfoBox title="Kapasitas" value={deviceProfile.capacity} />
            </GridItem>
            <GridItem>
              <VillageInfoBox title="Daya" value={deviceProfile.power} />
            </GridItem>
            <GridItem>
              <VillageInfoBox title="Level" value={deviceProfile.level} />
            </GridItem>
            <GridItem>
              <VillageInfoBox title="Tipe" value={deviceProfile.type} />
            </GridItem>
            <GridItem>
              <VillageInfoBox
                title="Tanggal Pemasangan"
                value={`${dayjs(deviceProfile.install_date).format("DD/MM/YY HH:mm")} ${getIndonesianTimeDivision(
                  deviceProfile.install_date
                )}`}
              />
            </GridItem>
          </SimpleGrid>
        </ContentContainer>
      </Box>
    );
  } else {
    return <></>;
  }
};

export default DeviceVillageProfile;
