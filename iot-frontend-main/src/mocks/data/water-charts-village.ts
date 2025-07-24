import { generatePositiveIntegers } from "@/utils/helper";

const dailyWaterUseResponse = {
  series: [
    {
      name: "Penggunaan Air",
      data: generatePositiveIntegers(7, 20, 200),
    },
  ],
  date: [
    "2023-09-01 23:07:11.097 +0700",
    "2023-09-02 23:07:11.097 +0700",
    "2023-09-03 23:07:11.097 +0700",
    "2023-09-04 23:07:11.097 +0700",
    "2023-09-05 23:07:11.097 +0700",
    "2023-09-06 23:07:11.097 +0700",
    "2023-09-07 23:07:11.097 +0700",
  ],
};

const weeklyWaterUseResponse = {
  series: [
    {
      name: "malaka",
      data: generatePositiveIntegers(7, 200, 500),
    },
  ],
  date: [
    "2023-01-01 23:07:11.097 +0700",
    "2023-02-02 23:07:11.097 +0700",
    "2023-03-03 23:07:11.097 +0700",
    "2023-04-04 23:07:11.097 +0700",
    "2023-05-05 23:07:11.097 +0700",
    "2023-06-06 23:07:11.097 +0700",
    "2023-07-07 23:07:11.097 +0700",
  ],
};

const monthlyWaterUseResponse = {
  series: [
    {
      name: "malaka",
      data: generatePositiveIntegers(7, 500, 900),
    },
  ],
  date: [
    "2023-01-01 23:07:11.097 +0700",
    "2023-02-02 23:07:11.097 +0700",
    "2023-03-03 23:07:11.097 +0700",
    "2023-04-04 23:07:11.097 +0700",
    "2023-05-05 23:07:11.097 +0700",
    "2023-06-06 23:07:11.097 +0700",
    "2023-07-07 23:07:11.097 +0700",
  ],
};

const yearlyWaterUseResponse = {
  series: [
    {
      name: "malaka",
      data: generatePositiveIntegers(7, 950, 2000),
    },
  ],
  date: [
    "2020-01-01 23:07:11.097 +0700",
    "2021-02-02 23:07:11.097 +0700",
    "2022-03-03 23:07:11.097 +0700",
    "2023-04-04 23:07:11.097 +0700",
    "2024-05-05 23:07:11.097 +0700",
    "2025-06-06 23:07:11.097 +0700",
    "2026-07-07 23:07:11.097 +0700",
  ],
};

export { dailyWaterUseResponse, weeklyWaterUseResponse, monthlyWaterUseResponse, yearlyWaterUseResponse };
