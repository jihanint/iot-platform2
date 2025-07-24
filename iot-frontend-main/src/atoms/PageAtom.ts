import { atom } from "recoil";

export const BreadcrumbAtom = atom<string>({
  key: "bread_crumb",
  default: "",
});

export const TopNavShadowAtom = atom<string>({
  key: "top_nav_shadow",
  default: "lg",
});
