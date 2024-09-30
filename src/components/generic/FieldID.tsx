import { IFormBuilderFieldCommonProps } from '../FormBuilder/types';
import React, { useEffect } from 'react';

import { v4 } from 'uuid';

interface IFieldIDConfig {
  prefix?: string;
}

interface IFieldIDProps
  extends IFormBuilderFieldCommonProps<IFieldIDConfig, string> {}
export const FieldID: React.FC<IFieldIDProps> = (props) => {
  useEffect(() => {
    if (!props.value) {
      props.onChange(`${props.config.prefix}${v4()}`);
    }
  }, []);
  return <></>;
};
