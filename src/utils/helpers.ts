import { AUSPOST_TRACKING_URL } from "@/configs/app.config";
import dayjs from "dayjs";

function fallbackCopyTextToClipboard(text: string) {
  const textArea = document.createElement("textarea");
  textArea.value = text;

  // Avoid scrolling to bottom
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const successful = document.execCommand("copy");
    const msg = successful ? "successful" : "unsuccessful";
    console.log("Fallback: Copying text command was " + msg);
  } catch (err) {
    console.error("Fallback: Oops, unable to copy", err);
  }

  document.body.removeChild(textArea);
}

export const copyToClipboard = (text: string) => {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);
    return;
  }
  navigator.clipboard.writeText(text);
};

export const debounce = (fn: Function, ms = 300) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
};

export const downloadFile = (file: Blob, filename: string) => {
  const href = URL.createObjectURL(file);

  // create "a" HTML element with href to file & click
  const link = document.createElement("a");
  link.href = href;
  link.setAttribute("download", filename); //or any other extension
  document.body.appendChild(link);
  // Dispatch click event on the link
  // This is necessary as link.click() does not work on the latest firefox
  link.dispatchEvent(
    new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      view: window,
    }),
  );

  // clean up "a" element & remove ObjectURL
  document.body.removeChild(link);
  URL.revokeObjectURL(href);
};

export const getTrackingUrl = (trackingNumber: string) => {
  return `${AUSPOST_TRACKING_URL}${trackingNumber}`;
};

export const convertFloatToInt = (value: number) => {
  return Math.round(value * 100);
};

export const convertIntToFloat = (value: number) => {
  return value / 100;
};

export function sortDatesByTime(datesArray: string[]): string[] {

  const dateObjects = datesArray.map(dateString => dayjs(dateString));

  const sortedDateObjects = dateObjects.sort((a, b) => a.diff(b));

  const sortedDateArray = sortedDateObjects.map(dateObject => dateObject.format('YYYY-MM-DD'));

  return sortedDateArray;
}

