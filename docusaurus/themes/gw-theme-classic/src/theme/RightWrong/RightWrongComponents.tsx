import { translate } from '@doctools/components';
import useBaseUrl from '@docusaurus/useBaseUrl';
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import { IconButtonProps } from '@mui/material/IconButton';
import { RightWrongCardProps, RightWrongImageProps } from '@theme/RightWrong';
import clsx from 'clsx';
import React from 'react';
import styles from './RightWrong.module.css';

function RightWrongTitle({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

type RightWrongIconProps = {
  right?: boolean;
};

function RightWrongIcon({ right }: RightWrongIconProps) {
  const iconProps: IconButtonProps['sx'] = {
    color: 'white',
    fontSize: '1.5rem',
  };

  return (
    <span className={styles.iconWrapper}>
      {right ? <DoneIcon sx={iconProps} /> : <CloseIcon sx={iconProps} />}
    </span>
  );
}

type SectionProps = RightWrongCardProps & {
  right?: boolean;
};

export function Section({ title, children, right }: SectionProps) {
  const defaultTitle = right
    ? translate({
        id: 'rightWrong.positiveTitle',
        message: 'Do',
      })
    : translate({
        id: 'theme.rightWrong.negativeTitle',
        message: "Don't",
      });
  return (
    <div className={clsx(right ? styles.right : styles.wrong, styles.card)}>
      <div className={styles.cardTitle}>
        <RightWrongIcon right={right} />
        <RightWrongTitle>{title || defaultTitle}</RightWrongTitle>
      </div>
      <div>{children}</div>
    </div>
  );
}

type ImageProps = RightWrongImageProps & {
  right?: boolean;
};

export function ImageWrapper({
  caption,
  right,
  src,
  alt,
  wrapperStyle,
  ...imageProps
}: ImageProps) {
  const imageSrc = useBaseUrl(src);
  return (
    <div
      className={clsx(right ? styles.right : styles.wrong, styles.imageWrapper)}
      style={wrapperStyle}
    >
      <div>
        <img src={imageSrc} {...imageProps} alt={alt || ''} />
        <div className={styles.imageTitle}>
          <RightWrongIcon right={right} />
        </div>
      </div>
      <div className={styles.imageCaption}>{caption}</div>
    </div>
  );
}
