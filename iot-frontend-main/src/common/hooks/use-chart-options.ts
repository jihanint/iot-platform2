import { theme } from "@chakra-ui/react";
import type { ApexOptions } from "apexcharts";

import { poppins } from "@/configs/fonts";
import type { IChartPeriod } from "@/interfaces/layout";
import { dayjs } from "@/lib";
import { getIndonesianTimeDivision } from "@/utils/helper";

interface Params {
  chartPeriod: IChartPeriod;
  seriesData: any;
  configs?: any;
}

const useChartOptions = ({ chartPeriod, seriesData, configs }: Params) => {
  const options: ApexOptions = {
    ...configs,
    chart: {
      toolbar: { show: false },
      zoom: { enabled: false },
      foreColor: theme.colors.gray["500"],
      fontFamily: poppins.style.fontFamily,
      stacked: false,
    },
    grid: { show: true },
    tooltip: { enabled: true },
    stroke: { curve: "smooth" },
    dataLabels: {
      enabled: true,
      background: {
        enabled: true,
        foreColor: "#fff",
        borderWidth: 2,
        borderRadius: 10,
      },
      formatter: function (val) {
        const formattedVal = parseFloat(val as string);
        if (Number.isInteger(formattedVal)) {
          return val;
        }
        return parseFloat(val as string).toFixed(2);
      },
    },
    legend: {
      position: "top",
    },
    yaxis: {
      labels: {
        show: true,
        formatter: function (val) {
          return val.toFixed(0);
        },
      },
    },
    xaxis: {
      type: "category",
      categories: seriesData?.date,
      tooltip: { enabled: false },
      axisBorder: { color: 'theme.colors.gray["600"]' },
      axisTicks: { color: theme.colors.gray["600"] },
      labels: {
        formatter: function (val) {
          switch (chartPeriod) {
            case "day":
              return `${dayjs(val).format("hh:mm")} ${getIndonesianTimeDivision(val)}`;
            case "week":
              return `${dayjs(val).format("DD/MM/YYYY")}`;
            // return `Week - ${dayjs(val).week()}`;
            case "month":
              return `${dayjs(val).format("DD/MM/YYYY")}`;
            // return `${dayjs(val).format("MMMM	")}`;
            case "year":
              return `${dayjs(val).format("YYYY")}`;
            default:
              return `${dayjs(val).format("DD")}/${dayjs(val).format("MM")}`;
          }
        },
      },
    },
  };

  return {
    options,
  };
};

export default useChartOptions;
