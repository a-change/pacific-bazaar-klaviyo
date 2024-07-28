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
import {SvgIcon, SvgIconProps} from '@mui/material';
import React from 'react';

const Instagram = (props: SvgIconProps) => {
  return (
    <SvgIcon {...props} viewBox='0 0 14 14'>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M7 3.81818C5.24273 3.81818 3.81818 5.24273 3.81818 7C3.81818 8.75727 5.24273 10.1818 7 10.1818C8.75727 10.1818 10.1818 8.75727 10.1818 7C10.1818 5.24273 8.75727 3.81818 7 3.81818ZM5.09091 7C5.09091 8.05436 5.94564 8.90909 7 8.90909C8.05436 8.90909 8.90909 8.05436 8.90909 7C8.90909 5.94564 8.05436 5.09091 7 5.09091C5.94564 5.09091 5.09091 5.94564 5.09091 7Z'
        fill='white'
      />
      <path
        d='M10.8182 2.54545C10.4667 2.54545 10.1818 2.83036 10.1818 3.18182C10.1818 3.53327 10.4667 3.81818 10.8182 3.81818C11.1696 3.81818 11.4545 3.53327 11.4545 3.18182C11.4545 2.83036 11.1696 2.54545 10.8182 2.54545Z'
        fill='white'
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M2.54545 0C1.13964 0 0 1.13964 0 2.54545V11.4545C0 12.8604 1.13964 14 2.54545 14H11.4545C12.8604 14 14 12.8604 14 11.4545V2.54545C14 1.13964 12.8604 0 11.4545 0H2.54545ZM11.4545 1.27273H2.54545C1.84255 1.27273 1.27273 1.84255 1.27273 2.54545V11.4545C1.27273 12.1575 1.84255 12.7273 2.54545 12.7273H11.4545C12.1575 12.7273 12.7273 12.1575 12.7273 11.4545V2.54545C12.7273 1.84255 12.1575 1.27273 11.4545 1.27273Z'
        fill='white'
      />
    </SvgIcon>
  );
};

export default Instagram;
