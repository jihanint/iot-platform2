import React from "react";

import type { ActivityHistoryData, AlertType } from "@/interfaces/activity";

import PumpHistory from "./PumpHistory";
import WaterHistory from "./WaterHistory";

interface ActivityHistoryBoxProps {
  type?: AlertType;
  isLast?: boolean;
  histData: ActivityHistoryData;
}

const ActivityHistoryBox = ({ isLast, histData, type }: ActivityHistoryBoxProps) => {
  console.log({ histData });
  if (type === "device") {
    return <PumpHistory histData={histData} isLast={isLast} />;
  } else if (type === "alert") {
    return <WaterHistory histData={histData} isLast={isLast} />;
  }
  return <></>;
};

export default ActivityHistoryBox;
