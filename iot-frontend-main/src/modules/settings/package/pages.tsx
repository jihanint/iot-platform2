import { useEffect } from "react";

import { useLayoutState } from "@/common/hooks";

import BaseLayout from "../components/BaseLayout";
const MyPackage = () => {
  const { setBreadCrumb } = useLayoutState();
  useEffect(() => {
    setBreadCrumb("Pengaturan - Paket");
  }, []);
  return <BaseLayout as="section">Package Saya</BaseLayout>;
};

export default MyPackage;
