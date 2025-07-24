import type { TimePeriod } from "@/interfaces/layout";

export function isObjEmpty(obj: any) {
  return Object.values(obj).length === 0 && obj.constructor === Object;
}

export function abbreviateName(fullName: string) {
  if (!fullName) return "";
  const parts = fullName.split(" ");

  if (parts.length === 1) {
    return fullName; // Return the full name if only one part
  } else if (parts.length >= 2) {
    const firstName = parts[0];
    const lastInitial = parts[parts.length - 1].charAt(0);
    return `${firstName} ${lastInitial}`;
  }
  return fullName;
}

export function generatePositiveIntegers(length: number, min: number, max: number) {
  if (length <= 0 || min < 1 || max < min) {
    return []; // Invalid input, return an empty array
  }

  const result = [];
  for (let i = 0; i < length; i++) {
    const randomInteger = Math.floor(Math.random() * (max - min + 1)) + min;
    result.push(randomInteger);
  }

  return result;
}

export function isEmail(input: string) {
  const emailRegex = /^\S+@\S+\.\S+$/;
  return emailRegex.test(input);
}

export function isPhoneNumber(input: string) {
  const phoneRegex = /^(?:\+62|0)\d{9,11}$/;
  return phoneRegex.test(input);
}

export function getIdentifierType(input: string) {
  // TODO: still need to fix logic for email/phone regex checking
  const isUseEmail = isEmail(input);
  const isUsePhone = isPhoneNumber(input);
  let identifierType: null | "email" | "phone" = null;

  if (isUseEmail) {
    identifierType = "email";
  } else if (isUsePhone) {
    identifierType = "phone";
  } else {
    identifierType = null;
  }
  return identifierType;
}

export function getTimePeriodID(timeInEn: TimePeriod) {
  const time = {
    day: "hari",
    week: "minggu",
    month: "bulan",
    year: "tahun",
  };

  return time[timeInEn];
}

export function getIndonesianTimeDivision(time: string) {
  const gmt = time?.slice?.(-5);
  if (gmt === "08:00") {
    return "WITA";
  } else if (gmt === "09:00") {
    return "WIT";
  } else {
    return "WIB";
  }
}

export function convertDateFormatForInput(time: string) {
  // Parse the original date string
  const originalDate = new Date(time);

  // Extract components
  const year = originalDate.getFullYear();
  const month = String(originalDate.getMonth() + 1).padStart(2, "0");
  const day = String(originalDate.getDate()).padStart(2, "0");
  const hour = String(originalDate.getHours()).padStart(2, "0");
  const minute = String(originalDate.getMinutes()).padStart(2, "0");

  // Create the desired format
  return `${year}-${month}-${day}T${hour}:${minute}`;
}

export const localizeCharPeriod = {
  day: "Hari",
  week: "Minggu",
  month: "Bulan",
};
