import { useState } from "react";

import { Button, Flex } from "@chakra-ui/react";

import type { THeaderTabs } from "@/constants/headerTabs";

export interface IHeaderTabsProps<TSelectedTabs> {
  data: THeaderTabs<TSelectedTabs>;
  onChange: (selectedTabs: TSelectedTabs) => void;
}

export default function HeaderTabs<TSelectedTabs>({ ...props }: IHeaderTabsProps<TSelectedTabs>) {
  const [activeValue, setActiveValue] = useState(props.data[0].value);

  return (
    <Flex gap={2}>
      {props.data.map((e, key) => {
        return (
          <Button
            key={key}
            background="primary.1"
            color="primary.7"
            border="2px solid"
            borderColor="primary.7"
            borderRadius="full"
            size="sm"
            minH="40px"
            isActive={activeValue === e.value}
            _active={{
              background: "primary.7",
              color: "white",
            }}
            _hover={{
              background: "primary.7",
              color: "white",
            }}
            onClick={() => {
              setActiveValue(e.value);
              props.onChange(e.value);
            }}
          >
            {e.label}
          </Button>
        );
      })}
    </Flex>
  );
}
