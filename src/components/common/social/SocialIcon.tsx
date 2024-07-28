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
import React from 'react';
//mui
import Instagram from '@/components/common/icons/Instagram';
import Twitter from '@/components/common/icons/Twitter';
import Youtube from '@/components/common/icons/Youtube';
import Facebook from '@/components/common/icons/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import Google from '@/components/common/icons/Google';
import {GitHub} from '@mui/icons-material';
//types
import {SocialAccount} from '@/components/author/AuthorBioComponentTypes';

export const SocialIcon = (props: SocialAccount) => {
  const {type} = props;
  switch (type) {
    case 'instagram':
      return <Instagram fontSize='inherit' />;
    case 'twitter':
      return <Twitter fontSize='inherit' />;
    case 'youtube':
      return <Youtube fontSize='inherit' />;
    case 'facebook':
      return <Facebook fontSize='inherit' />;
    case 'github':
      return <GitHub fontSize='inherit' />;
    case 'linkedin':
      return <LinkedInIcon fontSize='inherit' />;
    case 'google':
    default:
      return <Google fontSize='inherit' />;
  }
};