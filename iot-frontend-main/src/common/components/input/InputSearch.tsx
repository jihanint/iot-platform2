import React from "react";
import type { Props as SelectProps } from "react-select";
import Select from "react-select";

import type { StackProps } from "@chakra-ui/react";
import { HStack, Text, VStack } from "@chakra-ui/react";

import { colors } from "@/configs/chakra/foundations";

export type IInputSearchOptionsType = { value: string | number; label: string }[];
export type InputSearchValueType = { value: string | number; label: string } | null;
export type InputSearchOnChangeType = (param: { value: string | number; label: string }) => void;
type InputSearchType = {
  isInvalid?: boolean;
  errorMsg?: string;
  options: IInputSearchOptionsType;
  placeholder?: string;
  value?: InputSearchValueType;
  onChange?: InputSearchOnChangeType;
  label?: string;
  containerProps?: StackProps;
};

const InputSearch: React.FC<Omit<SelectProps, "onChange"> & InputSearchType> = ({
  isInvalid,
  errorMsg,
  options,
  placeholder,
  value,
  onChange,
  label,
  containerProps,
  ...props
}) => {
  return (
    <VStack
      alignItems={"flex-end"}
      cursor={props.isDisabled ? "not-allowed" : "pointer"}
      justifyContent={"flex-end"}
      m={0}
      p={0}
      w="full"
      {...containerProps}
    >
      {label && (
        <HStack w="full">
          <Text fontSize={"14px"} variant={"bodyLargeRegular"}>
            {label}
          </Text>
        </HStack>
      )}
      <Select
        options={options}
        placeholder={placeholder}
        styles={{
          container: styles => ({
            ...styles,
            color: colors.greydark[5],
            fontSize: "16px",
            width: "100%",
          }),
          control: styles => ({
            ...styles,
            background: "#f9fafb",
            borderColor: isInvalid ? "#E53E3E" : "#e2e8f0",
            borderRadius: "8px",
            borderWidth: "2px",

            fontSize: "16px",
            width: "100%",
          }),
          placeholder: styles => ({ ...styles, fontSize: "14px" }),
        }}
        value={value}
        // TODO: will fix it later
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onChange={(newValue: any) => {
          if (onChange) {
            if (newValue === null) {
              onChange({ label: "", value: "" });
            } else {
              // Update with selected value
              onChange({ label: newValue.label, value: newValue.value });
            }
          }
        }}
        {...props}
      />
      {isInvalid && (
        <HStack w="full">
          {isInvalid && errorMsg && <span style={{ color: "red", fontSize: "12px" }}>{errorMsg}</span>}
        </HStack>
      )}
    </VStack>
  );
};

export default InputSearch;
