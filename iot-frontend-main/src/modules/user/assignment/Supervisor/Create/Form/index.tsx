import React, { useEffect } from "react";
import { Controller } from "react-hook-form";
import { FaRegUser, FaSave } from "react-icons/fa";

import { Button, Flex, Text, useDisclosure } from "@chakra-ui/react";

import InputContainer from "@/components/input/Container";
import InputEmailOrPhone from "@/components/input/EmailOrPhone";
import InputText from "@/components/input/Text";
import ModalAddVillage from "@/components/modal/AddVillage";
import VillageBadgeList from "@/components/shared/VillageBadgeList";
import useSearchVillage from "@/hooks/useSearchVillage";
import type { IRequestUserAssignment } from "@/services/user/assignment/type";

import useFormValue from "./useFormValue";

export interface IUserAssignmentSupervisorCreateFormProps {
  onSubmitUserAssignment: (data: IRequestUserAssignment) => void;
}

const UserAssignmentSupervisorCreateForm = ({ ...props }: IUserAssignmentSupervisorCreateFormProps) => {
  const { control, villages, isVillageEmpty, handleAddSelectedVillage, handleDeleteSelectedVillage, submitForm } =
    useFormValue({
      onSubmit: props.onSubmitUserAssignment,
    });

  const { villageList, handleSetKeyword, handleResetKeyword } = useSearchVillage();

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
        <Controller
          control={control}
          name="user_name"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <InputContainer label="Nama Lengkap" flex={1}>
              <InputText
                value={value}
                name="fullname"
                placeholder="Masukkan nama lengkap"
                onChange={onChange}
                error={error?.message}
                leftElement={<FaRegUser fontSize={20} />}
              />
            </InputContainer>
          )}
        />
        {/* Phone Number */}
        <Controller
          control={control}
          name="phone_number"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <InputContainer label="Telepon" flex={1}>
              <InputEmailOrPhone
                value={value}
                name="phone_number"
                placeholder="081234567890"
                onChange={onChange}
                error={error?.message}
                leftElement={<FaRegUser fontSize={20} />}
              />
            </InputContainer>
          )}
        />
      </Flex>
      {/* Role */}
      <Controller
        control={control}
        name="role"
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <InputContainer label="Peran" flex={1}>
            <InputText
              isDisabled
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

      <VillageBadgeList
        villages={villages}
        onAddNewVillage={handleOpenModalAddVillage}
        onDeleteSelectedVillage={handleDeleteSelectedVillage}
      />
      {isVillageEmpty && <Text color="red">*wajib menambahkan desa</Text>}

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

export default UserAssignmentSupervisorCreateForm;
