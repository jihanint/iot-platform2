import { useEffect } from "react";

import { useLayoutState } from "@/common/hooks";

import BaseLayout from "../components/BaseLayout";

const MyPassword = () => {
  const { setBreadCrumb } = useLayoutState();
  useEffect(() => {
    setBreadCrumb("Pengaturan - Kata Sandi");
  }, []);
  return <BaseLayout as="section">Password Saya</BaseLayout>;
};

export default MyPassword;
