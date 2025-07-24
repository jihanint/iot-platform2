import React, { useEffect } from "react";
import { Controller } from "react-hook-form";
import { FaRegUser, FaSave } from "react-icons/fa";

import { Button, Flex, Text, useDisclosure } from "@chakra-ui/react";

import InputContainer from "@/components/input/Container";
import InputEmailOrPhone from "@/components/input/EmailOrPhone";
import InputPassword from "@/components/input/Password";
import InputText from "@/components/input/Text";
import ModalAddVillage from "@/components/modal/AddVillage";
import VillageBadgeList from "@/components/shared/VillageBadgeList";
import useSearchVillage from "@/hooks/useSearchVillage";
import type { IRequestUserManagerAssignment } from "@/services/user/assignment/type";

import useFormValue from "./useFormValue";

export interface IUserAssignmentManagerCreateFormProps {
  onSubmitUserManagerAssignment: (data: IRequestUserManagerAssignment) => void;
}

const UserAssignmentManagerCreateForm = ({ ...props }: IUserAssignmentManagerCreateFormProps) => {
  const { control, villages, isVillageEmpty, handleAddSelectedVillage, handleDeleteSelectedVillage, submitForm } =
    useFormValue({
      onSubmit: props.onSubmitUserManagerAssignment,
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
      <Flex flex={2} gap={4} mb={5}>
        <Controller
          control={control}
          name="fullname"
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
        {/* Email */}
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <InputContainer label="Alamat Email" flex={1}>
              <InputEmailOrPhone
                value={value}
                name="email"
                placeholder="Masukkan alamat email"
                onChange={onChange}
                error={error?.message}
                leftElement={<FaRegUser fontSize={20} />}
                leftElementStyle={{
                  top: 0,
                }}
              />
            </InputContainer>
          )}
        />
        <Controller
          control={control}
          name="phone_number"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <InputContainer label="Nomor HP" flex={1}>
              <InputEmailOrPhone
                value={value}
                name="email"
                placeholder="Masukkan nomor handphone"
                onChange={onChange}
                error={error?.message}
                leftElement={<FaRegUser fontSize={20} />}
                leftElementStyle={{
                  top: 0,
                }}
              />
            </InputContainer>
          )}
        />
      </Flex>
      <Flex flex={2} gap={4}>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <InputContainer label="Password" flex={1}>
              <InputPassword
                withShowHidePassword
                value={value}
                name="password"
                placeholder="Kata Sandi"
                onChange={onChange}
                error={error?.message}
              />
            </InputContainer>
          )}
        />
        {/* Confirm Password */}
        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <InputContainer label="Konfirmasi Password" flex={1}>
              <InputPassword
                withShowHidePassword
                value={value}
                name="password"
                placeholder="Kata Sandi"
                onChange={onChange}
                error={error?.message}
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

export default UserAssignmentManagerCreateForm;
