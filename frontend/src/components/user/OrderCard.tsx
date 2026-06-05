import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '@/lib/formatters';
import { ChevronRight, MapPin, BedDouble } from 'lucide-react';
import { OrderPaymentActions } from './order-card/OrderPaymentActions';
import { OrderReviewForm } from './order-card/OrderReviewForm';
import type { OrderCardProps } from './order-card/types';

export const OrderCard: FC<OrderCardProps> = (props) => {
  const { order, StatusBadge } = props;
  const checkIn = new Date(order.check_in_date);
  const checkOut = new Date(order.check_out_date);

  return (
    <div className="group overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900 mb-6">
      <div className="flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="h-48 md:h-auto md:w-1/3 shrink-0 bg-slate-200 dark:bg-slate-800 overflow-hidden relative">
          {order.property?.featured_image_url ? (
            <img src={order.property.featured_image_url} alt={order.property.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <BedDouble size={40} className="text-slate-400" />
            </div>
          )}
          <div className="absolute top-4 right-4">
            <StatusBadge status={order.status} />
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-1 flex-col p-6 md:p-8 justify-between">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="font-mono text-xs font-bold tracking-wider text-slate-500">#{order.order_number}</p>
              <p className="text-sm font-semibold text-slate-500 uppercase">{order.payment_method}</p>
            </div>
            
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{order.property?.name}</h3>
            
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 text-sm text-slate-600 dark:text-slate-400 mb-6">
              <span className="flex items-center"><MapPin size={16} className="mr-1" /> {order.property?.city || 'Lokasi'}</span>
              <span className="flex items-center"><BedDouble size={16} className="mr-1" /> {order.room?.room_type}</span>
            </div>

            <div className="flex items-center gap-6 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/50 mb-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Check-in</p>
                <p className="font-medium text-slate-900 dark:text-white">{checkIn.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</p>
              </div>
              <ChevronRight className="text-slate-300" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Check-out</p>
                <p className="font-medium text-slate-900 dark:text-white">{checkOut.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-t border-slate-100 pt-6 dark:border-slate-800">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500 mb-1">Total Pembayaran</p>
              <p className="text-2xl font-bold text-red-600">{formatPrice(order.total_price)}</p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <OrderPaymentActions 
                order={props.order} 
                uploading={props.uploading} 
                handleUploadClick={props.handleUploadClick} 
                canceling={props.canceling} 
                handleCancelClick={props.handleCancelClick} 
                paymentActionId={props.paymentActionId} 
                retryMidtransPayment={props.retryMidtransPayment} 
                switchToManualPayment={props.switchToManualPayment} 
              />
              
              {props.order.status === 'COMPLETED' && !props.order.review && (
                <button 
                  onClick={() => props.setReviewOrderId(props.order.id)}
                  className="w-full sm:w-auto rounded-xl bg-amber-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-amber-600"
                >
                  Beri Ulasan
                </button>
              )}

              <Link 
                to={`/orders/${order.id}`} 
                className="flex w-full sm:w-auto items-center justify-center rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
              >
                Detail <ChevronRight size={16} className="ml-1" />
              </Link>
            </div>
          </div>
          
          {props.reviewOrderId === props.order.id && (
            <div className="mt-6 border-t border-slate-100 pt-6 dark:border-slate-800">
              <OrderReviewForm {...props} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
