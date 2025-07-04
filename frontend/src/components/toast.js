import { toast } from "react-toastify";

export const prikaziToast = (poruka, uspesno) => {
  if (uspesno) {
    toast.success(poruka, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      style: {
      minWidth: "300px",
      fontSize: "16px",
      lineHeight: "1.5",
      whiteSpace: "pre-line", // omogucava bolji prikaz ako ima više linija
    }
    });
  } else {
    toast.error(poruka, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      style: {
      minWidth: "300px",
      fontSize: "16px",
      lineHeight: "1.5",
      whiteSpace: "pre-line", // omogucava bolji prikaz ako ima više linija
    }
    });
  }
};
