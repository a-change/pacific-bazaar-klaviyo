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

import {styled} from '@mui/material';
import {H1, H4, Paragraph} from '@/components/common/bazaar/Typography';

type SizeProp = {
  size?: 'small' | 'large' | 'medium' | 'normal';
};

export const BannerH1Link = styled(H1, {
  shouldForwardProp: (prop) =>
    prop !== 'size',
})<SizeProp>(({theme, size}) => {
  const factor = size === 'large' ? 2 : 1;
  return {
    fontSize: 24 * factor,
    'a:hover': {
      color: theme.palette.primary.main,
      textDecoration: 'underline',
    },
    [theme.breakpoints.down('md')]: {
      fontSize: 24 * factor,
    },
  };
});

export const BannerH4 = styled(H4, {
  shouldForwardProp: (prop) =>
    prop !== 'size',
})<SizeProp>(({theme, size}) => {
  const factor = size === 'large' ? 2 : 1;
  return {
    fontSize: 18 * factor,
    marginTop: 8,
    marginBottom: 8,
    lineHeight: 1,
    [theme.breakpoints.down('md')]: {
      fontSize: 14 * factor,
    },
  };
});

export const BannerParagraph = styled(Paragraph, {
  shouldForwardProp: (prop) =>
    prop !== 'size',
})<SizeProp>(({theme, size}) => {
  const factor = size === 'large' ? 2 : 1;
  return {
    fontSize: 18 * factor,
    marginTop: 8,
    marginBottom: 8,
    [theme.breakpoints.down('md')]: {
      fontSize: 14 * factor,
    },
  };
});