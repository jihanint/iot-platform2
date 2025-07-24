import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";

import { useRouter } from "next/router";

import { Box, Divider, Flex, GridItem, Heading, HStack, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";

import { useLayoutState } from "@/common/hooks";
import { ContentContainer } from "@/common/layouts";
import type { CalibratingDeviceParams } from "@/interfaces/device";
import { getCalibratedDevice } from "@/services/device";

const DetailCalibratedDevice = () => {
  const { query } = useRouter();

  const { setBreadCrumb } = useLayoutState();

  useEffect(() => {
    setBreadCrumb(`Kalibrasi Perangkat`);
  }, []);

  const {
    reset,
    watch,
    formState: { errors },
    control,
  } = useForm<CalibratingDeviceParams>();

  const { fields: fieldsInflow, append: appendInflow } = useFieldArray({
    control,
    name: "inflow",
  });

  const { fields: fieldsOutflow, append: appendOutflow } = useFieldArray({
    control,
    name: "outflow",
  });
  useQuery({
    queryKey: ["get_detail_calibrated_device"],
    queryFn: () => {
      getCalibratedDevice({ device_id: parseInt(query.device_id as string) }).then(res => {
        if (res.data) {
          reset({
            length: res.data.length,
            diameter: res.data.diameter,
            width: res.data.width,
            shape: res.data.shape,
            level: {
              telemetry_level: res.data.level.telemetry_level,
              actual_level: res.data.level.actual_level,
            },
          });
          res.data.inflow?.map(test => appendInflow(test));
          res.data.outflow?.map(test => appendOutflow(test));
        }
      });
    },
    refetchOnWindowFocus: false,
    enabled: Boolean(query.device_id) === true,
  });

  const RequiredText = () => (
    <Box py={2}>
      <Text textAlign="right" color="red">
        Wajib Diisi
      </Text>
    </Box>
  );

  return (
    <ContentContainer>
      <Box as="section">
        <Box as="section">
          <Heading fontSize="lg" mb="24px" mt="40px">
            Kalibrasi Perangkat
          </Heading>

          <SimpleGrid columns={{ base: 2, md: 3, lg: 5 }} spacing={2} rowGap={{ base: 5, md: 12 }}>
            <GridItem>
              <VillageInfoBox title="Bentuk Reservoir" value={watch("shape") === "BLOCK" ? "Persegi" : "Lingkaran"} />
            </GridItem>
            {watch("shape") === "BLOCK" && (
              <>
                <GridItem>
                  <VillageInfoBox title="Panjang Reservoir" value={watch("length")} />
                </GridItem>
                <GridItem>
                  <VillageInfoBox title="Lebar Reservoir" value={watch("width")} />
                </GridItem>
              </>
            )}

            {watch("shape") === "TUBE" && (
              <GridItem>
                <VillageInfoBox title="Lebar Reservoir" value={watch("diameter")} />
              </GridItem>
            )}
          </SimpleGrid>
        </Box>
        <Divider my={5} mb={9} />
        {/**
         * Add Device
         */}
        <Flex className="add-village-profile" direction="column" mb="40px">
          <Heading fontSize="lg" mb="26px">
            Water Level
          </Heading>
          <Text fontSize={"md"} fontWeight="semibold" mb="8px">
            Inflow
          </Text>
          <SimpleGrid columns={{ base: 2, md: 3, lg: 5 }} spacing={2} rowGap={{ base: 5, md: 12 }}>
            <GridItem>
              <VillageInfoBox title="Actual Level" value={watch("level.actual_level")} />
            </GridItem>
            <GridItem>
              <VillageInfoBox title="Telemetry Level" value={watch("level.telemetry_level")} />
            </GridItem>
          </SimpleGrid>

          {/* Inflow Outflow Dynamic */}
          <SimpleGrid columns={{ base: 1, lg: 2 }} gap={8} mt={4} mb={3}>
            {/* Todo: Inflow Test will be refactor it to reusable component later */}
            <VStack gap={5} mb={3} w="full" alignItems={"flex-end"}>
              {fieldsInflow?.map((field, index) => {
                return (
                  <VStack key={field.id} w="full">
                    <HStack w="full">
                      <Text w="full" fontSize={"md"} fontWeight="semibold">
                        Inflow Test {index + 1}
                      </Text>
                    </HStack>

                    {index === 0 && (
                      <Flex w="full" align="center" gap="4">
                        <Text w="25%" fontWeight="semibold"></Text>
                        <SimpleGrid w="full" columns={2} spacing={2} rowGap={{ base: 2, md: 12 }}>
                          <GridItem>
                            <VillageInfoBox isCenter title={`Actual Level`} />
                          </GridItem>
                          <GridItem>
                            <VillageInfoBox isCenter title={`Telemetry Level`} />
                          </GridItem>
                        </SimpleGrid>
                      </Flex>
                    )}

                    <Flex w="full" align="center" gap="4">
                      <Text w="25%" fontWeight="semibold">
                        Menit {index * 3 + 1}
                      </Text>
                      <SimpleGrid w="full" columns={2} spacing={2} rowGap={{ base: 2, md: 12 }}>
                        <GridItem>
                          <VillageInfoBox isCenter value={watch(`inflow.${index}.first_test.actual_level`)} />
                        </GridItem>
                        <GridItem>
                          <VillageInfoBox isCenter value={watch(`inflow.${index}.first_test.telemetry_level`)} />
                        </GridItem>
                      </SimpleGrid>
                    </Flex>
                    {errors.inflow && <RequiredText />}

                    <Flex w="full" align="center" gap={3}>
                      <Text w="25%" fontWeight="semibold">
                        Menit {index * 3 + 2}
                      </Text>

                      <SimpleGrid w="full" columns={2} spacing={2} rowGap={{ base: 2, md: 12 }}>
                        <GridItem>
                          <VillageInfoBox isCenter value={watch(`inflow.${index}.second_test.actual_level`)} />
                        </GridItem>
                        <GridItem>
                          <VillageInfoBox isCenter value={watch(`inflow.${index}.second_test.telemetry_level`)} />
                        </GridItem>
                      </SimpleGrid>
                    </Flex>
                    {errors.inflow && <RequiredText />}

                    <Flex w="full" align="center" gap={3}>
                      <Text w="25%" fontWeight="semibold">
                        Menit {index * 3 + 3}
                      </Text>
                      <SimpleGrid w="full" columns={2} spacing={2} rowGap={{ base: 2, md: 12 }}>
                        <GridItem>
                          <VillageInfoBox isCenter value={watch(`inflow.${index}.third_test.actual_level`)} />
                        </GridItem>
                        <GridItem>
                          <VillageInfoBox isCenter value={watch(`inflow.${index}.third_test.telemetry_level`)} />
                        </GridItem>
                      </SimpleGrid>
                    </Flex>
                    {errors.inflow && <RequiredText />}
                  </VStack>
                );
              })}
            </VStack>
            {/* Todo: Outflow Test will refactor it to reusable component later */}
            <VStack gap={5} mb={3} w="full" alignItems={"flex-end"}>
              {fieldsOutflow?.map((field, index) => {
                return (
                  <VStack w={"full"} key={field.id}>
                    <HStack w="full">
                      <Text w="full" fontSize={"md"} fontWeight="semibold">
                        Outflow Test {index + 1}
                      </Text>
                    </HStack>

                    {index === 0 && (
                      <Flex w="full" align="center" gap="4">
                        <Text w="25%" fontWeight="semibold"></Text>
                        <SimpleGrid w="full" columns={2} spacing={2} rowGap={{ base: 2, md: 12 }}>
                          <GridItem>
                            <VillageInfoBox isCenter title={`Actual Level`} />
                          </GridItem>
                          <GridItem>
                            <VillageInfoBox isCenter title={`Telemetry Level`} />
                          </GridItem>
                        </SimpleGrid>
                      </Flex>
                    )}

                    <Flex w="full" align="center" gap="4">
                      <Text w="25%" fontWeight="semibold">
                        Menit {index * 3 + 1}
                      </Text>
                      <SimpleGrid w="full" columns={2} spacing={2} rowGap={{ base: 2, md: 12 }}>
                        <GridItem>
                          <VillageInfoBox isCenter value={watch(`outflow.${index}.first_test.actual_level`)} />
                        </GridItem>
                        <GridItem>
                          <VillageInfoBox isCenter value={watch(`outflow.${index}.first_test.telemetry_level`)} />
                        </GridItem>
                      </SimpleGrid>
                    </Flex>
                    {errors.outflow && <RequiredText />}

                    <Flex w="full" align="center" gap={3}>
                      <Text w="25%" fontWeight="semibold">
                        Menit {index * 3 + 2}
                      </Text>

                      <SimpleGrid w="full" columns={2} spacing={2} rowGap={{ base: 2, md: 12 }}>
                        <GridItem>
                          <VillageInfoBox isCenter value={watch(`outflow.${index}.second_test.actual_level`)} />
                        </GridItem>
                        <GridItem>
                          <VillageInfoBox isCenter value={watch(`outflow.${index}.second_test.telemetry_level`)} />
                        </GridItem>
                      </SimpleGrid>
                    </Flex>
                    {errors.outflow && <RequiredText />}

                    <Flex w="full" align="center" gap={3}>
                      <Text w="25%" fontWeight="semibold">
                        Menit {index * 3 + 3}
                      </Text>
                      <SimpleGrid w="full" columns={2} spacing={2} rowGap={{ base: 2, md: 12 }}>
                        <GridItem>
                          <VillageInfoBox isCenter value={watch(`outflow.${index}.third_test.actual_level`)} />
                        </GridItem>
                        <GridItem>
                          <VillageInfoBox isCenter value={watch(`outflow.${index}.third_test.telemetry_level`)} />
                        </GridItem>
                      </SimpleGrid>
                    </Flex>
                    {errors.outflow && <RequiredText />}
                  </VStack>
                );
              })}
            </VStack>
          </SimpleGrid>
        </Flex>
      </Box>
    </ContentContainer>
  );
};

export default DetailCalibratedDevice;

const VillageInfoBox = ({ title, value, isCenter }: { title?: string; value?: any; isCenter?: boolean }) => (
  <Box>
    {title && (
      <Text mb="12px" color="greymed.1" textAlign={isCenter ? "center" : "start"}>
        {title}
      </Text>
    )}
    {value && <Text textAlign={isCenter ? "center" : "start"}>{value}</Text>}
  </Box>
);
