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
import {
  Avatar,
  Card,
  CardContent,
  Chip,
  Grid,
  List,
  ListItem,
  ListItemText,
  Stack,
  styled,
  Typography,
} from '@mui/material';
//components
import {H3, H4} from '@/components/common/bazaar/Typography';
import {FlexBox} from '@/components/common/flex-box';
import {NavLink} from '@/components/common/nav-link';
//types
import {AuthorBioTemplateProps} from '@/components/author/AuthorBioComponentTypes';
import {ImageSizeEnum} from '@/utils/CommonEnums';
//functions
import {getImageVariantBySize} from '@/utils/ImageUtils';
//templates
import {AuthorBioSocialBar} from '@/components/author/templates/AuthorBioSocialBar';
import {remoteHtmlTags} from '@/utils/HtmlUtils';

//Custom styled components
const navLinkStyle = {
  cursor: 'pointer',
  transition: 'color 150ms ease-in-out',
  '&:hover': {color: 'primary.main'},
  '&:last-child': {marginRight: 0},
};

const AuthorBioNavLink = styled(NavLink)({...navLinkStyle});

const AuthorBioListItem = styled(ListItem)(({theme}) => ({
  ':hover': {backgroundColor: theme.palette.action.hover},
}));

export const AuthorBioDefault = (props: AuthorBioTemplateProps) => {
  const {authorBioContent} = props;
  const {fullName, images, role, accounts, info, articles} = authorBioContent;
  const {t} = useTranslation('common');
  const [html, setHtml] = useState('');
  const image = getImageVariantBySize(images, ImageSizeEnum.Thumbnail);

  useEffect(() => {
    setHtml(info);
  }, [info]);

  return (
    <Grid container spacing={2} sx={{
      marginTop: '16px',
    }}>
      <Grid item xs={3}>
        <Stack spacing={2}>
          <Card>
            <CardContent>
              <FlexBox
                flexDirection={'column'}
                alignItems={'center'}
                alignContent={'center'}
                justifyContent={'center'}
              >
                {image && <Avatar alt={fullName} src={image} sx={{width: 128, height: 128}} />}
                <Stack direction={'column'} spacing={2} alignItems={'center'}
                       alignContent={'center'}
                       justifyContent={'center'}>
                  <H4>{fullName}</H4>
                  <Chip label={role} />
                  <AuthorBioSocialBar authorBioContent={authorBioContent} />
                </Stack>
              </FlexBox>
            </CardContent>
          </Card>
        </Stack>
      </Grid>
      <Grid item xs={9}>
        <FlexBox flexDirection={'column'}>
          <H3>
            {t('hey-i-am', {name: fullName})}
          </H3>
          {html && <Typography dangerouslySetInnerHTML={{__html: html}} />}
          <H4>{t('articles-by-author')}</H4>
          <List>
            {articles?.map((article, key) => (
              <AuthorBioListItem disableGutters key={key}>
                <ListItemText
                  primary={<AuthorBioNavLink href={article.link.url ?? ''}>{article.title}</AuthorBioNavLink>}
                  secondary={<span dangerouslySetInnerHTML={{
                    __html: remoteHtmlTags(article.description),
                  }} />}
                />
              </AuthorBioListItem>
            ))}
          </List>
        </FlexBox>
      </Grid>
    </Grid>
  );
};
