import type { ReactElement } from "react";
import React, { useCallback, useMemo, useRef, useState } from "react";
import type { DateRange } from "react-day-picker";
import { DayPicker } from "react-day-picker";
import { BiChevronDown } from "react-icons/bi";
import { IoClose } from "react-icons/io5";

import {
  Box,
  Button,
  Center,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Heading,
  Icon,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Spinner,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";

import { NotificationBox } from "@/common/components";
import { useUserState } from "@/common/hooks";
import { getAlertList, reviewAlert } from "@/services/alert";
import { getVillageList } from "@/services/region";

import InputSearch from "../input/InputSearch";
import ModalAddReview from "../NotificationBox/ModalAddReview";

import "react-day-picker/style.css";
export interface NotificationDrawerProps {
  button: ReactElement<{ onClick?: () => void }>;
}

const KEY_GET_ALERT_LIST = (area_id: number | null, start_time: string | undefined, end_time: string | undefined) => [
  "get_infinite_notification_data",
  area_id,
  start_time,
  end_time,
];

const NotificationDrawer = (props: NotificationDrawerProps) => {
  const btnRef = useRef();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [selectedFilterVillage, setSelectedFilterVillage] = useState<number | null>(null);
  const queryClient = useQueryClient();
  const [dateRange, setDateRange] = useState<{ from: string | undefined; to: string | undefined }>({
    from: undefined,
    to: undefined,
  });

  const [reviewNotif, setReviewNotif] = useState(0);
  const toast = useToast();

  const {
    data: notificationData,
    isFetching,
    refetch,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: KEY_GET_ALERT_LIST(selectedFilterVillage, dateRange?.from, dateRange?.to),
    queryFn: () =>
      getAlertList({
        page_number: pageNumber,
        page_size: 6,
        start_date: dateRange.from,
        end_date: dateRange.to,
        area_id: selectedFilterVillage ? selectedFilterVillage : undefined,
      }),
    getNextPageParam: async lastPage => await lastPage?.meta?.total_pages,
    refetchOnWindowFocus: false,
  });
  const { mutate, mutateAsync } = useMutation(
    async ({ alert_id, message }: { alert_id: number; message: string }) => {
      return await reviewAlert(alert_id, message);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["get_infinite_notification_data"]);
        setReviewNotif(0);

        toast({ title: "Berhasil Menambahkan Tinjaun ", status: "success" });
      },
      onError: (errorResponse: any) => {
        toast({ title: "Gagal Review", status: "error", description: errorResponse.responses.data.message ?? "Error" });
      },
    }
  );

  const handleAlertReview = useCallback(
    (message: string) => {
      mutate({ alert_id: reviewNotif, message });
    },
    [reviewNotif, mutateAsync]
  );
  const ButtonWithClick = React.cloneElement(props.button, {
    onClick: () => {
      props.button.props?.onClick?.();
      onOpen();
    },
  });
  const { isAdmin } = useUserState();
  const { data: villages } = useQuery({
    queryKey: ["get_village"],
    queryFn: () => getVillageList({ is_assigned_for: isAdmin ? false : true, is_device_installed: true }),
    refetchOnWindowFocus: false,
  });

  const optionsVillage = useMemo(
    () => (villages ? villages?.data.map(data => ({ value: data.id, label: data.name })) : []),
    [villages]
  );

  const handleDateRangeSelect = (range: DateRange | undefined) => {
    if (!range) return;
    queryClient.invalidateQueries(KEY_GET_ALERT_LIST(selectedFilterVillage, dateRange.from, dateRange.to));
    const formatDateTime = (date: Date, endOfDay: boolean = false) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = endOfDay ? "23" : "00";
      const minutes = endOfDay ? "59" : "00";
      const seconds = endOfDay ? "59" : "00";

      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    const formattedRange = {
      from: range.from ? formatDateTime(new Date(range.from)) : null,
      to: range.to ? formatDateTime(new Date(range.to), true) : null,
    };

    setDateRange(formattedRange as { from: string | undefined; to: string | undefined });
  };

  const resetDateRange = () => {
    setDateRange({ from: undefined, to: undefined });
  };

  return (
    <>
      {ButtonWithClick}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} finalFocusRef={btnRef as any}>
        <DrawerOverlay />
        <DrawerContent minW={{ base: "100%", md: "500px" }} minH="100vh">
          <DrawerCloseButton bg="greylight.2" top={5} />
          <DrawerHeader>
            <Heading fontWeight="medium">Peringatan</Heading>
          </DrawerHeader>

          <DrawerBody>
            <Stack flexDir={{ base: "column", lg: "row" }}>
              <InputSearch
                onChange={e => {
                  queryClient.invalidateQueries(
                    KEY_GET_ALERT_LIST(selectedFilterVillage, dateRange.from, dateRange.to)
                  );
                  setSelectedFilterVillage(parseInt(e.value.toString()));
                }}
                isClearable
                placeholder={"Pilih Desa"}
                options={optionsVillage}
              />
              <Popover>
                <PopoverTrigger>
                  <Button
                    color="greydark.5"
                    fontSize="14px"
                    minH={"40px"}
                    maxH={"40px"}
                    h={"40px"}
                    minW={dateRange.from ? "242px" : "150px"}
                    position="relative"
                    pr={dateRange.from ? "32px" : "24px"}
                    variant="outline"
                    borderColor={"#e2e8f0"}
                  >
                    {dateRange.from
                      ? `${dateRange.from ? format(dateRange.from, "MMM dd, yyyy") : ""} - ${
                          dateRange.to ? format(dateRange.to, "MMM dd, yyyy") : ""
                        }`
                      : "Pilih Tanggal"}
                    <Icon
                      as={dateRange.from ? IoClose : BiChevronDown}
                      boxSize={5}
                      color="greydark_3"
                      position="absolute"
                      right={2}
                      onClick={dateRange.from ? resetDateRange : undefined}
                    />
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverBody>
                    <DayPicker
                      endMonth={new Date()}
                      mode="range"
                      selected={dateRange as DateRange}
                      onSelect={handleDateRangeSelect}
                    />
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </Stack>
            {notificationData && !isFetching ? (
              <>
                {notificationData.pages[0].data.length !== 0 ? (
                  notificationData.pages?.map((group, i) => (
                    <Box key={i}>
                      {group?.data?.map((x, y) => (
                        <Box borderBottom="1px solid #E0E0E0" key={y}>
                          <NotificationBox
                            onClick={id => setReviewNotif(id)}
                            notificationData={x}
                            refetchData={refetch}
                          />
                        </Box>
                      ))}
                    </Box>
                  ))
                ) : (
                  <Center w={"full"} h={"300px"}>
                    <Text>Tidak Ada Peringatan</Text>
                  </Center>
                )}
              </>
            ) : isFetching ? (
              <Flex align="center" justify="center" h="100%">
                <Spinner size="md" />
              </Flex>
            ) : (
              <Text color={"black"} align="center">
                Tidak Ada Peringatan
              </Text>
            )}

            {(notificationData as any)?.pages?.at(-1)?.meta?.total_pages > pageNumber && (
              <Flex w="full" my="2rem" px={4}>
                <Button
                  onClick={async () => {
                    await setPageNumber(pageNumber + 1);
                    fetchNextPage();
                  }}
                  w="full"
                >
                  Load More
                </Button>
              </Flex>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <ModalAddReview
        onClick={handleAlertReview}
        onOpen={() => console.log("")}
        isOpen={reviewNotif !== 0}
        onClose={() => setReviewNotif(0)}
      />
    </>
  );
};

export default NotificationDrawer;
