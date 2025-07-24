import { Radio, RadioGroup, Stack } from "@chakra-ui/react";

interface InputRadioProps {
  label?: string;
  onChange: (checked: boolean) => void;
  checked: boolean;
  disabled?: boolean;
}

export default function InputRadio({ checked, onChange, disabled, label }: InputRadioProps) {
  return <Stack>InputRadio</Stack>;
}
