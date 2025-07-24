import { useEffect, useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";

import { useRouter } from "next/router";

import { Box, Button, Divider, Flex, GridItem, Heading, Input, Select, SimpleGrid, Text } from "@chakra-ui/react";
import { useMutation, useQuery } from "@tanstack/react-query";

import { useLayoutState, useToast } from "@/common/hooks";
import { ContentContainer } from "@/common/layouts";
import type { CreateDeviceParams } from "@/interfaces/device";
import { dayjs } from "@/lib/dayjs";
import { getDetailDevice, saveDevice } from "@/services/device";
import { getCityList, getDistrictList, getProvinceList } from "@/services/region";
import { convertDateFormatForInput } from "@/utils/helper";

const EditDevice = () => {
  const { query, push } = useRouter();
  const { setBreadCrumb } = useLayoutState();
  const [isChangedAddress, setIsChangedAddress] = useState<"province" | "city" | null>(null);
  const [selectedProvinceID, setSelectedProvinceID] = useState<string>("");
  const [selectedCityID, setSelectedCityID] = useState<string>("");
  const [selectedDistrictID, setSelectedDistrictID] = useState<string>("");
  const toast = useToast();
  useEffect(() => {
    setBreadCrumb(`Tambah/Ubah Perangkat`);
  }, []);

  const { isLoading: isLoadingDetailDevice } = useQuery({
    queryKey: ["get_detail_device"],
    queryFn: () => {
      getDetailDevice({ device_id: parseInt(query.device_id as string) }).then(res => {
        setSelectedProvinceID(res.data.village_data.province_id.toString());

        setSelectedCityID(res.data.village_data.city_id.toString());
        setSelectedDistrictID(res.data.village_data.district_id.toString());
        reset({
          village_name: res.data.village_data.village_name,
          field_code: res.data.village_data.field_code,
          location: res.data.village_data.lat + "," + res.data.village_data.long,
          district_id: res.data.village_data.district_id,
          population: res.data.village_data.population,
          iot_install_date: convertDateFormatForInput(res.data.device_data.iot_install_date),
          pic_name: res.data.village_data.pic_name,
          pic_contact: res.data.village_data.pic_contact,
          device_code: res.data.device_data?.device_code,
          brand: res.data.device_data.brand,
          capacity: res.data.device_data.capacity,
          power: res.data.device_data.power,
          level: res.data.device_data.level,
          type: res.data.device_data.type,
          pump_install_date: convertDateFormatForInput(res.data.village_data.pump_install_date),
        });
      });
    },
    refetchOnWindowFocus: false,
    enabled: Boolean(query.device_id) === true,
  });

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
      return getCityList({ province_id: parseInt(selectedProvinceID) });
    },
    refetchOnWindowFocus: false,
    enabled: Boolean(selectedProvinceID !== ""),
  });

  const { data: districtList } = useQuery({
    queryKey: ["get_district_list", selectedCityID],
    queryFn: () => {
      return getDistrictList({ city_id: parseInt(selectedCityID as string) });
    },
    refetchOnWindowFocus: false,
    enabled: Boolean(selectedCityID),
  });

  const {
    register,
    reset,
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
          device_id: parseInt(query.device_id as string),
        };

        saveDevice(transformedObject)
          .then(() => {
            toast({ title: "Success", status: "success", description: "Berhasil Ubah Device" });
            push("/devices");
          })
          .catch(e => {
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

  useEffect(() => {
    if (isChangedAddress === "province") {
      setSelectedCityID("");
      setSelectedDistrictID("");
    } else if (isChangedAddress === "city") {
      setSelectedDistrictID("");
    }
  }, [isChangedAddress]);

  const RequiredText = () => (
    <Box py={2}>
      <Text textAlign="right" color="red">
        Wajib Diisi
      </Text>
    </Box>
  );

  return !isLoadingDetailDevice ? (
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
                  key={selectedProvinceID}
                  placeholder="Pilih Provinsi"
                  onChange={e => {
                    setSelectedProvinceID(e.target.value);
                    setIsChangedAddress("province");
                  }}
                  defaultValue={selectedProvinceID.toString()}
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
              {cityList ? (
                <Flex align="center">
                  <Text w="25%" fontWeight="semibold">
                    Kabupaten / Kota
                  </Text>
                  <Select
                    key={selectedProvinceID + selectedCityID}
                    placeholder="Pilih Kabupaten / Kota"
                    onChange={e => {
                      setSelectedCityID(e.target.value);
                      setIsChangedAddress("city");
                    }}
                    defaultValue={selectedCityID.toString()}
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
              {districtList ? (
                <>
                  <Flex align="center">
                    <Text w="25%" fontWeight="semibold">
                      Kecamatan
                    </Text>
                    <Select
                      key={selectedDistrictID}
                      placeholder="Pilih Kecamatan"
                      {...register("district_id", {
                        required: true,
                        setValueAs: val => parseInt(val),
                      })}
                      defaultValue={selectedDistrictID.toString()}
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
                <Input
                  type="number"
                  placeholder="Populasi"
                  variant="commonTextInput"
                  {...register("population", { required: true, setValueAs: val => parseInt(val) })}
                />
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
                <Input
                  type="number"
                  placeholder="Kapasitas"
                  variant="commonTextInput"
                  {...register("capacity", { required: true, setValueAs: val => parseFloat(val) })}
                />
              </Flex>
              {errors.capacity && <RequiredText />}
            </GridItem>
            <GridItem>
              <Flex align="center">
                <Text w="25%" fontWeight="semibold">
                  Daya
                </Text>
                <Input
                  type="number"
                  placeholder="Daya"
                  variant="commonTextInput"
                  {...register("power", { required: true, setValueAs: val => parseInt(val) })}
                />
              </Flex>
              {errors.power && <RequiredText />}
            </GridItem>
            <GridItem>
              <Flex align="center">
                <Text w="25%" fontWeight="semibold">
                  Level{" "}
                </Text>
                <Input
                  type="number"
                  placeholder="Level"
                  variant="commonTextInput"
                  {...register("level", { required: true, setValueAs: val => parseFloat(val) })}
                />
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
                  // defaultValue={"2018-06-12T19:30"}
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
        <Button onClick={handleSubmit(onSubmit)}>Ubah Perangkat</Button>
      </Box>
    </ContentContainer>
  ) : (
    <></>
  );
};

export default EditDevice;

// "village_name": "Example Village",
// "field_code": "ABC123",
// "population": 1000,
// "pic_name": "John Doe",
// "district_id": 987654,
// "lat": 12.345, "long": 67.890,
// "iot_install_date": "2022-02-01"
// "pic_contact": "+6285712345678",

// "device_id": 0,
// "brand": "Lorentz",
//     "power": 250,
//         "type": "Solar Panel",
//         "device_code": "08:B6:1F:F1:82:69",
//             "capacity": 500,
//             "level": 80,
//     "pump_install_date": "2022-01-01",
