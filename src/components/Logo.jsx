import styles from "./Logo.module.css";

function Logo() {
  return (
    <div className={styles.logoContainer}>
      <img src="/logo-ct.png" alt="WorldWise logo" className={styles.logo} />
      <p>Medical Tracker</p>
    </div>
  );
}

export default Logo;
