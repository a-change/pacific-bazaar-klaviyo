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
import {Box, BoxProps, styled} from '@mui/material';
import clsx from 'clsx';

const StyledBox = styled(Box, {
  shouldForwardProp: (props) => props !== 'textTransformStyle',
})<{
  textTransformStyle?: any;
  ellipsis?: any;
}>(({textTransformStyle, ellipsis}) => ({
  textTransform: textTransformStyle || 'none',
  whiteSpace: ellipsis ? 'nowrap' : 'normal',
  overflow: ellipsis ? 'hidden' : '',
  textOverflow: ellipsis ? 'ellipsis' : '',
}));

type Props = {
  ellipsis?: any;
  textTransform?:
    | 'none'
    | 'capitalize'
    | 'uppercase'
    | 'lowercase'
    | 'initial'
    | 'inherit';
};

export const H1: FC<BoxProps & Props> = ({
                                           children,
                                           className,
                                           ellipsis,
                                           textTransform,
                                           ...props
                                         }) => {
  return (
    <StyledBox
      textTransformStyle={textTransform}
      ellipsis={ellipsis ? 1 : undefined}
      className={clsx({[className || '']: true})}
      component='h1'
      mb={0}
      mt={0}
      fontSize='30px'
      fontWeight='700'
      lineHeight='1.5'
      {...props}
    >
      {children}
    </StyledBox>
  );
};

export const H2: FC<BoxProps & Props> = ({
                                           children,
                                           className,
                                           ellipsis,
                                           textTransform,
                                           ...props
                                         }) => {
  return (
    <StyledBox
      textTransformStyle={textTransform}
      ellipsis={ellipsis ? 1 : undefined}
      className={clsx({
        [className || '']: true,
      })}
      component='h2'
      mb={0}
      mt={0}
      fontSize='25px'
      fontWeight='700'
      lineHeight='1.5'
      {...props}
    >
      {children}
    </StyledBox>
  );
};

export const H3: FC<BoxProps & Props> = ({
                                           children,
                                           className,
                                           ellipsis,
                                           textTransform,
                                           ...props
                                         }) => {
  return (
    <StyledBox
      mb={0}
      mt={0}
      component='h3'
      fontSize='20px'
      fontWeight='700'
      lineHeight='1.5'
      ellipsis={ellipsis ? 1 : undefined}
      textTransformStyle={textTransform}
      className={clsx({[className || '']: true})}
      {...props}
    >
      {children}
    </StyledBox>
  );
};

export const H4: FC<BoxProps & Props> = ({
                                           children,
                                           className,
                                           ellipsis,
                                           textTransform,
                                           ...props
                                         }) => {
  return (
    <StyledBox
      mb={0}
      mt={0}
      component='h4'
      fontSize='17px'
      fontWeight='600'
      lineHeight='1.5'
      ellipsis={ellipsis ? 1 : undefined}
      textTransformStyle={textTransform}
      className={clsx({[className || '']: true})}
      {...props}
    >
      {children}
    </StyledBox>
  );
};

export const H5: FC<BoxProps & Props> = ({
                                           children,
                                           className,
                                           ellipsis,
                                           textTransform,
                                           ...props
                                         }) => {
  return (
    <StyledBox
      textTransformStyle={textTransform}
      ellipsis={ellipsis ? 1 : undefined}
      className={clsx({
        [className || '']: true,
      })}
      component='h5'
      mb={0}
      mt={0}
      fontSize='16px'
      fontWeight='600'
      lineHeight='1.5'
      {...props}
    >
      {children}
    </StyledBox>
  );
};

export const H6: FC<BoxProps & Props> = ({
                                           children,
                                           className,
                                           ellipsis,
                                           textTransform,
                                           ...props
                                         }) => {
  return (
    <StyledBox
      textTransformStyle={textTransform}
      ellipsis={ellipsis ? 1 : undefined}
      className={clsx({
        [className || '']: true,
      })}
      component='h6'
      mb={0}
      mt={0}
      fontSize='14px'
      fontWeight='600'
      lineHeight='1.5'
      {...props}
    >
      {children}
    </StyledBox>
  );
};

export const Paragraph: FC<BoxProps & Props> = ({
                                                  children,
                                                  className,
                                                  ellipsis,
                                                  textTransform,
                                                  ...props
                                                }) => {
  return (
    <StyledBox
      textTransformStyle={textTransform}
      ellipsis={ellipsis ? 1 : undefined}
      className={clsx({
        [className || '']: true,
      })}
      component='p'
      mb={0}
      mt={0}
      fontSize='14px'
      {...props}
    >
      {children}
    </StyledBox>
  );
};

export const Small: FC<BoxProps & Props> = ({
                                              children,
                                              className,
                                              ellipsis,
                                              textTransform,
                                              ...props
                                            }) => {
  return (
    <StyledBox
      textTransformStyle={textTransform}
      ellipsis={ellipsis ? 1 : undefined}
      className={clsx({
        [className || '']: true,
      })}
      component='small'
      fontSize='12px'
      lineHeight='1.5'
      {...props}
    >
      {children}
    </StyledBox>
  );
};

export const Span: FC<BoxProps & Props> = ({
                                             children,
                                             className,
                                             ellipsis,
                                             textTransform,
                                             ...props
                                           }) => {
  return (
    <StyledBox
      textTransformStyle={textTransform}
      ellipsis={ellipsis ? 1 : undefined}
      className={clsx({
        [className || '']: true,
      })}
      component='span'
      lineHeight='1.5'
      {...props}
    >
      {children}
    </StyledBox>
  );
};

export const Tiny: FC<BoxProps & Props> = ({
                                             children,
                                             className,
                                             ellipsis,
                                             textTransform,
                                             ...props
                                           }) => {
  return (
    <StyledBox
      textTransformStyle={textTransform}
      ellipsis={ellipsis ? 1 : undefined}
      className={clsx({
        [className || '']: true,
      })}
      component='small'
      fontSize='10px'
      lineHeight='1.5'
      {...props}
    >
      {children}
    </StyledBox>
  );
};
