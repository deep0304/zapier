export function parser(
  text: string,
  values: any,
  startDelimiter = "{",
  endDelimiter = "}"
) {
  let startIndex = 0;
  let endIndex = 1;
  let finalString = "";

  while (startIndex < text.length) {
    if (text[startIndex] === startDelimiter) {
      let endPoint = startIndex + 1;
      while (endPoint < text.length && text[endPoint] !== endDelimiter) {
        endPoint++;
      }

      const placeholder = text.slice(startIndex + 1, endPoint);
      const keys = placeholder.split(".");
      let value = values;

      for (const key of keys) {
        if (value.hasOwnProperty(key)) {
          value = value[key];
        } else {
          value = `{${placeholder}}`; // If the key doesn't exist, keep the placeholder
          break;
        }
      }

      finalString += value;
      startIndex = endPoint + 1;
    } else {
      finalString += text[startIndex];
      startIndex++;
    }
  }
  console.log(finalString);
  return finalString;
}
