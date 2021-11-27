export const elipsis = (value: string, max = 40) =>
  value.substring(0, Math.min(max, value.length)) + "...";
