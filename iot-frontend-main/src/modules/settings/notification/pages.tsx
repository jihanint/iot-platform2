import { useEffect } from "react";

import { useLayoutState } from "@/common/hooks";

import BaseLayout from "../components/BaseLayout";
const MyNotification = () => {
  const { setBreadCrumb } = useLayoutState();
  useEffect(() => {
    setBreadCrumb("Pengaturan - Notifikasi");
  }, []);
  return <BaseLayout as="section">Notification Saya</BaseLayout>;
};

export default MyNotification;
