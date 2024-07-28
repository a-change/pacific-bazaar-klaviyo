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
//next
import Link from 'next/link';
import {useTranslation} from 'next-i18next';
//mui
import {Accordion, Card, List, ListItem, ListItemButton, ListItemText, styled} from '@mui/material';
import AccordionDetails from '@mui/material/AccordionDetails';
//bloomreach sdk
import {BrPageContext} from '@bloomreach/react-sdk';
//components
import {FacetToggle} from '@/components/common/facet/templates';

export interface RelatedSearchProps {
  relatedSearches?: Array<string>;
}

export const RelatedSearchCard = styled(Card)(({theme}) => ({
  overflow: 'auto',
}));

export const RelatedSearch = (props: RelatedSearchProps) => {
  const {relatedSearches} = props;
  const page = useContext(BrPageContext);
  const {t} = useTranslation('search');

  const cleanedRelatedSearches = relatedSearches?.filter(relatedSearch => !!relatedSearch);

  if (cleanedRelatedSearches?.length > 0) {
    return (
      <RelatedSearchCard elevation={1}>
        <Accordion defaultExpanded>
          <FacetToggle eventKey={'related-search'} facetName={t('related-search')} nonFacet={true} />
          <AccordionDetails>
            <List>
              {cleanedRelatedSearches.map((relatedSearche, key) => {
                return (
                  <ListItem disablePadding key={key}>
                    <ListItemButton>
                      <Link href={page.getUrl(`/th/${encodeURIComponent(relatedSearche)}`) ?? ''}>
                        <ListItemText primary={relatedSearche} />
                      </Link>
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </AccordionDetails>
        </Accordion>
      </RelatedSearchCard>
    );
  }
};