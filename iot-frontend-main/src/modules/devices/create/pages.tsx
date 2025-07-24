import { useEffect, useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";

import { useRouter } from "next/router";

import {
  Box,
  Button,
  Divider,
  Flex,
  GridItem,
  Heading,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { useMutation, useQuery } from "@tanstack/react-query";

import { useLayoutState, useToast } from "@/common/hooks";
import { ContentContainer } from "@/common/layouts";
import type { CreateDeviceParams } from "@/interfaces/device";
import { dayjs } from "@/lib/dayjs";
import { saveDevice } from "@/services/device";
import { getCityList, getDistrictList, getProvinceList } from "@/services/region";

const CreateDevice = () => {
  const { push } = useRouter();
  const { setBreadCrumb } = useLayoutState();
  const toast = useToast();
  const [selectedProvinceID, setSelectedProvinceID] = useState<string>("");
  const [selectedCityID, setSelectedCityID] = useState<string>("");
  const [selectedDistrictID, setSelectedDistrictID] = useState<string>("");

  useEffect(() => {
    setBreadCrumb(`Tambah/Ubah Perangkat`);
  }, []);

  const { data: provinceList } = useQuery({
    queryKey: ["get_province_list"],
    queryFn: () => {
      return getProvinceList();
    },
    refetchOnWindowFocus: false,
  });

  const { data: cityList } = useQuery({
    queryKey: ["get_city_list", selectedProvinceID],
    queryFn: () => {
      console.log(parseInt(selectedProvinceID));
      return getCityList({ province_id: parseInt(selectedProvinceID) });
    },
    refetchOnWindowFocus: false,
    enabled: Boolean(selectedProvinceID !== ""),
  });

  const { data: districtList } = useQuery({
    queryKey: ["get_district_list", selectedCityID],
    queryFn: () => {
      return getDistrictList({ city_id: parseInt(selectedCityID) });
    },
    refetchOnWindowFocus: false,
    enabled: Boolean(selectedCityID),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateDeviceParams>();

  const { mutateAsync } = useMutation({
    mutationFn: async (values: CreateDeviceParams) => {
      const { location, ...rest } = values as unknown as CreateDeviceParams;
      if (location) {
        const [lat, long] = location.split(",").map(Number);

        const transformedObject = {
          ...rest,
          lat,
          long,
        };

        saveDevice(transformedObject)
          .then(() => {
            toast({ title: "Success", status: "success", description: "Berhasil Buat Device" });
            push("/devices");
          })
          .catch(e => {
            console.log(e);
            toast({
              title: "Error",
              status: "error",
              description: e.response.data.message || e.message,
            });
          });
      }
    },
  });

  const onSubmit: SubmitHandler<CreateDeviceParams> = async data => await mutateAsync(data as CreateDeviceParams);

  // const onSaveDevice = useCallback(() => {
  //   mutateAsync();
  // }, []);

  useEffect(() => {
    setSelectedDistrictID("");
    setSelectedCityID("");
  }, [selectedProvinceID]);

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
            Profil Desa
          </Heading>
          <SimpleGrid columns={{ base: 1, lg: 2 }} gap={8} mb={3}>
            <GridItem>
              <Flex align="center">
                <Text w="25%" fontWeight="semibold">
                  Nama Desa
                </Text>
                <Input
                  type="text"
                  placeholder="Nama Desa"
                  variant="commonTextInput"
                  {...register("village_name", {
                    required: true,
                  })}
                />
              </Flex>
              {errors.village_name && <RequiredText />}
            </GridItem>
            <GridItem>
              <Flex align="center">
                <Text w="25%" fontWeight="semibold">
                  Provinsi
                </Text>
                <Select
                  placeholder="Pilih Provinsi"
                  onChange={e => {
                    setSelectedProvinceID(e.target.value);
                  }}
                >
                  {provinceList?.data.map(province => (
                    <option key={province.id} value={province.id}>
                      {province.name}
                    </option>
                  ))}
                </Select>
              </Flex>
            </GridItem>
            <GridItem>
              <Flex align="center">
                <Text w="25%" fontWeight="semibold">
                  ID Lapangan
                </Text>
                <Input
                  type="text"
                  placeholder="ID Lapangan"
                  variant="commonTextInput"
                  {...register("field_code", {
                    required: true,
                  })}
                />
              </Flex>
              {errors.field_code && <RequiredText />}
            </GridItem>
            <GridItem>
              {selectedProvinceID ? (
                <Flex align="center">
                  <Text w="25%" fontWeight="semibold">
                    Kabupaten / Kota
                  </Text>
                  <Select
                    placeholder="Pilih Kabupaten / Kota"
                    onChange={e => {
                      setSelectedCityID(e.target.value);
                    }}
                  >
                    {cityList?.data.map(city => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </Select>
                </Flex>
              ) : (
                <></>
              )}
            </GridItem>
            <GridItem>
              <Flex align="center">
                <Text w="25%" fontWeight="semibold">
                  Lokasi
                </Text>
                <Input
                  type="text"
                  placeholder="lat(-90 s/d 90),long(-180 s/d 180)"
                  variant="commonTextInput"
                  {...register("location", { required: true })}
                />
              </Flex>
              {errors.location && <RequiredText />}
            </GridItem>
            <GridItem>
              {selectedCityID ? (
                <>
                  <Flex align="center">
                    <Text w="25%" fontWeight="semibold">
                      Kecamatan
                    </Text>
                    <Select
                      placeholder="Pilih Kecamatan"
                      {...register("district_id", {
                        required: true,
                        setValueAs: val => parseInt(val),
                      })}
                    >
                      {districtList?.data.map(city => (
                        <option key={city.id} value={city.id}>
                          {city.name}
                        </option>
                      ))}
                    </Select>
                  </Flex>
                  {errors.district_id && <RequiredText />}
                </>
              ) : (
                <></>
              )}
            </GridItem>
            <GridItem>
              <Flex align="center">
                <Text w="25%" fontWeight="semibold">
                  Populasi
                </Text>
                <NumberInput min={0} width={"full"}>
                  <NumberInputField
                    type="number"
                    placeholder="Populasi"
                    h="50px"
                    _placeholder={{
                      color: "#969AB8",
                      fontSize: "14px",
                    }}
                    {...register("population", {
                      required: true,
                      setValueAs: val => parseInt(val),
                    })}
                  />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </Flex>
              {errors.population && <RequiredText />}
            </GridItem>
            <GridItem>
              <Flex align="center">
                <Text w="25%" fontWeight="semibold">
                  Tanggal Pemasangan
                </Text>
                <Input
                  type="datetime-local"
                  variant="commonTextInput"
                  {...register("iot_install_date", {
                    required: true,
                    setValueAs: val => dayjs(val).format("YYYY-MM-DD"),
                  })}
                />
              </Flex>
              {errors.iot_install_date && <RequiredText />}
            </GridItem>
            <GridItem>
              <Flex align="center">
                <Text w="25%" fontWeight="semibold">
                  Nama Perwakilan
                </Text>
                <Input
                  type="text"
                  placeholder="Nama Perwakilan"
                  variant="commonTextInput"
                  {...register("pic_name", { required: true })}
                />
              </Flex>
              {errors.pic_name && <RequiredText />}
            </GridItem>
            <GridItem>
              <Flex align="center">
                <Text w="25%" fontWeight="semibold">
                  Kontak Perwakilan
                </Text>
                <Input
                  type="text"
                  placeholder="Kontak Perwakilan"
                  variant="commonTextInput"
                  {...register("pic_contact", { required: true })}
                />
              </Flex>
              {errors.pic_contact && <RequiredText />}
            </GridItem>
          </SimpleGrid>
        </Flex>
        <Divider my={5} mb={9} />
        {/**
         * Add Device
         */}
        <Flex className="add-village-profile" direction="column" mb="40px">
          <Heading fontSize="2xl" mb="52px">
            Profil Perangkat
          </Heading>
          <SimpleGrid columns={{ base: 1, lg: 2 }} gap={8} mb={3}>
            <GridItem>
              <Flex align="center">
                <Text w="25%" fontWeight="semibold">
                  Kode Perangkat
                </Text>
                <Input
                  type="text"
                  placeholder="Kode Perangkat"
                  variant="commonTextInput"
                  {...register("device_code", {
                    required: true,
                  })}
                />
              </Flex>
              {errors.device_code && <RequiredText />}
            </GridItem>
            <GridItem>
              <Flex align="center">
                <Text w="25%" fontWeight="semibold">
                  Merek
                </Text>
                <Input
                  type="text"
                  placeholder="Merek"
                  variant="commonTextInput"
                  {...register("brand", {
                    required: true,
                  })}
                />
              </Flex>
              {errors.device_code && <RequiredText />}
            </GridItem>
            <GridItem>
              <Flex align="center">
                <Text w="25%" fontWeight="semibold">
                  Kapasitas
                </Text>
                <NumberInput w="full" min={0}>
                  <NumberInputField
                    type="number"
                    placeholder="Kapasitas"
                    h="50px"
                    _placeholder={{
                      color: "#969AB8",
                      fontSize: "14px",
                    }}
                    {...register("capacity", {
                      required: true,
                      setValueAs: val => parseFloat(val),
                    })}
                  />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </Flex>
              {errors.capacity && <RequiredText />}
            </GridItem>
            <GridItem>
              <Flex align="center">
                <Text w="25%" fontWeight="semibold">
                  Daya
                </Text>
                <NumberInput w="full" min={0}>
                  <NumberInputField
                    type="number"
                    placeholder="Daya"
                    h="50px"
                    _placeholder={{
                      color: "#969AB8",
                      fontSize: "14px",
                    }}
                    {...register("power", {
                      required: true,
                      setValueAs: val => parseInt(val),
                    })}
                  />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </Flex>
              {errors.device_code && <RequiredText />}
            </GridItem>
            <GridItem>
              <Flex align="center">
                <Text w="25%" fontWeight="semibold">
                  Level
                </Text>
                <NumberInput w="full" min={0}>
                  <NumberInputField
                    type="number"
                    placeholder="Level"
                    h="50px"
                    _placeholder={{
                      color: "#969AB8",
                      fontSize: "14px",
                    }}
                    {...register("level", {
                      required: true,
                      setValueAs: val => parseFloat(val),
                    })}
                  />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </Flex>
              {errors.level && <RequiredText />}
            </GridItem>
            <GridItem>
              <Flex align="center">
                <Text w="25%" fontWeight="semibold">
                  Tipe
                </Text>
                <Input
                  type="text"
                  placeholder="Tipe"
                  variant="commonTextInput"
                  {...register("type", {
                    required: true,
                  })}
                />
              </Flex>
              {errors.type && <RequiredText />}
            </GridItem>
            <GridItem>
              <Flex align="center">
                <Text w="25%" fontWeight="semibold">
                  Tanggal Pemasangan Perangkat
                </Text>
                <Input
                  type="datetime-local"
                  variant="commonTextInput"
                  {...register("pump_install_date", {
                    required: true,
                    setValueAs: val => dayjs(val).format("YYYY-MM-DD"),
                  })}
                />
              </Flex>
              {errors.pump_install_date && <RequiredText />}
            </GridItem>
          </SimpleGrid>
        </Flex>
        <Button onClick={handleSubmit(onSubmit)}>Simpan Perangkat</Button>
      </Box>
    </ContentContainer>
  );
};

export default CreateDevice;
