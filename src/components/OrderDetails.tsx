import { useState } from 'react';
import { ArrowLeft, User, Phone, MapPin, Package, Truck, CheckCircle2, Clock, Printer, Download, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { type Page, type Order } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Textarea } from './ui/textarea';

interface OrderDetailsProps {
  orderId: string | null;
  onNavigate: (page: Page) => void;
  orders: Order[];
  updateOrder: (order: Order) => void;
}

const orderItems = [
  {
    id: '1',
    name: 'Organic Tomatoes',
    variant: '1kg',
    quantity: 2,
    price: 90,
    image: 'https://images.unsplash.com/photo-1546470427-227ada05e3bd?w=100&h=100&fit=crop',
  },
  {
    id: '2',
    name: 'Fresh Spinach',
    variant: '500g',
    quantity: 3,
    price: 90,
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=100&h=100&fit=crop',
  },
  {
    id: '3',
    name: 'Green Beans',
    variant: '500g',
    quantity: 1,
    price: 55,
    image: 'https://images.unsplash.com/photo-1594317526002-18f4068f1a94?w=100&h=100&fit=crop',
  },
];

const customerData = {
  name: 'Rajesh Kumar',
  phone: '+91 98765 43210',
  email: 'rajesh.kumar@email.com',
  address: '123 MG Road, Koramangala, Bangalore - 560034',
};

export function OrderDetails({ orderId, onNavigate, orders, updateOrder }: OrderDetailsProps) {
  const order = orders.find(o => o.id === orderId);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  if (!order) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <h2 className="text-gray-900 mb-4">Order Not Found</h2>
          <Button onClick={() => onNavigate('orders')} className="bg-green-600 hover:bg-green-700">
            Back to Orders
          </Button>
        </div>
      </div>
    );
  }

  const getTimeline = (status: string) => {
    const baseTimeline = [
      { status: 'Order Placed', date: order.date, completed: true },
      { status: 'Order Accepted', date: '2025-10-31 09:45 AM', completed: status !== 'pending' },
      { status: 'Packing in Progress', date: '2025-10-31 10:00 AM', completed: status === 'processing' || status === 'shipped' || status === 'delivered' },
      { status: 'Ready for Dispatch', date: status === 'shipped' || status === 'delivered' ? '2025-10-31 11:00 AM' : '', completed: status === 'shipped' || status === 'delivered' },
      { status: 'Out for Delivery', date: status === 'delivered' ? '2025-10-31 12:00 PM' : '', completed: status === 'delivered' },
      { status: 'Delivered', date: status === 'delivered' ? '2025-10-31 02:00 PM' : '', completed: status === 'delivered' },
    ];

    if (status === 'cancelled') {
      return [
        baseTimeline[0],
        { status: 'Order Cancelled', date: order.date, completed: true },
      ];
    }

    return baseTimeline;
  };

  const timeline = getTimeline(order.status);

  const pricing = {
    subtotal: order.amount - 15,
    deliveryFee: 15,
    discount: 0,
    tax: 0,
    total: order.amount,
  };

  const handlePrintInvoice = () => {
    toast.success('Invoice printing...');
  };

  const handleDownload = () => {
    toast.success('Order details downloaded');
  };

  const handleMarkAsShipped = () => {
    updateOrder({ ...order, status: 'shipped' });
    toast.success('Order marked as shipped');
  };

  const handleCancelOrder = () => {
    setCancelDialogOpen(true);
  };

  const confirmCancel = () => {
    if (!cancelReason.trim()) {
      toast.error('Please provide a reason for cancellation');
      return;
    }
    
    updateOrder({ ...order, status: 'cancelled' });
    toast.success('Order cancelled successfully');
    setCancelDialogOpen(false);
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => onNavigate('orders')}
          className="gap-2 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Orders
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-gray-900 mb-2">Order {order.id}</h1>
            <p className="text-gray-600">Placed on {order.date}</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2" onClick={handleDownload}>
              <Download className="w-4 h-4" />
              Download
            </Button>
            <Button variant="outline" className="gap-2" onClick={handlePrintInvoice}>
              <Printer className="w-4 h-4" />
              Print Invoice
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Timeline */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle>Order Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {timeline.map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        item.completed ? 'bg-green-600' : 'bg-gray-200'
                      }`}>
                        {item.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-white" />
                        ) : (
                          <Clock className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      {index < timeline.length - 1 && (
                        <div className={`w-0.5 h-12 ${item.completed ? 'bg-green-600' : 'bg-gray-200'}`}></div>
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className={`mb-1 ${item.completed ? 'text-gray-900' : 'text-gray-600'}`}>
                        {item.status}
                      </p>
                      {item.date && <p className="text-gray-500">{item.date}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orderItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-gray-900 mb-1">{item.name}</p>
                      <p className="text-gray-600">{item.variant}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-600 mb-1">Qty: {item.quantity}</p>
                      <p className="text-gray-900">₹{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing Summary */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{pricing.subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span>₹{pricing.deliveryFee}</span>
                </div>
                {pricing.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{pricing.discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-900 pt-3 border-t border-gray-200">
                  <span>Total</span>
                  <span>₹{pricing.total}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Status */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className={`p-4 rounded-xl border ${
                order.status === 'pending' ? 'bg-orange-50 border-orange-200' :
                order.status === 'processing' ? 'bg-blue-50 border-blue-200' :
                order.status === 'shipped' ? 'bg-purple-50 border-purple-200' :
                order.status === 'delivered' ? 'bg-green-50 border-green-200' :
                'bg-red-50 border-red-200'
              }`}>
                <Badge className={
                  order.status === 'pending' ? 'bg-orange-600 text-white hover:bg-orange-600 mb-2' :
                  order.status === 'processing' ? 'bg-blue-600 text-white hover:bg-blue-600 mb-2' :
                  order.status === 'shipped' ? 'bg-purple-600 text-white hover:bg-purple-600 mb-2' :
                  order.status === 'delivered' ? 'bg-green-600 text-white hover:bg-green-600 mb-2' :
                  'bg-red-600 text-white hover:bg-red-600 mb-2'
                }>
                  {order.status}
                </Badge>
                <p className={
                  order.status === 'pending' ? 'text-orange-900' :
                  order.status === 'processing' ? 'text-blue-900' :
                  order.status === 'shipped' ? 'text-purple-900' :
                  order.status === 'delivered' ? 'text-green-900' :
                  'text-red-900'
                }>
                  {order.status === 'pending' && 'Awaiting acceptance'}
                  {order.status === 'processing' && 'Order is being processed'}
                  {order.status === 'shipped' && 'Order is out for delivery'}
                  {order.status === 'delivered' && 'Order has been delivered'}
                  {order.status === 'cancelled' && 'Order has been cancelled'}
                </p>
              </div>
              {order.status === 'processing' && (
                <div className="space-y-3">
                  <Button className="w-full bg-green-600 hover:bg-green-700" onClick={handleMarkAsShipped}>
                    Mark as Shipped
                  </Button>
                  <Button variant="outline" className="w-full text-red-600 border-red-300 hover:bg-red-50" onClick={handleCancelOrder}>
                    Cancel Order
                  </Button>
                </div>
              )}
              {order.status === 'pending' && (
                <div className="space-y-3">
                  <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => updateOrder({ ...order, status: 'processing' })}>
                    Accept Order
                  </Button>
                  <Button variant="outline" className="w-full text-red-600 border-red-300 hover:bg-red-50" onClick={handleCancelOrder}>
                    Reject Order
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-gray-900">{order.customer}</p>
                  <p className="text-gray-600">{customerData.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                <Phone className="w-5 h-5 text-gray-600 mt-1" />
                <div>
                  <p className="text-gray-600 mb-1">Phone</p>
                  <p className="text-gray-900">{order.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                <MapPin className="w-5 h-5 text-gray-600 mt-1" />
                <div>
                  <p className="text-gray-600 mb-1">Delivery Address</p>
                  <p className="text-gray-900">{customerData.address}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery & Payment */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle>Delivery & Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-600">Delivery</span>
                </div>
                <Badge className={
                  order.delivery === 'Today' ? 'bg-green-600 text-white hover:bg-green-600' :
                  order.delivery === 'Tomorrow' ? 'bg-blue-600 text-white hover:bg-blue-600' :
                  'bg-purple-600 text-white hover:bg-purple-600'
                }>
                  {order.delivery}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-600">Payment</span>
                </div>
                <Badge variant="outline" className="border-gray-300">
                  {order.paymentMode}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Cancel Order Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Order</DialogTitle>
            <DialogDescription>
              Please provide a reason for cancelling order {order.id}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Enter cancellation reason..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
              Keep Order
            </Button>
            <Button variant="destructive" onClick={confirmCancel}>
              Cancel Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
