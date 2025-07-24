import { theme } from "@chakra-ui/react";
import type { ApexOptions } from "apexcharts";

import { poppins } from "@/configs/fonts";
import type { IChartPeriod } from "@/interfaces/layout";
import { dayjs } from "@/lib/dayjs";

import { getIndonesianTimeDivision } from "./helper";

interface Params {
  chartPeriod: IChartPeriod;
  seriesData: any;
  configs?: any;
  max?: number;
}

export const initWaterChartOptions = ({ chartPeriod, seriesData, configs, max }: Params) => {
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
        return parseFloat(val as string)
          .toFixed(2)
          .replace(".", ",");
      },
    },
    legend: {
      position: "top",
    },

    yaxis: {
      max: max,
      labels: {
        show: true,
        formatter: function (val) {
          const formattedVal = parseFloat(val.toString());
          if (Number.isInteger(formattedVal)) {
            return val;
          }
          return parseFloat(val.toString()).toFixed(3).replace(".", ",");
        },
      },
    },

    xaxis: {
      type: "category",
      categories: seriesData?.date,
      tooltip: { enabled: false },
      axisBorder: { color: theme.colors.gray["600"] },
      axisTicks: { color: theme.colors.gray["600"] },
      labels: {
        formatter: function (val) {
          switch (chartPeriod) {
            case "hour-frequent":
              return `${dayjs(val).format("HH:mm")} ${getIndonesianTimeDivision(val)}`;
            case "day":
              return `${dayjs(val).format("HH:mm")} ${getIndonesianTimeDivision(val)}`;
            case "day-frequent":
            case "week":
            case "month":
              return `${dayjs(val).format("DD/MM/YYYY")}`;
            // return `${dayjs(val).format("MMMM")}`;
            case "year":
              return `${dayjs(val).format("YYYY")}`;
            default:
              return `${dayjs(val).format("DD")}/${dayjs(val).format("MM")}`;
          }
        },
      },
    },
  };

  return options;
};
