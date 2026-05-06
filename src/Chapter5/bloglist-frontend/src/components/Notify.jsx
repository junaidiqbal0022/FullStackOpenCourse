import { Alert } from "@mui/material";
import { useEffect } from "react";
const Notify = ({ notification, setNotification }) => {
  const msg = notification?.msg;
  const severity = notification?.severity || "success";
  const autoClear = notification?.autoClear ?? true;
  //console.log(`received msg:${msg}, color:${color}`)
  if (!msg || typeof msg !== "string" || msg.trim() === "") {
    return null;
  }
  useEffect(() => {
    if (!msg || typeof msg !== "string" || msg.trim() === "") {
      return;
    }
    if (!autoClear) {
      return;
    }
    const timer = setTimeout(() => {
      setNotification({ msg: "", severity: "success" });
    }, 5000);
    return () => clearTimeout(timer);
  }, [notification, setNotification]);
  return (
    <Alert style={{ marginTop: 20 }} severity={severity}>
      {msg}
    </Alert>
  );
};

export default Notify;
