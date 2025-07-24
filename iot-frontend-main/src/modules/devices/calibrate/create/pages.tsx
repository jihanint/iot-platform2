import { useEffect, useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useFieldArray, useForm } from "react-hook-form";
import { IoIosCloseCircleOutline } from "react-icons/io";

import { useRouter } from "next/router";

import {
  Box,
  Button,
  Divider,
  Flex,
  GridItem,
  Heading,
  HStack,
  Icon,
  Input,
  Select,
  SimpleGrid,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useMutation, useQuery } from "@tanstack/react-query";

import { useLayoutState, useToast } from "@/common/hooks";
import { ContentContainer } from "@/common/layouts";
import type { CalibratingDeviceParams } from "@/interfaces/device";
import { calibratingDevice, getCalibratedDevice } from "@/services/device";

const CreateCalibrateDevice = () => {
  const { query } = useRouter();
  const { push } = useRouter();
  const { setBreadCrumb } = useLayoutState();
  const toast = useToast();
  const [showWaterFlowTest, setShowWaterFlowTest] = useState(false);
  useEffect(() => {
    setBreadCrumb(`Kalibrasi Perangkat`);
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control,
    watch,
  } = useForm<CalibratingDeviceParams>();

  const {
    fields: fieldsInflow,
    append: appendInflow,
    remove: removeInflow,
  } = useFieldArray({
    control,
    name: "inflow",
  });

  const {
    fields: fieldsOutflow,
    append: appendOutflow,
    remove: removeOutflow,
  } = useFieldArray({
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
          if (res.data.inflow || res.data.outflow) {
            setShowWaterFlowTest(true);
          }
        }
      });
    },
    refetchOnWindowFocus: false,
    enabled: Boolean(query.device_id) === true,
  });

  const { mutateAsync } = useMutation({
    mutationFn: async (values: CalibratingDeviceParams) => {
      calibratingDevice({ ...values, device_id: parseInt(query.device_id as string) })
        .then(() => {
          toast({ title: "Success", status: "success", description: "Berhasil Kalibrasi Device" });
          push("/devices/calibrate");
        })
        .catch(e => {
          toast({
            title: "Error",
            status: "error",
            description: e.response.data.message || e.message,
          });
        });
    },
  });

  const onSubmit: SubmitHandler<CalibratingDeviceParams> = async data => {
    await mutateAsync(data as CalibratingDeviceParams);
  };

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
        <Flex className="add-village-profile" direction="column">
          <Heading fontSize="2xl" mb="52px" mt="40px">
            Kalibrasi Perangkat
          </Heading>
          <Flex align="center" w={{ base: "100%", md: "50%" }} gap={3}>
            <Text w="25%" fontWeight="semibold">
              Bentuk Reservoir
            </Text>
            <Select
              placeholder="Select option"
              {...register("shape", {
                required: true,
              })}
            >
              <option value="BLOCK">Persegi</option>
              <option value="TUBE">Lingkaran</option>
            </Select>
          </Flex>
          <SimpleGrid columns={{ base: 1, lg: 2 }} gap={8} my={3}>
            {watch("shape") === "BLOCK" && (
              <>
                <GridItem>
                  <Flex align="center" gap={3}>
                    <Text w="25%" fontWeight="semibold">
                      Panjang Reservoir
                    </Text>
                    <Input
                      type="number"
                      placeholder="Tinggi Reservoir"
                      variant="commonTextInput"
                      {...register("length", {
                        required: true,
                        setValueAs: val => parseInt(val),
                      })}
                    />
                  </Flex>
                  {errors.length && <RequiredText />}
                </GridItem>
                <GridItem>
                  <Flex align="center" gap={3}>
                    <Text w="25%" fontWeight="semibold">
                      Lebar Reservoir
                    </Text>
                    <Input
                      type="number"
                      placeholder="Tinggi Reservoir"
                      variant="commonTextInput"
                      {...register("width", {
                        required: true,
                        setValueAs: val => parseInt(val),
                      })}
                    />
                  </Flex>
                  {errors.width && <RequiredText />}
                </GridItem>
              </>
            )}

            {watch("shape") === "TUBE" && (
              <GridItem>
                <Flex align="center" gap={3}>
                  <Text w="25%" fontWeight="semibold">
                    Diameter Reservoir
                  </Text>
                  <Input
                    type="number"
                    placeholder="Diameter Reservoir"
                    variant="commonTextInput"
                    {...register("diameter", {
                      required: true,
                      setValueAs: val => parseInt(val),
                    })}
                  />
                </Flex>
                {errors.diameter && <RequiredText />}
              </GridItem>
            )}
          </SimpleGrid>
        </Flex>
        <Divider my={5} mb={9} />
        {/**
         * Add Device
         */}
        {showWaterFlowTest && (
          <Flex className="add-village-profile" direction="column" mb="40px">
            <Heading fontSize="2xl" mb="26px">
              Water Level
            </Heading>
            <SimpleGrid columns={{ base: 1, lg: 2 }} gap={8} mb={10}>
              <GridItem>
                <Flex align="center">
                  <Text w="25%" fontWeight="semibold">
                    Actual Level
                  </Text>
                  <Input
                    type="number"
                    placeholder="Actual Level"
                    variant="commonTextInput"
                    {...register("level.actual_level", {
                      required: true,
                      setValueAs: val => parseFloat(val),
                    })}
                  />
                </Flex>
                {errors.level?.actual_level && <RequiredText />}
              </GridItem>
              <GridItem>
                <Text fontSize={"20px"} fontWeight="semibold"></Text>
                <Flex align="center">
                  <Text w="25%" fontWeight="semibold">
                    Telemetry Level
                  </Text>
                  <Input
                    type="number"
                    placeholder="Telemetry Level"
                    variant="commonTextInput"
                    {...register("level.telemetry_level", {
                      required: true,
                      setValueAs: val => parseFloat(val),
                    })}
                  />
                </Flex>
                {errors.level?.telemetry_level && <RequiredText />}
              </GridItem>
            </SimpleGrid>

            {/* Inflow Outflow Dynamic */}
            <SimpleGrid columns={{ base: 1, lg: 2 }} gap={8} mb={3}>
              {/* Todo: Inflow Test will be refactor it to reusable component later */}
              <VStack gap={3} mb={3} w="full" alignItems={"flex-end"}>
                {fieldsInflow?.map((field, index) => {
                  return (
                    <>
                      <HStack w="full">
                        <Text w="full" fontSize={"20px"} fontWeight="semibold">
                          Inflow Test {index + 1}
                        </Text>
                        <Icon
                          onClick={() => removeInflow(index)}
                          cursor={"pointer"}
                          as={IoIosCloseCircleOutline}
                          boxSize={"24px"}
                        />
                      </HStack>

                      <Flex w="full" align="center" gap="4">
                        <Text w="25%" fontWeight="semibold">
                          Menit {index * 3 + 1}
                        </Text>
                        <Input
                          type="number"
                          placeholder="Actual Level"
                          variant="commonTextInput"
                          w="50%"
                          {...register(`inflow.${index}.first_test.actual_level`, {
                            required: true,
                            setValueAs: val => parseFloat(val),
                          })}
                        />
                        <Input
                          type="number"
                          placeholder="Telemetri Inflow"
                          variant="commonTextInput"
                          w="50%"
                          {...register(`inflow.${index}.first_test.telemetry_level`, {
                            required: true,
                            setValueAs: val => parseFloat(val),
                          })}
                        />
                      </Flex>
                      {errors.inflow && <RequiredText />}

                      <Flex w="full" align="center" gap={3}>
                        <Text w="25%" fontWeight="semibold">
                          Menit {index * 3 + 2}
                        </Text>
                        <Input
                          type="number"
                          placeholder="Actual Level"
                          variant="commonTextInput"
                          w="50%"
                          {...register(`inflow.${index}.second_test.actual_level`, {
                            required: true,
                            setValueAs: val => parseFloat(val),
                          })}
                        />
                        <Input
                          type="number"
                          placeholder="Telemetri Inflow"
                          variant="commonTextInput"
                          w="50%"
                          {...register(`inflow.${index}.second_test.telemetry_level`, {
                            required: true,
                            setValueAs: val => parseFloat(val),
                          })}
                        />
                      </Flex>
                      {errors.inflow && <RequiredText />}

                      <Flex w="full" align="center" gap={3}>
                        <Text w="25%" fontWeight="semibold">
                          Menit {index * 3 + 3}
                        </Text>
                        <Input
                          type="number"
                          placeholder="Actual Level"
                          variant="commonTextInput"
                          w="50%"
                          {...register(`inflow.${index}.third_test.actual_level`, {
                            required: true,
                            setValueAs: val => parseFloat(val),
                          })}
                        />
                        <Input
                          type="number"
                          placeholder="Telemetri Inflow"
                          variant="commonTextInput"
                          w="50%"
                          {...register(`inflow.${index}.third_test.telemetry_level`, {
                            required: true,
                            setValueAs: val => parseFloat(val),
                          })}
                        />
                      </Flex>
                      {errors.inflow && <RequiredText />}
                    </>
                  );
                })}

                <Button
                  w="fit-content"
                  onClick={() => appendInflow({ first_test: undefined, second_test: undefined, third_test: undefined })}
                >
                  Tambah Inflow
                </Button>
              </VStack>
              {/* Todo: Outflow Test will refactor it to reusable component later */}
              <VStack gap={3} mb={3} w="full" alignItems={"flex-end"}>
                {fieldsOutflow?.map((field, index) => {
                  return (
                    <>
                      <HStack w="full">
                        <Text w="full" fontSize={"20px"} fontWeight="semibold">
                          Outflow Test {index + 1}
                        </Text>
                        <Icon
                          onClick={() => removeOutflow(index)}
                          cursor={"pointer"}
                          as={IoIosCloseCircleOutline}
                          boxSize={"24px"}
                        />
                      </HStack>
                      <Flex w="full" align="center" gap={3}>
                        <Text w="25%" fontWeight="semibold">
                          Menit {index * 3 + 1}
                        </Text>
                        <Input
                          type="number"
                          placeholder="Actual Level"
                          variant="commonTextInput"
                          w="50%"
                          {...register(`outflow.${index}.first_test.actual_level`, {
                            required: true,
                            setValueAs: val => parseFloat(val),
                          })}
                        />
                        <Input
                          type="number"
                          placeholder="Telemetri Outflow"
                          variant="commonTextInput"
                          w="50%"
                          {...register(`outflow.${index}.first_test.telemetry_level`, {
                            required: true,
                            setValueAs: val => parseFloat(val),
                          })}
                        />
                      </Flex>
                      {errors.outflow && <RequiredText />}

                      <Flex w="full" align="center" gap={3}>
                        <Text w="25%" fontWeight="semibold">
                          Menit {index * 3 + 2}
                        </Text>
                        <Input
                          type="number"
                          placeholder="Actual Level"
                          variant="commonTextInput"
                          w="50%"
                          {...register(`outflow.${index}.second_test.actual_level`, {
                            required: true,
                            setValueAs: val => parseFloat(val),
                          })}
                        />
                        <Input
                          type="number"
                          placeholder="Telemetri Outflow"
                          variant="commonTextInput"
                          w="50%"
                          {...register(`outflow.${index}.second_test.telemetry_level`, {
                            required: true,
                            setValueAs: val => parseFloat(val),
                          })}
                        />
                      </Flex>
                      {errors.outflow && <RequiredText />}
                      <Flex w="full" align="center" gap={3}>
                        <Text w="25%" fontWeight="semibold">
                          Menit {index * 3 + 3}
                        </Text>
                        <Input
                          type="number"
                          placeholder="Actual Level"
                          variant="commonTextInput"
                          w="50%"
                          {...register(`outflow.${index}.third_test.actual_level`, {
                            required: true,
                            setValueAs: val => parseFloat(val),
                          })}
                        />
                        <Input
                          type="number"
                          placeholder="Telemetri Outflow"
                          variant="commonTextInput"
                          w="50%"
                          {...register(`outflow.${index}.third_test.telemetry_level`, {
                            required: true,
                            setValueAs: val => parseFloat(val),
                          })}
                        />
                      </Flex>
                      {errors.outflow && <RequiredText />}
                    </>
                  );
                })}

                <Button
                  w="fit-content"
                  onClick={() =>
                    appendOutflow({ first_test: undefined, second_test: undefined, third_test: undefined })
                  }
                >
                  Tambah Outflow
                </Button>
              </VStack>
            </SimpleGrid>
          </Flex>
        )}

        <Stack flexDir={{ base: "column", md: "row" }} justifyContent={"space-between"}>
          {!showWaterFlowTest && (
            <Button onClick={() => setShowWaterFlowTest(prev => !prev)}>Tambah Test Waterflow</Button>
          )}
          <Button onClick={handleSubmit(onSubmit)}>Kalibrasi Perangkat</Button>
        </Stack>
      </Box>
    </ContentContainer>
  );
};

export default CreateCalibrateDevice;
