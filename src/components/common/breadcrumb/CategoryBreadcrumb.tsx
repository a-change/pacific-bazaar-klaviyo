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
import React, {useContext} from 'react';
//mui
import {Breadcrumbs, styled, Typography} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import useMediaQuery from '@mui/material/useMediaQuery';
import {useTheme} from '@mui/material/styles';
//bloomreach
import {BrPageContext} from '@bloomreach/react-sdk';
//hocs
import {GtmEventCategory} from '@/hocs/gtm/GtmEventHoc';
//components
import {NavLink} from '@/components/common/nav-link';
import FlexBox from '@/components/common/flex-box/FlexBox';
//types
import {BrFacet, BrFacetField} from '@/utils/CommonTypes';

export const BreadcrumbNavLink = styled(NavLink)({
  ':hover': {
    'textDecoration': 'underline',
  },
  textTransform: 'capitalize',
});

export interface CategoryBreadcrumbProps {
  facetFields?: Record<string, BrFacetField[]>;
  facets?: BrFacet[];
  category?: GtmEventCategory;
  showSingle?: boolean;
}

export const CategoryBreadcrumb = (props: CategoryBreadcrumbProps) => {

  const page = useContext(BrPageContext);

  const {facets, facetFields, category, showSingle = false} = props;

  const theme = useTheme();
  const downMd = useMediaQuery(theme.breakpoints.down('md'));

  if (!category || (!facets && !facetFields)) {
    return null;
  }

  const {catId, catName} = category;

  let breadcrumbs = [];

  let treePath;
  if (facetFields) {
    treePath = facetFields?.category?.find(cat => cat.cat_id === catId)?.tree_path;
  } else {
    const categoryValue = facets.find(facet => facet.name === 'category')?.value;
    if (Array.isArray(categoryValue)) {
      treePath = categoryValue?.find(cat => cat.cat_id === catId)?.tree_path;
    }
  }

  if (treePath) {
    breadcrumbs = treePath.split('/')
      .filter(treeSegment => !!treeSegment)
      .map((treeSegment, key) => {
        const pair = treeSegment.split(',');
        const pathCatId = pair?.[0];
        const pathCatName = pair?.[1];

        return (
          pathCatId === catId && !showSingle ?
            <Typography key={key} color='text.primary' sx={{
              textTransform: 'capitalize',
            }}>
              {pathCatName}
            </Typography>
            :
            <BreadcrumbNavLink key={key} href={page.getUrl(`/categories/${pathCatId}`)}>
              {pathCatName}
            </BreadcrumbNavLink>
        );
      });
  }

  if (downMd) {
    return <FlexBox sx={{
      justifyContent: 'center',
    }}>
      {breadcrumbs?.length > (showSingle ? 0 : 1) && <Breadcrumbs
        separator={<NavigateNextIcon fontSize='small' />}
        aria-label='breadcrumb'
      >
        {breadcrumbs}
      </Breadcrumbs>}
    </FlexBox>;
  }

  return (
    breadcrumbs?.length > (showSingle ? 0 : 1) && <Breadcrumbs
      separator={<NavigateNextIcon fontSize='small' />}
      aria-label='breadcrumb'
    >
      {breadcrumbs}
    </Breadcrumbs>
  );
};