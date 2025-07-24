import { useEffect, useState } from "react";

import { debounce } from "lodash";

import useFetchVillageData from "@/pages/user/assignment/useFetchVillageData";

export default function useSearchVillage() {
  const { handleChangeFetch, villageList } = useFetchVillageData();

  const [keyword, setKeyword] = useState<string | undefined>(undefined);

  const handleInputChange = debounce(() => {
    handleChangeFetch({
      search: keyword,
    });
  }, 500);

  useEffect(() => {
    handleInputChange();
    return handleInputChange.cancel;
  }, [keyword]);

  const handleSetKeyword = (search: string) => {
    setKeyword(search);
  };

  const handleResetKeyword = () => {
    setKeyword(undefined);
  };

  return {
    villageList: villageList || [],
    handleSetKeyword,
    handleResetKeyword,
  };
}
