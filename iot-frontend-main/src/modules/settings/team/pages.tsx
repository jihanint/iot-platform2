import { useEffect } from "react";

import { useLayoutState } from "@/common/hooks";

import BaseLayout from "../components/BaseLayout";

const MyTeam = () => {
  const { setBreadCrumb } = useLayoutState();
  useEffect(() => {
    setBreadCrumb("Pengaturan - Team");
  }, []);
  return <BaseLayout as="section">Team Saya</BaseLayout>;
};

export default MyTeam;
