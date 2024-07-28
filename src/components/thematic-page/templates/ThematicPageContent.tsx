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
import {useContext, useEffect} from 'react';
//mui
import {Stack, styled, Typography} from '@mui/material';
//contexts
import {SEOContext} from '@/contexts/SEOContext';
//types
import {BrSearchPageHeader} from '@/utils/CommonTypes';
//components
import {H1} from '@/components/common/bazaar/Typography';
//functions
import {sanitize} from '@/utils/HtmlUtils';

// Styled component
const ThematicPageContentStack = styled(Stack)(({theme}) => ({
  backgroundColor: theme.palette.background.paper,
  transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
  borderRadius: '8px',
  boxShadow: '0px 1px 3px rgba(3, 0, 71, 0.09)',
  overflow: 'hidden',
  marginTop: '16px',
  marginBottom: '16px',
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  padding: '0.5rem 1.25rem',
}));

export const ThematicPageContent = (props: BrSearchPageHeader) => {
  const {setSeo} = useContext(SEOContext);
  const {
    h1,
    content_placement_1,
    content_placement_2,
    content_placement_3,
    title,
    meta_description: description,
    meta_keywords,
    robots_meta_tag,
    canonical_url,
  } = props;

  useEffect(() => {
    setSeo({
      title,
      description,
      seoTags: [{
        tag: 'keywords',
        value: meta_keywords,
      },
        {
          tag: 'robots',
          value: robots_meta_tag,
        }],
      canonicalUrl: canonical_url,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description, meta_keywords, robots_meta_tag, canonical_url]);

  const html1 = sanitize(content_placement_1 ?? '');
  const html2 = sanitize(content_placement_2 ?? '');
  const html3 = sanitize(content_placement_3 ?? '');

  return (
    <ThematicPageContentStack direction={'column'}>
      <H1>{h1}</H1>
      {html1 && <Typography dangerouslySetInnerHTML={{__html: html1}} />}
      {html2 && <Typography dangerouslySetInnerHTML={{__html: html2}} />}
      {html3 && <Typography dangerouslySetInnerHTML={{__html: html3}} />}
    </ThematicPageContentStack>
  );
};