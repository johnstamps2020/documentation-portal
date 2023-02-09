import React from "react";
import ReactPlayerLoader from "@brightcove/react-player-loader";
import styles from "./BrightcoveVideo.module.css";

type BrightcoveVideoProps = {
  videoId: string;
};

export default function BrightcoveVideo({ videoId }: BrightcoveVideoProps) {
  return (
    <ReactPlayerLoader
      accountId="929656735001"
      videoId={videoId}
      embedOptions={{
        responsive: true,
      }}
      attrs={{
        className: styles.wrapper,
      }}
    />
  );
}
