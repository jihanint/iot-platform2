import React from "react";

import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import { AutoComplete, AutoCompleteInput, AutoCompleteItem, AutoCompleteList } from "@choc-ui/chakra-autocomplete";

import type { IVillageBadgeListProps } from "@/components/shared/VillageBadgeList";
import VillageBadgeList from "@/components/shared/VillageBadgeList";
import type { IModalProps } from "@/interfaces/modal";
import type { IRegionDataItem } from "@/interfaces/region";

interface IModalAddVillageProps
  extends IModalProps,
    Pick<IVillageBadgeListProps, "villages" | "onDeleteSelectedVillage"> {
  onChangeSearch: (search: string) => void;
  onClickSelectedVillage: (village: IRegionDataItem) => void;
  villageList: IRegionDataItem[];
}

const ModalAddVillage = ({ ...props }: IModalAddVillageProps) => {
  const handleChangeInput = (event: any) => {
    props.onChangeSearch(event.target.value);
  };

  const handleClickSelectedVillage = (data: IRegionDataItem) => {
    props.onClickSelectedVillage(data);
  };

  return (
    <Modal isCentered onClose={props.onClose} isOpen={props.isOpen}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Tambah Desa Baru</ModalHeader>
        <ModalCloseButton />
        <ModalBody mb={8}>
          <AutoComplete openOnFocus>
            <AutoCompleteInput placeholder="Cari Desa" variant="filled" onChange={handleChangeInput} />
            <AutoCompleteList>
              {props.villageList?.map(cnt => (
                <AutoCompleteItem
                  key={`${cnt.name}`}
                  value={cnt.name}
                  textTransform="capitalize"
                  onClick={() => handleClickSelectedVillage(cnt)}
                >
                  {cnt.name}
                </AutoCompleteItem>
              ))}
            </AutoCompleteList>
          </AutoComplete>
          <VillageBadgeList villages={props.villages} onDeleteSelectedVillage={props.onDeleteSelectedVillage} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ModalAddVillage;
