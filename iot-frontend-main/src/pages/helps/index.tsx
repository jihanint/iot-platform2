import { useEffect } from "react";

import type { NextPage } from "next";
import { useRouter } from "next/router";

const HelpsPage: NextPage = () => {
  const { replace } = useRouter();
  useEffect(() => {
    replace("/helps/contact-us");
  }, []);
  return <></>;
};

export default HelpsPage;
