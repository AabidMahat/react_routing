import { useEffect } from "react";
import PropTypes from "prop-types";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Toastify({ type = "error", msg = "Invalid" }) {
  useEffect(() => {
    if (type === "error") {
      toast.error(msg, {
        style: {
          fontSize: "16px",
          textAlign: "center",
        },
      });
    } else if (type === "success") {
      toast.success(msg, {
        style: {
          fontSize: "16px",
          textAlign: "center",
        },
      });
    }
  }, [type, msg]);

  return (
    <ToastContainer
      position="bottom-center"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"
      transition:Bounce
    />
  );
}

Toastify.propTypes = {
  msg: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};
