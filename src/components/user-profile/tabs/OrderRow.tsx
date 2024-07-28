import {FC} from 'react';
import Link from 'next/link';
import {format} from 'date-fns';
import {East} from '@mui/icons-material';
import {Box, Chip, IconButton, Typography} from '@mui/material';
import TableRow from '@/components/common/bazaar/TableRow';
import {H5} from '@/components/common/bazaar/Typography';
import Order from './Order.model';
import {formattedPrice} from '@/utils/CurrencyUtils';
import {getUrl} from '@/utils/UrlUtils';
import {BrProps} from '@bloomreach/react-sdk';

// =================================================
type OrderRowProps = {order: Order};
// =================================================

const OrderRow = (props: BrProps & OrderRowProps) => {
  const {page, order} = props;
  const getColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'secondary';

      case 'Processing':
        return 'secondary';

      case 'COMPLETED':
        return 'success';

      case 'Cancelled':
        return 'error';

      default:
        return '';
    }
  };

  return (
    <Link href={getUrl(`/orders/${order.id}`, page)} passHref legacyBehavior>
      <a>
        <TableRow sx={{my: '1rem', padding: '6px 18px'}}>
          <H5 m={0.75} textAlign='left'>
            {order.id}
          </H5>

          <Box m={0.75}>
            <Chip
              size='small'
              label={order.status}
              sx={{
                p: '0.25rem 0.5rem',
                fontSize: 12,
                color: !!getColor(order.status)
                  ? `${getColor(order.status)}.900`
                  : 'inherit',
                backgroundColor: !!getColor(order.status)
                  ? `${getColor(order.status)}.100`
                  : 'none',
              }}
            />
          </Box>

          <Typography className='pre' m={0.75} textAlign='left'>
            {format(new Date(order.date), 'MMM dd, yyyy')}
          </Typography>

          <Typography m={0.75} textAlign='left'>
            {formattedPrice(order.totalAmount)}
          </Typography>

          <Typography
            color='grey.600'
            textAlign='center'
            sx={{
              flex: '0 0 0 !important',
              display: {xs: 'none', md: 'block'},
            }}
          >
            <IconButton>
              <East
                fontSize='small'
                color='inherit'
                sx={{
                  transform: ({direction}) =>
                    `rotate(${direction === 'rtl' ? '180deg' : '0deg'})`,
                }}
              />
            </IconButton>
          </Typography>
        </TableRow>
      </a>
    </Link>
  );
};

export default OrderRow;
