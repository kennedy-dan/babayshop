import { toast } from "react-toastify";

export function customSelectStyles(args: {
  height: Object;
  borderRadius: Object;
}) {
  const { height = 40, borderRadius = 0 } = args || {};
  return {
    control: () => ({
      display: "flex",
      border: "1px solid #ccc",
      height,
      borderRadius,
    }),
    menuList: (provided: Object) => ({
      ...provided,
      textTransform: "capitalize",
    }),
    input: (provided: Object) => ({
      ...provided,
      margin: 0,
    }),
    singleValue: (provided: Object) => ({
      ...provided,
      textTransform: "capitalize",
      margin: 0,
    }),
    multiValue: (provided: Object) => ({
      ...provided,
      textTransform: "capitalize",
    }),
    menu: (provided: Object) => ({
      ...provided,
      fontSize: 13,
    }),
    valueContainer: (provided: Object) => ({
      ...provided,
      fontSize: 13,
      padding: "0 10px",
      overflowY: "auto",
    }),
  };
}

export function capitalizeFirstLetter(string = "") {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function notify(
  message: string,
  status: "warning" | "success" | "error" | "info",
  toastId?: string
) {
  if (status === "success")
    toast.success(capitalizeFirstLetter(message), {
      toastId: toastId || encodeURI(message),
    });
  if (status === "error")
    toast.error(capitalizeFirstLetter(message), {
      toastId: toastId || encodeURI(message),
    });
  if (status === "info")
    toast.info(capitalizeFirstLetter(message), {
      toastId: toastId || encodeURI(message),
    });
  if (status === "warning")
    toast.warning(capitalizeFirstLetter(message), {
      toastId: toastId || encodeURI(message),
    });
}

export function formatDate(utc: string) {
  return new Date(utc).toLocaleString("en-GB", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
