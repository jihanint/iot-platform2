import { AiOutlineSetting } from "react-icons/ai";
import { BiHelpCircle } from "react-icons/bi";
import { BsSoundwave } from "react-icons/bs";
import { FaUsersGear } from "react-icons/fa6";
import { GrHomeRounded } from "react-icons/gr";
import { RiUserLocationFill, RiUserSettingsFill } from "react-icons/ri";

import type { ISettingMenu, ISidebarMenuList } from "@/interfaces/layout";

export const ADMIN_MENU: ISidebarMenuList[] = [
  { label: "Dashboard", path: "/dashboard", icon: GrHomeRounded },
  {
    label: "Perangkat",
    path: "/devices",
    icon: BsSoundwave,
    subMenu: [
      { label: "List Perangkat", path: "/devices", icon: BsSoundwave },
      { label: "Kalibrasi Perangkat", path: "/devices/calibrate", icon: BsSoundwave },
      { label: "Log Perangkat", path: "/devices/log", icon: BsSoundwave },
    ],
  },
  {
    label: "Penugasan Pengguna",
    path: "/user-assignment",
    icon: FaUsersGear,
    subMenu: [
      { label: "Manajer", path: "/user/assignment/manager", icon: RiUserSettingsFill },
      { label: "Pengawas", path: "/user/assignment/supervisor", icon: RiUserLocationFill },
    ],
  },
  { label: "Pengaturan", path: "/settings/profile", icon: AiOutlineSetting },
  // { label: "Admin Page", path: "/admin", icon: MdAdminPanelSettings },
  { label: "Bantuan", path: "/helps/contact-us", icon: BiHelpCircle },
];

export const MANAGER_MENU: ISidebarMenuList[] = [
  { label: "Dashboard", path: "/dashboard", icon: GrHomeRounded },
  { label: "Perangkat", path: "/devices", icon: BsSoundwave },
  {
    label: "Penugasan Pengguna",
    path: "/user-assignment",
    icon: FaUsersGear,
    subMenu: [{ label: "Pengawas", path: "/user-assignment/supervisor", icon: RiUserLocationFill }],
  },
  { label: "Pengaturan", path: "/settings/profile", icon: AiOutlineSetting },
  // { label: "User Page", path: "/user", icon: MdOutlineSupervisedUserCircle },
  { label: "Bantuan", path: "/helps/contact-us", icon: BiHelpCircle },
];

export const settingMenu: ISettingMenu[] = [
  { label: "Data saya", path: "/settings/profile" },
  { label: "Kata sandi", path: "/settings/password" },
  { label: "Tim", path: "/settings/team" },
  { label: "Paket", path: "/settings/package" },
  { label: "Perangkat", path: "/settings/device" },
  { label: "Notifikasi", path: "/settings/notification" },
];
