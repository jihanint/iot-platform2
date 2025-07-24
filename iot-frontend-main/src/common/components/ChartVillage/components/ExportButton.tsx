import React from "react";
import { FaRegFile } from "react-icons/fa";

import { ButtonGroup, FormControl, FormLabel, PopoverFooter, Select } from "@chakra-ui/react";
import {
  Button,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
} from "@chakra-ui/react";

export interface ExportButtonProps {
  setExportType: React.Dispatch<React.SetStateAction<string>>;
  handleExportFile: () => void;
  isDisabledCSV?: boolean;
}

const ExportButton = ({ setExportType, handleExportFile, isDisabledCSV }: ExportButtonProps) => {
  return (
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
          fontSize="md"
          size={"sm"}
          leftIcon={<FaRegFile size={"18px"} style={{ marginRight: 2 }} />}
        >
          Export
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>Export data</PopoverHeader>
        <PopoverBody>
          <FormControl>
            <FormLabel size={"sm"}>Format</FormLabel>
            <Select onChange={e => setExportType(e.target.value)} size={"sm"} w={"full"}>
              <option value="csv" disabled={isDisabledCSV}>
                CSV
              </option>
              <option value="xlsx" selected>
                XSLX
              </option>
              {/* <option value="year">Tahun</option> */}
            </Select>
          </FormControl>
        </PopoverBody>
        <PopoverFooter border="0" display="flex" alignItems="center" justifyContent="space-between" pb={4}>
          <ButtonGroup ml={"auto"} size="sm">
            <Button size={"sm"} variant={"secondary"}>
              Cancel
            </Button>
            <Button onClick={handleExportFile} size={"sm"}>
              Export
            </Button>
          </ButtonGroup>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
};

export default ExportButton;
