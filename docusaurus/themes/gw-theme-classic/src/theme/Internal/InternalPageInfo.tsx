import React from "react";
import { useDocContext } from "@theme/DocContext";
import InfoImage from "./undraw_personal_info_re_ur1n.svg";
import Translate from "@theme/Translate";
import styles from "./Internal.module.css";
import LogInButton from "@theme/LogInButton";
import useIsBrowser from "@docusaurus/useIsBrowser";

export default function InternalPageInfo() {
  const { userInformation } = useDocContext();
  const isBrowser = useIsBrowser();

  if (!userInformation) {
    return null;
  }

  const defaultMessage = "Hi,%0A%0APlease help me access this page. Thank you!";
  const emailBody = isBrowser
    ? `${defaultMessage}%0A%0A${
        document.querySelector("title").textContent
      }%0A%0A${window.location.href}`
    : defaultMessage;

  return (
    <div className={styles.info} role="alert">
      <InfoImage width="100%" />
      <h2>
        <Translate id="internal.employeesOnly">
          This content is available to Guidewire employees only
        </Translate>
      </h2>
      {userInformation?.isLoggedIn && (
        <div>
          <Translate
            id="internal.noAccess"
            values={{
              name: <strong>{userInformation.name || "Name Unknown"}</strong>,
              email: userInformation.preferred_username,
            }}
          >
            {
              "You are logged in as {name} ({email}) and you do not have access."
            }
          </Translate>
        </div>
      )}
      <div>
        <Translate id="internal.info.toView">
          To view this page, you must log in with your Guidewire employee
          account. If you need further help, please contact the Jutro Design
          System team.
        </Translate>
      </div>
      <div className={styles.buttons}>
        <LogInButton dark />
        <a
          href={`mailto:feedback-jutro@guidewire.com?subject=Access%20to%20internal%20content&body=${emailBody}`}
        >
          Contact us
        </a>
      </div>
    </div>
  );
}
