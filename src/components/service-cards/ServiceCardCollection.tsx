import {BrProps} from '@bloomreach/react-sdk';
import {Page, Reference} from '@bloomreach/spa-sdk';
import {Box, Container, Grid, styled} from '@mui/material';
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

import {FashionCard} from './FashionCard';
import {CollectionItem, ContentItem} from '@/utils/CommonTypes';
import {getCollectionItems} from '@/utils/CommonUtils';

//Custom styled components
const StyledFlexBox1 = styled(Box)(({theme}) => ({
  display: 'flex',
  padding: '2rem 0',
  boxShadow: theme.shadows[2],
  justifyContent: 'space-evenly',
  // gridTemplateColumns: "repeat(4, 1fr)",
  backgroundColor: theme.palette.common.white,
  position: 'relative',
  [theme.breakpoints.down('md')]: {
    gap: 30,
    // gridTemplateColumns: "repeat(2, 1fr)",
  },
  [theme.breakpoints.down('sm')]: {
    gap: 30,
    paddingLeft: '2rem',
    paddingRight: '2rem',
    // gridTemplateColumns: "1fr",
  },
}));

// custom styled components
const StyledFlexBox2 = styled(Box)(({theme}) => ({
  display: 'flex',
  padding: '2rem 0',
  // gridTemplateColumns: "repeat(4, 1fr)",
  borderTop: `1px solid ${theme.palette.grey[300]}`,
  borderBottom: `1px solid ${theme.palette.grey[300]}`,
  position: 'relative',
  justifyContent: 'space-evenly',
  [theme.breakpoints.down('md')]: {
    gap: 30,
    // gridTemplateColumns: "repeat(2, 1fr)",
  },
  [theme.breakpoints.down('sm')]: {
    gap: 30,
    paddingLeft: '2rem',
    paddingRight: '2rem',
    // gridTemplateColumns: "1fr",
  },
}));

const StyledFlexBox3 = styled(Box)(({theme}) => ({
  display: 'flex',
  padding: '2rem 0',
  // gridTemplateColumns: "repeat(4, 1fr)",
  backgroundColor: theme.palette.common.white,
  position: 'relative',
  justifyContent: 'space-evenly',
  [theme.breakpoints.down('md')]: {
    gap: 30,
    // gridTemplateColumns: "repeat(2, 1fr)",
  },
  [theme.breakpoints.down('sm')]: {
    gap: 30,
    paddingLeft: '2rem',
    paddingRight: '2rem',
    // gridTemplateColumns: "1fr",
  },
}));


export const ServiceCardCollection: FC<BrProps> = (props: BrProps) => {
  const {page, component} = props;
  const params = component.getParameters();
  const template: string = params.template;
  const models = component.getModels();
  const paramsFilters = ['textAlignment#', 'textColor#', 'template'];

  const items: CollectionItem[] = getCollectionItems(page, models, params, paramsFilters);

  return (
    <>
      {template === 'fashionservices1' &&
        <Container sx={{mt: '4rem'}}>
          <StyledFlexBox1>
            {items.map((item, key) => (
              <FashionCard key={key} {...item} />
            ))}
          </StyledFlexBox1>
        </Container>
      }

      {/* {template === 'fashionservices2' &&
      <Container sx={{ mt: 8 }}>
        <StyledFlexBox2>
        {banners.map((banner, key) => (
          <BannerComponent key={key}
            {...{page, component}}
            {...banner}
            disableWrapper
          />
        ))}
        </StyledFlexBox2>
      </Container>
    }

    {template === 'giftservices' && 
      <Container>
        <Grid container spacing={3} alignItems={'stretch'}>
        {banners.map((banner, key) => (
          <Grid item md={4} sm={6} xs={12} key={key}>
            <BannerComponent
            {...{page, component}}
            {...banner}
            disableWrapper
          />
          </Grid>
        ))}
        </Grid>
      </Container>
    }

    {template === 'groceryservices' && 
      <Container sx={{ pt: 12, pb: 8 }}>
        <Grid container spacing={3}>
        {banners.map((banner, key) => (
          <Grid item lg={3} md={6} sm={6} xs={12} key={key}>
            <BannerComponent key={key}
              {...{page, component}}
              {...banner}
              disableWrapper
            />
          </Grid>
        ))}
        </Grid>
      </Container>    
    }

    {template === 'marketservices' &&
      <Container sx={{ mt: "2rem" }}>
        <StyledFlexBox3>
        {banners.map((banner, key) => (
          <BannerComponent key={key}
            {...{page, component}}
            {...banner}
            disableWrapper
          />
        ))}
        </StyledFlexBox3>
      </Container>
    } */}
    </>
  );
};

