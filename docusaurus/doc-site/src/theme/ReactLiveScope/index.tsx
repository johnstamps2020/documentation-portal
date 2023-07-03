import React from 'react';
import {
  RightWrong,
  Right,
  Wrong,
  RightImage,
  WrongImage,
  RightWrongImages,
} from '@theme/RightWrong';
import Internal from '@theme/Internal';
import Collapsible from '@theme/Collapsible';

const ReactLiveScope = {
  React,
  ...React,
  RightWrong,
  Right,
  Wrong,
  RightWrongImages,
  RightImage,
  WrongImage,
  Internal,
  Collapsible,
};
export default ReactLiveScope;
