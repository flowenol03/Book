export const isNonEmpty = (s) => typeof s === "string" && s.trim().length > 0;
export const isFourDigitYear = (y) => /^\d{4}$/.test(String(y));