export interface IHeaderTabsItem<TSelectedTabs> {
  value: TSelectedTabs;
  label: string;
}

export type THeaderTabs<TSelectedTabs> = IHeaderTabsItem<TSelectedTabs>[];

export type TManagerListTabs = "ASSIGNED_MANAGER" | "UNASSIGNED_MANAGER";
export type TSupervisorListTabs = "ASSIGNED_SUPERVISOR";
export type TDeviceLogTabs = "TELEMETRY_LOG" | "STATUS_LOG";

export const MANAGER_LIST_HEADER_TABS: THeaderTabs<TManagerListTabs> = [
  { value: "ASSIGNED_MANAGER", label: "Sudah Ditugaskan" },
  { value: "UNASSIGNED_MANAGER", label: "Belum Ditugaskan" },
];

export const SUUPERVISOR_LIST_HEADER_TABS: THeaderTabs<TSupervisorListTabs> = [
  { value: "ASSIGNED_SUPERVISOR", label: "Sudah Ditugaskan" },
  /* TODO: for future feature if use more tab */
];

export const DEVICE_LOG_HEADER_TABS: THeaderTabs<TDeviceLogTabs> = [
  { value: "TELEMETRY_LOG", label: "Telemetry Log" },
  { value: "STATUS_LOG", label: "Status Log" },
];
