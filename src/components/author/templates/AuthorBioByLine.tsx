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
import React, {useEffect, useState} from 'react';
//next
import {useTranslation} from 'next-i18next';
//mui
import {Avatar, Box, Stack, styled, Typography} from '@mui/material';
//components
import {H3} from '@/components/common/bazaar/Typography';
import {NavLink} from '@/components/common/nav-link';
//types
import {AuthorBioTemplateProps} from '@/components/author/AuthorBioComponentTypes';
import {ImageSizeEnum} from '@/utils/CommonEnums';
//functions
import {getImageVariantBySize} from '@/utils/ImageUtils';

//Custom styled components
const navLinkStyle = {
  cursor: 'pointer',
  transition: 'color 150ms ease-in-out',
  '&:hover': {color: 'primary.main'},
  '&:last-child': {marginRight: 0},
};

const AuthorBioNavLink = styled(NavLink)({...navLinkStyle});

export const AuthorBioByLine = (props: AuthorBioTemplateProps) => {
  const {authorBioContent: {fullName, images, role, link, info}} = props;
  const {t} = useTranslation('common');
  const image = getImageVariantBySize(images, ImageSizeEnum.Thumbnail);
  const [html, setHtml] = useState('');

  useEffect(() => {
    setHtml(info);
  }, [info]);

  return (
    <Stack direction={'row'} spacing={2} sx={{marginTop: '0.5rem'}}>
      {image && <Avatar alt={fullName} src={image} sx={{width: 96, height: 96}} />}
      <Box>
        <H3>
          <AuthorBioNavLink href={link?.url ?? ''}>{fullName}</AuthorBioNavLink>
        </H3>
        <Typography>{role}</Typography>
        <Typography dangerouslySetInnerHTML={{
          __html: html,
        }} sx={{
          fontStyle: 'italic',
        }} />
      </Box>
    </Stack>
  );
};
