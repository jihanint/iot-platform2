import { useEffect } from "react";

import type { NextPage } from "next";
import { useRouter } from "next/router";

const SettingsPage: NextPage = () => {
  const { replace } = useRouter();
  useEffect(() => {
    replace("/settings/profile");
  }, []);
  return <></>;
};

export default SettingsPage;
