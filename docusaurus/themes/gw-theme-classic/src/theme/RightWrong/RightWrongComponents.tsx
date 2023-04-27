import React from 'react';
import clsx from 'clsx';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import { IconButtonProps } from '@mui/material/IconButton';
import styles from './RightWrong.module.css';
import { RightWrongCardProps, RightWrongImageProps } from '@theme/RightWrong';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { translate } from '@theme/Translate';

const defaultPositiveTitle = translate({
  id: 'rightWrong.positiveTitle',
  message: 'Do',
});
const defaultNegativeTitle = translate({
  id: 'theme.rightWrong.negativeTitle',
  message: "Don't",
});

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
  const defaultTitle = right ? defaultPositiveTitle : defaultNegativeTitle;
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
