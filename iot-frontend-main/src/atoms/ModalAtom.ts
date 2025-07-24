import { atom } from "recoil";

export const ModalDetailManagerAtom = atom<boolean>({
  key: "modal_detail_manager",
  default: false,
});

export const ModalSearchVillageAtom = atom<boolean>({
  key: "modal_search_village",
  default: false,
});
