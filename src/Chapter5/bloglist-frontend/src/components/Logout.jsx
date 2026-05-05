import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
const Logout = ({ onLogout }) => {
  const nav = useNavigate();
  useEffect(() => {
    onLogout();
    nav("/");
  }, []);
  return <></>;
};

export default Logout;
