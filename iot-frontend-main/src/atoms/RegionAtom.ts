import { atom } from "recoil";

export const RegionSelectorAtom = atom<"all" | number>({
  key: "selected_region",
  default: "all",
});
