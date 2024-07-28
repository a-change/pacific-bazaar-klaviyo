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

const Youtube = (props: SvgIconProps) => {
  return (
    <SvgIcon {...props} viewBox='0 0 15 11'>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M2.25 1.5H12.75C13.1642 1.5 13.5 1.83579 13.5 2.25V8.25C13.5 8.66421 13.1642 9 12.75 9H2.25C1.83579 9 1.5 8.66421 1.5 8.25V2.25C1.5 1.83579 1.83579 1.5 2.25 1.5ZM0 2.25C0 1.00736 1.00736 0 2.25 0H12.75C13.9926 0 15 1.00736 15 2.25V8.25C15 9.49264 13.9926 10.5 12.75 10.5H2.25C1.00736 10.5 0 9.49264 0 8.25V2.25ZM6 3L9 5.25L6 7.5V3Z'
        fill='white'
      />
    </SvgIcon>
  );
};

export default Youtube;
