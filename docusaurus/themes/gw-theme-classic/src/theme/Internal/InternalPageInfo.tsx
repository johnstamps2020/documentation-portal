import { Translate } from '@doctools/components';
import useIsBrowser from '@docusaurus/useIsBrowser';
import { useDocContext } from '@theme/DocContext';
import LogInButton from '@theme/LogInButton';
import styles from './Internal.module.css';
import InfoImage from './undraw_personal_info_re_ur1n.svg';

export default function InternalPageInfo() {
  const { userInformation } = useDocContext();
  const isBrowser = useIsBrowser();

  if (!userInformation) {
    return null;
  }

  const defaultMessage = 'Hi,%0A%0APlease help me access this page. Thank you!';
  const emailBody = isBrowser
    ? `${defaultMessage}%0A%0A${
        document.querySelector('title').textContent
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
      <div>
        <Translate id="internal.info.toView">
          To view this page, you must log in with your Guidewire employee
          account. If you need further help, please contact your Guidewire
          representative.
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
