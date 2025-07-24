import { atom } from "recoil";

import type { IUserAssignmentItem } from "@/services/user/assignment/type";

export const DetailManagerAtom = atom<IUserAssignmentItem>({
  key: "detail_manager",
  default: { user_id: 0, user_name: "", email: "", phone_number: "", villages: [], role: "MANAGER" },
});

export const ModalSearchVillageAtom = atom<boolean>({
  key: "modal_search_village",
  default: false,
});
