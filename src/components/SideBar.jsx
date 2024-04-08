import { Outlet } from "react-router-dom";
import Logo from "./Logo";
import styles from "./Sidebar.module.css";
import AppNav from "./AppNav";

function Sidebar() {
  return (
    <>
      <div className={styles.sidebar}>
        <Logo />
        {/* <AppNav /> */}
        {/* // ? it is used to display the children */}
        <Outlet />
      </div>
    </>
  );
}

export default Sidebar;
