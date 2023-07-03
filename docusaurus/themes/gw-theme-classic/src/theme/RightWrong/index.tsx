import React from 'react';
import styles from './RightWrong.module.css';
import {
  RightWrongCardProps,
  RightWrongImageProps,
  RightWrongProps,
} from '@theme/RightWrong';
import { Section, ImageWrapper } from './RightWrongComponents';

export function Right(props: RightWrongCardProps) {
  return <Section {...props} right />;
}

export function Wrong(props: RightWrongCardProps) {
  return <Section {...props} />;
}

export function RightImage(props: RightWrongImageProps) {
  return <ImageWrapper {...props} right />;
}
export function WrongImage(props: RightWrongImageProps) {
  return <ImageWrapper {...props} />;
}

export function RightWrong({ children }: RightWrongProps) {
  return <div className={styles.wrapper}>{children}</div>;
}

export function RightWrongImages({ children }: RightWrongProps) {
  return <div className={styles.imagesWrapper}>{children}</div>;
}
