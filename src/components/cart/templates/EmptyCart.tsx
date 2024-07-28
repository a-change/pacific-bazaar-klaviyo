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
//next
import {useRouter} from 'next/router';

function EmptyCartBase() {
  const router = useRouter();


  const handleGoBack = () => {
    router.back();
  };

  return (
    // <Container className='d-flex' style={backgroundImgStyle}>
    //   <PageTitleComponent contentTitle={'Shopping cart is empty'} />
    //   <Row className='align-self-center'>
    //     <Col>
    //       <h1 className='header'>Shopping cart is empty</h1>
    //       <p className='mb-0'>Before checking out, please add some products to your shopping cart</p>
    //       <Button variant={'secondary'} onClick={handleGoBack}>Go Back</Button>
    //     </Col>
    //   </Row>
    // </Container>
    <></>
  );
}

export const EmptyCart = EmptyCartBase;
