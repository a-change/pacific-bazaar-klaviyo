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

//react
import {FC, ReactNode} from 'react';
//mui
import {Box, Breakpoint, Container} from '@mui/material';
//types
import {StylePropsType} from './PageContainers';

type ContainerWrapperProps = {
  name: string,
  style?: StylePropsType,
  height?: string | number,
  width?: string | number,
  maxWidth?: string,
  isPreview?: boolean,
  children: ReactNode
};

const PacificContainerWrapper: FC<ContainerWrapperProps> = (props): React.ReactElement => {
  const {name, style, height, width, maxWidth, isPreview, children} = props;

  return (
    <Box
      id={name.replace(/\s/g, '_')}
      bgcolor={style?.bgColor!!}
      border={style?.border || 0}
      borderColor={style?.borderColor!!}
      boxShadow={style?.elevation!!}
      color={style?.color!!}
      height={height || 'auto'}
      pt={style?.pt || 0}
      pl={style?.pl || 0}
      pr={style?.pr || 0}
      pb={style?.pb || 0}
      width={width || 'auto'}
      sx={{
        minHeight: isPreview ? 32 : 0,
        ':first-of-type': {
          pt: 0,
        },
      }}
    >
      <Container disableGutters maxWidth={(maxWidth ?? 'lg') as Breakpoint | false}>
        {children}
      </Container>
    </Box>
  );
};

export default PacificContainerWrapper;
