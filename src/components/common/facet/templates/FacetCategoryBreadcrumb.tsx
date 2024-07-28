import React from 'react';
import {Box, styled, Tooltip, tooltipClasses} from '@mui/material';
import {useTranslation} from 'next-i18next';
import {CategoryBreadcrumb} from '@/components/common/breadcrumb/CategoryBreadcrumb';
import {BrFacet, BrFacetField} from '@/utils/CommonTypes';

interface FacetCategoryBreadcrumbProps {
  facets: BrFacet[],
  facetLabel: string,
  facetFields: Record<string, BrFacetField[]>
  catId: string,
}

const BreadcrumbTooltip = styled(Tooltip)(({theme}) => ({
  '& .MuiTooltip-tooltip': {
    backgroundColor: theme.palette.grey[200],
  },
}));


export const FacetCategoryBreadcrumb = (props: FacetCategoryBreadcrumbProps) => {
  const {
    facets,
    facetFields,
    facetLabel,
    catId,
  } = props;
  const {t} = useTranslation('facet');

  return (
    <BreadcrumbTooltip
      placement={'bottom-start'}
      title={<CategoryBreadcrumb facets={facets} facetFields={facetFields} category={{
        catId,
      }} showSingle />}
      componentsProps={{
        popper: {
          sx: {
            [`& .${tooltipClasses.tooltip}`]: {
              backgroundColor: (theme) => theme.palette.grey[200],
              border: (theme) => `1px solid ${theme.palette.grey[500]}`,
            },
          },
        },
      }}
    >
      <Box
        sx={{
          textTransform: 'capitalize',
        }}>
        {t(facetLabel)}
      </Box>
    </BreadcrumbTooltip>
  );
};