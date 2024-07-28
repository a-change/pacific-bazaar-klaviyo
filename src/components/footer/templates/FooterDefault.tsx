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
import {Breakpoint, useTheme} from '@mui/material/styles';
import {Grid} from '@mui/material';
//Bloomreach sdks
import {BrProps} from '@bloomreach/react-sdk';
//hooks
import useSettings from '@/hooks/useSettings';
//components
import {JustifiedFlexContainer} from '@/components/common/flex-box';
import {SimpleContentComponent} from '@/components/simple-content/SimpleContentComponent';
import {Logo} from '@/components/common/logo/Logo';
import {MenuComponent} from '@/components/menu/MenuComponent';
import {AuthorBioComponent} from '@/components/author/AuthorBioComponent';
import {HelperComponent} from '@/components/helper/HelperComponent';
//types
import {FooterTemplateProps} from '@/components/footer/FooterComponentTypes';

export const FooterDefault = (props: BrProps & FooterTemplateProps) => {
  const {page, component, footerParams, footerContent} = props;

  const {template, backgroundColor} = footerParams;
  const {contact, sitemap, copyright, social, visitor} = footerContent;

  const theme = useTheme();
  const {settings} = useSettings();
  const footer = settings.layouts.footer;

  return (
    <JustifiedFlexContainer maxWidth={footer.maxWidth as Breakpoint}>
      <Grid container spacing={3}>
        <Grid item lg={3} md={3} sm={12} xs={12} order={{xs: 3, md: 1}} sx={{
          display: 'flex',
          [theme.breakpoints.down('md')]: {
            justifyContent: 'center',
          },
        }}>
          <Logo {...{page, component}} />
        </Grid>
        <Grid item lg={6} md={6} sm={12} xs={12} order={{xs: 1, md: 2}} sx={{
          display: 'flex',
          justifyContent: 'center',
        }}>
          {sitemap && <MenuComponent documentRef={sitemap} params={{
            template: 'multi-column-vertical',
          }} {...{page, component}} disableWrapper />}
        </Grid>
        <Grid item lg={3} md={3} sm={12} xs={12} order={{xs: 2, md: 3}} sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          [theme.breakpoints.down('md')]: {
            justifyContent: 'center',
          },
        }}>
          {contact && <SimpleContentComponent documentRef={contact} params={{
            template: 'footer',
          }} {...{page, component}} />}
        </Grid>
        <Grid item lg={9} md={9} sm={12} xs={12} order={{xs: 4}} sx={{
          display: 'flex',
          [theme.breakpoints.down('md')]: {
            justifyContent: 'center',
          },
        }}>
          {copyright && <SimpleContentComponent documentRef={copyright} params={{
            template: 'default',
          }} {...{page, component}} />}
        </Grid>
        <Grid item lg={3} md={3} sm={12} xs={12} order={{xs: 6}} sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          [theme.breakpoints.down('md')]: {
            justifyContent: 'center',
          },
        }}>
          {social && <AuthorBioComponent documentRef={social} params={{
            template: 'social-bar',
          }}  {...{page, component}} />}
        </Grid>
      </Grid>
      <HelperComponent {...{page, component, visitor}} />
    </JustifiedFlexContainer>
  );
};