import React, { useCallback, useRef, useState } from "react";
import { GrCircleInformation } from "react-icons/gr";

import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Heading,
  IconButton,
  Spinner,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { NotificationBox } from "@/common/components";
import { getAlertList, reviewAlert } from "@/services/alert";

import ModalAddReview from "../NotificationBox/ModalAddReview";

const Notification = () => {
  const btnRef = useRef();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const queryClient = useQueryClient();
  const [reviewNotif, setReviewNotif] = useState(0);
  const toast = useToast();

  const {
    data: notificationData,
    isFetching,
    refetch,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["get_infinite_notification_data"],
    queryFn: () => getAlertList({ page_number: pageNumber, page_size: 6 }),
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

  return (
    <>
      <IconButton
        size="sm"
        justifyContent="center"
        alignItems="center"
        variant="ghost"
        color="white"
        aria-label="alert-icon"
        icon={<GrCircleInformation fontSize="25px" color="black" />}
        onClick={onOpen}
      />
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} finalFocusRef={btnRef as any}>
        <DrawerOverlay />
        <DrawerContent minW={{ base: "100%", md: "500px" }} minH="100vh">
          <DrawerCloseButton bg="greylight.2" top={5} />
          <DrawerHeader>
            <Heading fontWeight="medium">Peringatan</Heading>
          </DrawerHeader>

          <DrawerBody>
            {notificationData && !isFetching ? (
              <>
                {notificationData.pages?.map((group, i) => (
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
                ))}
              </>
            ) : isFetching ? (
              <Flex align="center" justify="center" h="100%">
                <Spinner size="md" />
              </Flex>
            ) : (
              <Text align="center">Tidak Ada Peringatan</Text>
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

export default Notification;
