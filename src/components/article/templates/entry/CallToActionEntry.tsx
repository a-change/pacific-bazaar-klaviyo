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
import {Box, Grid, List, ListItem, ListItemButton, ListItemText} from '@mui/material';
//components
import {H6} from '@/components/common/bazaar/Typography';
//types
import {ImageSizeEnum} from '@/utils/CommonEnums';
import {CallToActionEntryProps} from '../../ArticleComponentTypes';
//functions
import {getImageVariantBySize} from '@/utils/ImageUtils';

export const CallToActionEntry = (props: CallToActionEntryProps) => {
  const {title, description, images, internalLink, externalLink} = props;
  const image = getImageVariantBySize(images, ImageSizeEnum.Large);
  return (
    <Grid container>
      <Grid item xs={12} md={8}>
        <Box>{title}</Box>
        <H6 dangerouslySetInnerHTML={{__html: description}} />
        <H6>Links</H6>
        <List>
          {externalLink &&
            <ListItem disablePadding>
              <ListItemButton component='a' href='externalLink.url' target='_blank'>
                <ListItemText primary={externalLink.label} />
              </ListItemButton>
            </ListItem>}
          {internalLink &&
            <ListItem disablePadding>
              <ListItemButton component='a' href='internalLink.url' target='_self'>
                <ListItemText primary={internalLink.label} />
              </ListItemButton>
            </ListItem>}
        </List>
      </Grid>
      <Grid item xs={12} md={4}>
        {image && <img src={image} alt='Call to Action' />}
      </Grid>
    </Grid>
  );
};
