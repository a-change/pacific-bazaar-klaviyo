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
import React, {useContext, useEffect, useState} from 'react';
import {useCookies} from 'react-cookie';
//next
import {useRouter} from 'next/router';
//mui
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IconButton from '@mui/material/IconButton';
import RefreshIcon from '@mui/icons-material/Refresh';
import {Avatar, Box, Chip, List, ListItem, Stack, styled} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
//bloomreach sdk
import {BrProps} from '@bloomreach/react-sdk';
//other libs
import axios from 'axios';
import axiosRetry from 'axios-retry';
//contexts
import {UserContext, UserType} from '@/contexts/UserContext';
//components
import {NavLink} from '@/components/common/nav-link';
import {H6} from '@/components/common/bazaar/Typography';
import {FlexBox} from '@/components/common/flex-box';
//types
import {VisitorAttributeTypes, VisitorType} from '@/components/helper/visitor/VisitorHelperTypes';
import {HelperComponentProps} from '@/components/helper/HelperComponent';
//functions
import {
  AGGREGATE_PREFIX,
  ATTRIBUTE_PREFIX,
  buildAttributes,
  getAPIUrl,
  getCustomerIds, getUserSegments,
  getVisitorFromResults, SEGMENTATION_PREFIX,
} from '@/components/helper/visitor/VisitorHelperUtils';

//Custom styled components
const SiteMenuNavLink = styled(NavLink)({
  cursor: 'pointer',
  transition: 'color 150ms ease-in-out',
  '&:hover': {color: 'primary.main'},
});

const VisitorAccordionSummary = styled(AccordionSummary)(({theme}) => ({
  fontWeight: 'bold',
  textTransform: 'uppercase',
  backgroundColor: theme.palette.grey[200],
}));

const VisitorListItem = styled(ListItem)(({theme}) => ({
  cursor: 'pointer',
  transition: 'color 150ms ease-in-out',
  ':hover': {
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.grey[200],
  },
}));

const VisitorFlexBox = styled(FlexBox)(({theme}) => ({
  width: '100%',
}));

const VisitorAvatar = styled(Avatar)(({theme}) => ({
  width: 56,
  height: 56,
  marginTop: '4px',
  marginBottom: '4px',
}));

axiosRetry(axios, {
  retries: 3, // number of retries
  retryDelay: (retryCount) => {
    console.log(`retry attempt: ${retryCount}`);
    return retryCount * 2000; // time interval between retries
  },
  retryCondition: (error) => {
    // if retry condition is not specified, by default idempotent requests are retried
    return error.response.status === 502;
  },
});

export const VisitorHelper = (props: BrProps & HelperComponentProps) => {
  const {page, visitor: visitorRef} = props;
  const [cookies] = useCookies();
  const router = useRouter();
  const {
    userState: {user, setUser, visitor, setVisitor},
    segmentationState: {segmentationStatus},
  } = useContext(UserContext)!;
  const [showSegmentDetails, setShowSegmentDetails] = useState<boolean>(false);
  const [segmentDisplay, setSegmentDisplay] = useState<Record<string, boolean>>({});

  const channelParams = page.getChannelParameters();
  const cookie = cookies.__exponea_etc__;
  const linkVal = visitor?.id || cookie;

  let {
    externalLocale,
    exponeaApiTarget,
    exponeaProjectToken,
    engagementVisitorProperties: engagementVisitorPropertiesInput,
    engagementVisitorAggregates: engagementVisitorAggregatesInput,
    engagementVisitorSegmentations: engagementVisitorSegmentationsInput,
    engagementApiKeyId,
    engagementApiKeySecret,
    engagementProjectUrl = 'https://demoapp.bloomreach.com/p/bloomreach',
  } = channelParams;

  const attributeMap = {};
  const aggregateMap = {};
  const segmentationMap = {};

  if (visitorRef) {
    const visitorConfigs = page.getContent(visitorRef)?.getData();
    if (visitorConfigs) {
      const {keys = [], messages = []} = visitorConfigs;
      keys.forEach((key, index) => {
        const message = messages?.[index];
        if (key.startsWith(ATTRIBUTE_PREFIX)) {
          attributeMap[key.substring(ATTRIBUTE_PREFIX.length)] = message;
        }
        if (key.startsWith(AGGREGATE_PREFIX)) {
          aggregateMap[key.substring(AGGREGATE_PREFIX.length)] = message;
        }
        if (key.startsWith(SEGMENTATION_PREFIX)) {
          segmentationMap[key.substring(SEGMENTATION_PREFIX.length)] = message;
        }
      });
    }
  }

  if (engagementVisitorPropertiesInput) {
    engagementVisitorPropertiesInput.split(',').forEach(engagementVisitorProperty => {
      attributeMap[engagementVisitorProperty] = engagementVisitorProperty;
    });
  }

  if (engagementVisitorAggregatesInput) {
    engagementVisitorAggregatesInput.split(',').forEach(engagementVisitorAggregate => {
      const pair = engagementVisitorAggregate.split('|');
      aggregateMap[pair[0]] = pair?.[1];
    });
  }

  if (engagementVisitorSegmentationsInput) {
    engagementVisitorSegmentationsInput.split(',').forEach(engagementVisitorSegmentation => {
      const pair = engagementVisitorSegmentation.split('|');
      segmentationMap[pair[0]] = pair?.[1];
    });
  }

  const engagementVisitorProperties = Object.keys(attributeMap).join(',');
  const engagementVisitorAggregates = Object.keys(aggregateMap)
    .map(aggregateMapKey => `${aggregateMapKey}|${aggregateMap[aggregateMapKey]}`)
    .join(',');

  const engagementVisitorSegmentations = Object.keys(segmentationMap)
    .map(segmentationMapKey => `${segmentationMapKey}|${segmentationMap[segmentationMapKey]}`)
    .join(',');

  useEffect(() => {
    //console.log('[DEBUG]', user, segmentationStatus, getUserSegments(user));
    if (getUserSegments(user)) {
      getVisitor();
    }
  }, [JSON.stringify(user), segmentationStatus]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const exponea = (window as any)?.exponea;
    const updatedUser = JSON.parse(JSON.stringify(user)) as UserType;
    ['content', 'discovery', 'merchandising'].forEach(key => {
      exponea.getSegments(
        key,
        (segmentsDefinition) => {
          if (segmentsDefinition) {
            updatedUser[`${key}Segments`] = segmentsDefinition
              ?.map(segmentDefinition => segmentDefinition?.segmentation_id + ':' + segmentDefinition?.id)
              ?.join(',');
            setUser(updatedUser);
          }
        },
      );
    });
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  function getVisitor() {
    getVisitorData(user)
      .then((response) => {
        return getVisitorFromResults(
          response.results,
          engagementVisitorProperties,
          engagementVisitorAggregates,
          engagementVisitorSegmentations,
          user,
          externalLocale,
        );
      })
      .then((theVisitor) => {
        setVisitor(theVisitor);
        return theVisitor;
      });
  }

  async function getVisitorData(user: Partial<UserType>): Promise<any> {
    // const cookie = user.id || cookies.__exponea_etc__;
    let registered = user.email ?? undefined;
    if (!registered) {
      registered = JSON.parse(sessionStorage.getItem('user') ?? '{}').email;
    }
    try {
      const response = await axios.post(
        '/api/getVisitorData',
        {
          url: getAPIUrl(exponeaApiTarget, exponeaProjectToken),
          data: {
            customer_ids: getCustomerIds(registered, cookie),
            attributes: buildAttributes(
              engagementVisitorProperties,
              engagementVisitorAggregates,
              //engagementVisitorSegmentations,
              user,
            ),
          },
        },
        {
          auth: {
            username: engagementApiKeyId,
            password: engagementApiKeySecret,
          },
        },
      );
      return response.data;
    } catch (e) {
      console.error('axios error == ', e);
      return e;
    }
  }

  const handleRefresh = (event: any): void => {
    const animation = [{transform: 'rotate(0)'}, {transform: 'rotate(720deg)'}];
    const animationTiming = {
      duration: 2000,
      iteration: 1,
    };
    const icon = event.currentTarget as SVGAElement;
    router.reload();
    //getVisitor();
    icon.animate(animation, animationTiming);
  };

  const {contentSegments, discoverySegments, merchandisingSegments} = user;
  const segments = [];
  if (contentSegments) {
    segments.push(...contentSegments.split(',').map(contentSegment => ({
        type: 'content',
        value: contentSegment,
        letter: 'C',
        color: 'primary.main',
      }),
    ));
  }
  if (discoverySegments) {
    segments.push(...discoverySegments.split(',').map(discoverySegment => ({
        type: 'discovery',
        value: discoverySegment,
        letter: 'S',
        color: 'success.main',
        label: 'search',
      }),
    ));
  }
  if (merchandisingSegments) {
    segments.push(...merchandisingSegments.split(',').map(merchandisingSegment => ({
        type: 'merchandising',
        value: merchandisingSegment,
        letter: 'M',
        color: 'warning.main',
      }),
    ));
  }

  // Merge the segment list for display
  // segmentationId, name, link, segmentId, types: [{type, letter, color}]
  const segmentList = {};
  let index = -1;

  Object.entries(visitor?.segmentations ?? {})?.forEach(segmentation => {
    const [name, v] = segmentation;
    let segmentationId = name;
    Object.entries(segmentationMap).forEach(entry => {
      const [id, label] = entry;
      if (label === name) {
        segmentationId = id;
      }
    });

    const matchedSegment = segments.find(segment => segment?.value?.startsWith(segmentationId));
    const segmentId = matchedSegment?.value?.split(':')?.[1];
    const item = v?.[0];

    const types = segments.filter(segment => segment?.value?.startsWith(segmentationId))
      .map(segment => ({
        color: segment?.color,
        letter: segment?.letter,
        type: segment?.type,
        label: segment?.label,
      }));

    segmentList[segmentationId] = {
      segmentationId,
      segmentId,
      name,
      item,
      link: `${engagementProjectUrl}/analytics/segmentations/${segmentationId}`,
      types,
    };

    /*
    v?.forEach(item => {
      index++;
      const segment = segments?.[index];
      const segmentationId = segment?.value.split(':')?.[0];
      const segmentId = segment?.value.split(':')?.[1];
      if (!segmentList[segmentationId]) {
        segmentList[segmentationId] = {
          segmentationId,
          segmentId,
          name,
          item,
          link: `${engagementProjectUrl}/analytics/segmentations/${segmentationId}`,
          types: [],
        };
      }
      segmentList[segmentationId].types.push({
        color: segment?.color,
        letter: segment?.letter,
        type: segment?.type,
        label: segment?.label,
      });
    });
     */
  });

  const firstName = visitor?.first_name || user.firstName || '';
  const lastName = visitor?.last_name || user.lastName || '';

  return exponeaApiTarget && exponeaProjectToken && (visitor ? (
      <Box>
        <Stack direction={'row'} spacing={2}>
          {visitor?.avatar ? (
            <VisitorAvatar
              alt={'avatar'}
              src={visitor.avatar}
            />
          ) : firstName && lastName ? (
            <VisitorAvatar
              alt={'avatar'}
            >
              {firstName.substring(0, 1)}
              {lastName.substring(0, 1)}
            </VisitorAvatar>
          ) : (
            <VisitorAvatar
              alt={'avatar'}
              src={'https://icon-library.com/images/default-user-icon/default-user-icon-13.jpg'}
            />
          )}
          <FlexBox flexDirection={'column'}>
            <H6 sx={{textTransform: 'capitalize'}}>{firstName} {lastName}</H6>
            <Stack direction='column'>
              {linkVal && (
                <SiteMenuNavLink
                  href={`${engagementProjectUrl}/crm/customers/pages/1?count=20&orderColumn=0&skip=0&query=${linkVal}`}
                  target='blank'
                >
                  {linkVal}
                </SiteMenuNavLink>
              )}
              <span>
               <IconButton title='Show Segment Details' color='primary' size={'small'}
                           onClick={(e) => setShowSegmentDetails(!showSegmentDetails)}>
                {showSegmentDetails ? <VisibilityOffOutlinedIcon /> : <VisibilityIcon />}
              </IconButton>
              <IconButton title='Refresh' color='primary' size={'small'} onClick={(e) => handleRefresh(e)}>
                <RefreshIcon />
              </IconButton>
              </span>
            </Stack>
          </FlexBox>
        </Stack>
        <Accordion>
          <VisitorAccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls='panel3a-content'
            id='panel3a-header'
          >
            <Typography>{VisitorAttributeTypes.ATTRIBUTES}</Typography>
          </VisitorAccordionSummary>
          <AccordionDetails>
            <List>
              {Object.entries(attributeMap)?.filter(attribute => attribute?.[0] !== 'avatar')?.map((attribute, key) => {
                const [k, v] = attribute;
                return <VisitorListItem key={key}>
                  <VisitorFlexBox flexDirection={'row'} justifyContent={'space-between'}>
                    <H6>{k}</H6>
                    <Typography>{visitor?.[v as string]}</Typography>
                  </VisitorFlexBox>
                </VisitorListItem>;
              })}
            </List>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <VisitorAccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls='panel1a-content'
            id='panel1a-header'
          >
            <Typography>{VisitorAttributeTypes.AGGREGATES}</Typography>
          </VisitorAccordionSummary>
          <AccordionDetails>
            <List>
              {Object.entries(visitor?.aggregates)?.map((aggretate, key) => {
                const [k, v] = aggretate;
                const val = Array.isArray(v) ? v.join(',') : v;
                return <VisitorListItem key={key}>
                  <VisitorFlexBox flexDirection={'row'} justifyContent={'space-between'}>
                    <H6>{k}</H6>
                    <Typography>{val as string}</Typography>
                  </VisitorFlexBox>
                </VisitorListItem>;
              })}
            </List>
          </AccordionDetails>
        </Accordion>
        <Accordion defaultExpanded={true}>
          <VisitorAccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls='panel2a-content'
            id='panel2a-header'
          >
            <Typography>{VisitorAttributeTypes.SEGMENTATIONS}</Typography>
          </VisitorAccordionSummary>
          <AccordionDetails>
            <List>
              {Object.values(segmentList)?.sort((segmentA: any, segmentB: any) => {
                const nameA = segmentA?.name;
                const nameB = segmentB?.name;
                if (nameA > nameB) {
                  return 1;
                } else if (nameB > nameA) {
                  return -1;
                }
                return 0;
              }).map((segment: any, key) => {
                const {segmentationId, segmentId, name, item, link, types} = segment;
                return (
                  (name !== segmentationId || showSegmentDetails) && <VisitorListItem key={`${key}`}>
                    <Stack direction={'column'} sx={{width: '100%'}}>
                      <VisitorFlexBox flexDirection={'row'} justifyContent={'space-between'}>
                        <Stack direction={'row'} spacing={1}>
                          <H6>
                            <SiteMenuNavLink
                              href={link}
                              target='blank'
                            >{name}
                            </SiteMenuNavLink>
                          </H6>
                          {types?.map((type, key2) => {
                              const displayKey = `${key}-${key2}`;
                              const onState = {};
                              onState[displayKey] = true;
                              const offState = {};
                              offState[displayKey] = false;
                              return segmentDisplay[displayKey] ?
                                <Chip
                                  key={`${key}-${key2}`}
                                  sx={{
                                    height: 20,
                                    fontSize: 12,
                                    backgroundColor: `${type?.color}`,
                                    textTransform: 'capitalize',
                                  }}
                                  label={type?.label || type?.type}
                                  onMouseLeave={() => setSegmentDisplay({...offState})}
                                />
                                :
                                <Avatar
                                  key={`${key}-${key2}`}
                                  sx={{
                                    width: 20,
                                    height: 20,
                                    fontSize: 12,
                                    backgroundColor: `${type?.color}`,
                                  }}
                                  onMouseOver={() => setSegmentDisplay({...onState})}
                                >{type?.letter}</Avatar>;
                            },
                          )}
                        </Stack>
                        <Typography>{item as string}</Typography>
                      </VisitorFlexBox>
                      {showSegmentDetails && <VisitorFlexBox flexDirection={'row'} justifyContent={'space-between'}>
                        <H6>{segmentationId}</H6>
                        <Typography>{segmentId}</Typography>
                      </VisitorFlexBox>}
                    </Stack>
                  </VisitorListItem>
                );
              })}
            </List>
          </AccordionDetails>
        </Accordion>
      </Box>
    ) : (
      <Box>
        <Stack direction={'row'} spacing={2}>
          <VisitorAvatar
            alt={'avatar'}
            src={'https://icon-library.com/images/default-user-icon/default-user-icon-13.jpg'}
          />
          <FlexBox flexDirection={'column'}>
            <Stack direction='row'>
              <IconButton aria-label='Refresh' color='primary' size={'small'} onClick={(e) => handleRefresh(e)}>
                <RefreshIcon />
              </IconButton>
            </Stack>
          </FlexBox>
        </Stack>
      </Box>
    )
  );
};

