import React, { useEffect } from "react";
import { Controller } from "react-hook-form";
import { FaRegUser, FaSave } from "react-icons/fa";

import { Button, Flex, useDisclosure } from "@chakra-ui/react";

import InputContainer from "@/components/input/Container";
import InputEmailOrPhone from "@/components/input/EmailOrPhone";
import InputText from "@/components/input/Text";
import ModalAddVillage from "@/components/modal/AddVillage";
import VillageBadgeList from "@/components/shared/VillageBadgeList";
import useSearchVillage from "@/hooks/useSearchVillage";
import type { IRequestUserAssignment } from "@/services/user/assignment/type";
import type { IUserDetailItem } from "@/services/user/type";

import useFormValue from "./useFormValue";

export interface IUserAssignmentDetailFormProps {
  userDetail?: IUserDetailItem;
  onSubmitUserAssignment: (data: IRequestUserAssignment) => void;
  isEditable?: boolean;
}

const UserAssignmentDetailForm = ({ ...props }: IUserAssignmentDetailFormProps) => {
  const { villages, control, handleDeleteSelectedVillage, handleAddSelectedVillage, submitForm } = useFormValue({
    prefilledData: props.userDetail,
    onSubmit: props.onSubmitUserAssignment,
  });

  const { handleSetKeyword, handleResetKeyword, villageList } = useSearchVillage();

  const {
    isOpen: isOpenModalAddVillage,
    onOpen: onOpenModalAddVillage,
    onClose: onCloseModalAddVillage,
  } = useDisclosure();

  const handleOpenModalAddVillage = () => {
    onOpenModalAddVillage();
  };

  useEffect(() => {
    if (!isOpenModalAddVillage) {
      handleResetKeyword();
    }
  }, [isOpenModalAddVillage]);

  return (
    <Flex direction="column">
      <Flex flex={2} gap={4}>
        {/* User/Full Name */}
        <Controller
          control={control}
          name="user_name"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <InputContainer label="Nama Lengkap" flex={1}>
              <InputText
                isDisabled={!props.isEditable}
                value={value}
                name="fullname"
                placeholder="Nama Lengkap"
                onChange={onChange}
                error={error?.message}
                leftElement={<FaRegUser fontSize={20} />}
              />
            </InputContainer>
          )}
        />
        {/* Email */}
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <InputContainer label="Alamat Email" flex={1}>
              <InputText
                value={value}
                isDisabled={!props.isEditable}
                name="fullname"
                placeholder="- Alamat Email -"
                onChange={onChange}
                error={error?.message}
                leftElement={<FaRegUser fontSize={20} />}
              />
            </InputContainer>
          )}
        />
      </Flex>
      <Flex flex={2} gap={4}>
        {/* Phone Number */}
        <Controller
          control={control}
          name="phone_number"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <InputContainer label="Telepon" flex={1}>
              <InputEmailOrPhone
                value={value}
                isDisabled={!props.isEditable}
                name="fullname"
                placeholder="- Nomor Telepon -"
                onChange={onChange}
                error={error?.message}
                leftElement={<FaRegUser fontSize={20} />}
              />
            </InputContainer>
          )}
        />
        {/* Role */}
        <Controller
          control={control}
          name="role"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <InputContainer label="Peran" flex={1}>
              <InputText
                isDisabled={!props.isEditable}
                value={value}
                name="fullname"
                placeholder="- Peran Pengguna -"
                onChange={onChange}
                error={error?.message}
                leftElement={<FaRegUser fontSize={20} />}
              />
            </InputContainer>
          )}
        />
      </Flex>

      <VillageBadgeList
        villages={villages}
        onAddNewVillage={handleOpenModalAddVillage}
        onDeleteSelectedVillage={handleDeleteSelectedVillage}
      />

      <ModalAddVillage
        isOpen={isOpenModalAddVillage}
        onClose={onCloseModalAddVillage}
        onOpen={onOpenModalAddVillage}
        onChangeSearch={handleSetKeyword}
        onClickSelectedVillage={handleAddSelectedVillage}
        villageList={villageList}
        villages={villages}
        onDeleteSelectedVillage={handleDeleteSelectedVillage}
      />
      <Flex justify="flex-end">
        <Button
          background="primary.7"
          color="white"
          size="sm"
          mt={12}
          minH="50px"
          minW="200px"
          _active={{
            background: "primary.7",
            color: "white",
          }}
          _hover={{
            background: "primary.8",
            color: "white",
          }}
          leftIcon={<FaSave />}
          onClick={submitForm}
        >
          Simpan
        </Button>
      </Flex>
    </Flex>
  );
};

export default UserAssignmentDetailForm;
