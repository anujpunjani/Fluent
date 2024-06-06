import React from "react";
import styles from "./header.module.scss";

const Header = () => {
  return (
    <section className="section-wrapper h-[100vh] flex items-center justify-center">
      <div>
        <div className={styles.title}>Fluent</div>
        <div className="font-medium">
          <p className="text-center">
            An experiment programming language written in JavaScript
          </p>
          <div className={styles.buttons}>
            <button
              onClick={() =>
                document.getElementById("playground")?.scrollIntoView()
              }
              className={styles.button}
            >
              Playground
            </button>
            <button
              onClick={() =>
                window.open("https://github.com/anujpunjani/Fluent", "_blank")
              }
              className={styles.button}
            >
              View Source
            </button>
          </div>
          <p className="text-center">
            Made by{" "}
            <a
              href="https://github.com/anujpunjani/"
              target="_blank"
              className="hover:text-[var(--brand)] hover:underline"
            >
              @anujpunjani
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Header;
