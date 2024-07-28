/*
 * Copyright 2023 Bloomreach (http://www.bloomreach.com)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {FC} from 'react';
import {Box, BoxProps, TextField, TextFieldProps} from '@mui/material';
import {Small} from './Typography';

type Props = TextFieldProps & BoxProps;

const BazaarTextField: FC<Props> = ({label, InputProps, ...props}) => {
  const boxProps: BoxProps = {};
  const textFieldProps: TextFieldProps = {};

  for (const key in props) {
    if (spacePropList.includes(key)) {
      boxProps[key] = props[key];
    } else textFieldProps[key] = props[key];
  }

  return (
    <Box {...boxProps}>
      {label && (
        <Small
          display='block'
          mb={1}
          textAlign='left'
          fontWeight='600'
          color='grey.700'
        >
          {label}
        </Small>
      )}

      <TextField
        InputProps={{
          ...InputProps,
          style: {...InputProps?.style, height: 44},
        }}
        {...textFieldProps}
      />
    </Box>
  );
};

const spacePropList = [
  'm',
  'mt',
  'mr',
  'mb',
  'ml',
  'mx',
  'my',
  'p',
  'pt',
  'pr',
  'pb',
  'pl',
  'px',
  'py',
  'margin',
  'marginTop',
  'marginRight',
  'marginBottom',
  'marginLeft',
  'marginX',
  'marginY',
  'padding',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
  'paddingX',
  'paddingY',
];

export default BazaarTextField;
