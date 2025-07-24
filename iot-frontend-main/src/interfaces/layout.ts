import type { IconType } from "react-icons";

export interface ISidebarMenuItem {
  label: string;
  path: string;
  icon: IconType;
  pathnames?: string[];
  iconSize?: number;
}

export interface ISidebarMenuList extends ISidebarMenuItem {
  subMenu?: ISidebarMenuItem[];
}

export type ISettingMenu = Omit<ISidebarMenuItem, "icon">;

export declare type IChartPeriod = "hour" | "day" | "hour-frequent" | "day-frequent" | "week" | "month" | "year";
export declare type IChartFrequent = "hour" | "day";
export declare type TimePeriod = "day" | "week" | "month" | "year";

export declare interface IBadgeStatus {
  1: "critical";
  2: "warning";
  3: "normal";
  4: "inactive";
}
