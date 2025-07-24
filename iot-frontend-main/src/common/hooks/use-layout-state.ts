import { useRecoilState } from "recoil";

import { BreadcrumbAtom, TopNavShadowAtom } from "@/atoms/PageAtom";

const useLayoutState = () => {
  const [breadCrumb, setBreadCrumb] = useRecoilState(BreadcrumbAtom);
  const [topNavShadow, setTopNavShadow] = useRecoilState(TopNavShadowAtom);

  return {
    breadCrumb,
    setBreadCrumb,
    topNavShadow,
    setTopNavShadow,
  };
};

export default useLayoutState;
