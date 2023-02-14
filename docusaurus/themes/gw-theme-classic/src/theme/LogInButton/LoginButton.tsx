import React from "react";
import { useDocContext } from "@theme/DocContext";
import styles from "./LoginButton.module.css";
import Translate from "@theme/Translate";
import clsx from "clsx";

export default function LogInButton({ dark }) {
  const isLoggedIn = useDocContext().userInformation?.isLoggedIn;
  const buttonClass = clsx(dark ? styles.darkButton : styles.whiteButton);

  if (isLoggedIn) {
    return (
      <a href="/gw-logout" role="button" className={buttonClass}>
        <Translate id="loginButton.out">Log out</Translate>
      </a>
    );
  }

  return (
    <a href="/gw-login" role="button" className={buttonClass}>
      <Translate id="loginButton.in">Log in</Translate>
    </a>
  );
}
