import {CartItem} from '@/contexts/AppContext';
import User from './User.model';

interface Order {
  billing: Object;
  shipping: Object;
  currency: string;
  shipMethod: string;
  id: string;
  items: CartItem[];
  date: Date;
  totalAmount: number;
  taxAmount: number;
  status: 'COMPLETED';
}

export default Order;
