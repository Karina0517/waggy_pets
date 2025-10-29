import styles from "./Background.module.css";

export default function Background() {
  return (
    <>
      <div className={styles.background}></div>
      <img src="/images/background.png" alt="Decoración superior" className={styles.imageTop} />
      <img src="/images/background.png" alt="Decoración inferior" className={styles.imageBottom} />
    </>
  );
}
