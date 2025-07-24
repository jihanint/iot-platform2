import { useEffect } from "react";

import { useLayoutState } from "@/common/hooks";

import BaseLayout from "../components/BaseLayout";
const MyDevice = () => {
  const { setBreadCrumb } = useLayoutState();
  useEffect(() => {
    setBreadCrumb("Pengaturan - Perangkat");
  }, []);
  return <BaseLayout as="section">Device Saya</BaseLayout>;
};

export default MyDevice;
