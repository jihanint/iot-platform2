import { useEffect, useState } from "react";

import type { IGetVillageListParams } from "@/services/region/village/type";
import useVillageQuery from "@/services/region/village/useVillageQuery";

export default function useFetchVillageData() {
  const [dataFetch, setDataFetch] = useState<IGetVillageListParams>({
    search: undefined,
  });

  const { refetchVillageList, villageList } = useVillageQuery({ ...dataFetch });

  const handleChangeFetch = (data: IGetVillageListParams) => {
    setDataFetch(data);
  };

  useEffect(() => {
    if (dataFetch.search) {
      refetchVillageList();
    }
  }, [dataFetch.search]);

  return {
    villageList,
    handleChangeFetch,
    refetchVillageList,
  };
}
