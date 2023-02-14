import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import FeedbackDialog from "./FeedbackDialog";
import { AlertProps } from "@mui/material";
import Notification, { NotificationProps } from "../Notification";
import Translate, { translate } from "@theme/Translate";
import { FeedbackProps } from "@theme/Feedback";

const thumbsUpLabel = translate({
  id: "feedback.thumbsUp",
  message: "This page was helpful",
  description:
    'The description of the "thumbs up" icon which the user can click to share positive feedback',
});

const thumbsDownLabel = translate({
  id: "feedback.thumbsDown",
  message: "This page needs improvement",
  description:
    'The description of the "thumbs thumbs" icon which the user can click to share constructive feedback',
});

export default function Feedback({
  showLabel,
  jiraApiUrl,
  searchMeta,
  title,
  url,
  userInformation,
  possibleContacts,
}: FeedbackProps) {
  const [showingDialog, setShowingDialog] = useState(false);
  const [isPositive, setIsPositive] = useState<boolean | undefined>(undefined);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState(<></>);
  const [notificationSeverity, setNotificationSeverity] =
    useState<NotificationProps["severity"]>("info");

  function handleClose() {
    setIsPositive(undefined);
    setShowingDialog(false);
  }

  function handleOpen(positive: boolean) {
    setIsPositive(positive);
    setShowingDialog(true);
  }

  function showNotification(
    severity: AlertProps["severity"],
    message: JSX.Element
  ) {
    setNotificationSeverity(severity);
    setNotificationMessage(message);
    setNotificationOpen(true);
  }

  function handleCloseNotification(
    event: React.SyntheticEvent | Event,
    reason?: string
  ) {
    if (reason === "clickaway") {
      return;
    }

    setNotificationOpen(false);
  }

  return (
    <>
      <Stack direction="row" spacing={1} alignItems="center">
        {showLabel && (
          <Typography>
            <Translate id="feedback.helpful">Was this page helpful?</Translate>
          </Typography>
        )}
        <div className="feedbackThumbs">
          <IconButton
            onClick={() => {
              handleOpen(true);
            }}
            aria-label={thumbsUpLabel}
            className="feedbackButtonPositive"
          >
            <ThumbUpOffAltIcon />
          </IconButton>
          <IconButton
            onClick={() => {
              handleOpen(false);
            }}
            aria-label={thumbsDownLabel}
            className="feedbackButtonNegative"
          >
            <ThumbDownOffAltIcon />
          </IconButton>
        </div>
        <FeedbackDialog
          open={showingDialog}
          onClose={handleClose}
          positive={isPositive}
          jiraApiUrl={jiraApiUrl}
          searchMeta={searchMeta}
          title={title}
          url={url}
          userInformation={userInformation}
          showNotification={showNotification}
          possibleContacts={possibleContacts || "unknown"}
        />
      </Stack>
      <Notification
        message={notificationMessage}
        open={notificationOpen}
        onClose={handleCloseNotification}
        severity={notificationSeverity}
      />
    </>
  );
}
