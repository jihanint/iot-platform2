import React from "react";
import { IoChevronDown } from "react-icons/io5";
import { TbSum } from "react-icons/tb";

import { HStack, Text } from "@chakra-ui/react";
import {
  Button,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  VStack,
} from "@chakra-ui/react";

export interface SumButtonProps {
  sumEachData: {
    name: string;
    total: number;
  }[];
  sumData: number;
  label: string;
  firstLabel: string;
}

const SumButton = ({ sumEachData, sumData, label, firstLabel }: SumButtonProps) => {
  return sumEachData.length !== 1 ? (
    <Popover>
      <PopoverTrigger>
        <Button
          border={"1px solid"}
          borderColor={"greylight.4"}
          h="fit-content"
          minH={"fit-content"}
          px={1}
          py={2}
          m={0}
          w={"fit-content"}
          variant={"transparent"}
          fontSize="sm"
        >
          {firstLabel}
          {sumData.toFixed(2)} {label} <IoChevronDown style={{ marginLeft: 4 }} />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>{firstLabel.replace("=", "")} tiap desa</PopoverHeader>
        <PopoverBody>
          <VStack>
            {sumEachData.map(data => (
              <HStack w={"full"} key={data.name}>
                <Text w={"full"} fontSize={"sm"}>
                  {data.name} : {data.total.toFixed(2)} {label}
                </Text>
              </HStack>
            ))}
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  ) : (
    <Button
      h="fit-content"
      minH={"fit-content"}
      px={0}
      py={0}
      m={0}
      w={"fit-content"}
      variant={"transparent"}
      fontSize="md"
    >
      (<TbSum /> {sumData.toFixed(2)} {label})
    </Button>
  );
};

export default SumButton;
