import React from "react";
import styles from "./sectionheader.module.scss";

const SectionHeader = ({ title, direction = "right" }) => {
  return (
    <div
      className={styles.sectionHeader}
      style={{ flexDirection: direction === "right" ? "row" : "row-reverse" }}
    >
      <div className={styles.line} />
      <h3>
        <span className={styles.title}>
          {title}
          <span>.</span>
        </span>
      </h3>
    </div>
  );
};

export default SectionHeader;
