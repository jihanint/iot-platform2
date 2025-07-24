import type { ChangeEvent } from "react";
import { useRef, useState } from "react";
import { BiSearch } from "react-icons/bi";
import { GrClose } from "react-icons/gr";
import { IoFilter } from "react-icons/io5";

import { useRouter } from "next/router";

import {
  Box,
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

import { useUserState } from "@/common/hooks";
import type { DeviceData } from "@/interfaces/device";

interface FilterDeviceListTableProps {
  filterVillageName: string;
  onChangeVillageName: (e: ChangeEvent<HTMLInputElement>) => void;
  onApplyFilter: (data: any) => void;
  onResetFilter: () => void;
  onClearSearch: () => void;
  deviceData: DeviceData[];
}

const FilterDeviceListTable = ({
  filterVillageName,
  deviceData,
  onChangeVillageName,
  onApplyFilter,
  onResetFilter,
  onClearSearch,
}: FilterDeviceListTableProps) => {
  const btnRef = useRef();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedVillage, setSelectedVillage] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const { push } = useRouter();
  const { isAdmin } = useUserState();

  return (
    <Flex w="full" gap="10px" pt={{ base: "4vh", md: "initial" }} flexDir={{ base: "column", md: "row" }}>
      <Flex display="flex" className="left-content search-box" w={{ base: "85%", md: "95%" }}>
        <InputGroup>
          <Input
            placeholder="Cari desa"
            value={filterVillageName}
            onChange={onChangeVillageName}
            boxShadow="-2px 5px 5px 0px rgba(0, 0, 0, 0.06)"
          />
          <InputRightElement w={filterVillageName ? "80px" : "auto"} pr="8px">
            <Flex h="full" w="full" align="center" justify="space-around">
              <BiSearch fontSize="20px" />
              {filterVillageName && (
                <>
                  <Divider orientation="vertical" />
                  <GrClose fontSize="20px" cursor="pointer" onClick={onClearSearch} />
                </>
              )}
            </Flex>
          </InputRightElement>
        </InputGroup>
        <Box className="filter-box" w={{ base: "5%", md: "5%" }} zIndex={3}>
          <Button
            leftIcon={<IoFilter />}
            size="sm"
            ml={3}
            minW="100%"
            minH="100%"
            variant="ghost"
            fontWeight="semibold"
            color="black"
            ref={btnRef as any}
            onClick={onOpen}
            display={{ base: "none", md: "block" }}
          >
            Filter
          </Button>
          <Button
            leftIcon={<IoFilter />}
            ml={3}
            size="sm"
            minW="100%"
            minH="100%"
            variant="ghost"
            fontWeight="semibold"
            color="black"
            ref={btnRef as any}
            onClick={onOpen}
            display={{ base: "block", md: "none" }}
            justifyContent="center"
            alignContent="center"
          />
          <Drawer isOpen={isOpen} placement="right" onClose={onClose} finalFocusRef={btnRef as any}>
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerHeader>Filter Perangkat</DrawerHeader>

              <DrawerBody>
                <Flex direction="column" rowGap="8px">
                  <Box className="select-village">
                    <Text fontWeight="semibold"> Pilih Desa: </Text>
                    <Select onChange={e => setSelectedVillage(e.target.value)}>
                      <option value="all" selected>
                        Semua
                      </option>
                      {deviceData?.map((device, index) => (
                        <option value={device.village_name} key={index}>
                          {device.village_name}
                        </option>
                      ))}
                    </Select>
                  </Box>
                  <Box className="select-status">
                    <Text fontWeight="semibold"> Status: </Text>
                    <Select onChange={e => setSelectedStatus(e.target.value)}>
                      <option value="all" selected>
                        Semua
                      </option>
                      <option value="1">Kritis</option>
                      <option value="2">Peringatan</option>
                      <option value="3">Normal</option>
                      <option value="4">Tidak Aktif</option>
                    </Select>
                  </Box>
                </Flex>
              </DrawerBody>

              <DrawerFooter gap={2}>
                <Button
                  size="sm"
                  variant="outline-secondary"
                  onClick={() => {
                    onResetFilter();
                    onClearSearch();
                    onClose();
                  }}
                >
                  Reset
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    onApplyFilter({ village_name: selectedVillage, selected_status: selectedStatus });
                    onClose();
                  }}
                >
                  Terapkan
                </Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </Box>
      </Flex>

      <Flex className="right-content" w={{ base: "10%", md: "5%" }}></Flex>
      {isAdmin && (
        <Button
          px={8}
          py={5}
          borderRadius={"xl"}
          size={"sm"}
          onClick={() => push("/devices/create")}
          bgColor={"green.11"}
        >
          Tambah Perangkat
        </Button>
      )}
    </Flex>
  );
};

export default FilterDeviceListTable;
