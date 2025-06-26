
export function parseDuration(durationStr: string): number {
  const regex = /^(\d+)(ms|s|m|h)$/;
  const match = durationStr.match(regex);

  if (match === undefined) throw new Error("Need the right format");
  let millisecondstosecond = 1000; //1000ms for 1 second
  let convertedValue: number = 0;
  switch (match?.[2]) {
    case "ms":
      convertedValue = Number(match?.[1]);
      break;
    case "s":
      convertedValue = Number(match?.[1]) * millisecondstosecond;
      break;
    case "m":
      convertedValue = Number(match?.[1]) * 60 * millisecondstosecond;
      break;
    case "h":
      convertedValue = Number(match?.[1]) * 60 * 60 * millisecondstosecond;
      break;
  }

  return convertedValue;
}
