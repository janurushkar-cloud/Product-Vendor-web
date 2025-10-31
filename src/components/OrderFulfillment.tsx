import { useState } from 'react';
import { Search, Filter, Package, Clock, Truck, CheckCircle2, XCircle, Download } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { type Page, type Order } from '../App';
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

interface OrderFulfillmentProps {
  onNavigate: (page: Page, productId?: string, orderId?: string) => void;
  orders: Order[];
  updateOrder: (order: Order) => void;
}

export function OrderFulfillment({ onNavigate, orders, updateOrder }: OrderFulfillmentProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [actionType, setActionType] = useState<'accept' | 'reject'>('accept');
  const [rejectionReason, setRejectionReason] = useState('');

  const statusOptions = [
    { value: 'all', label: 'All Orders', icon: Package, count: orders.length },
    { value: 'pending', label: 'Pending', icon: Clock, count: orders.filter(o => o.status === 'pending').length },
    { value: 'processing', label: 'Processing', icon: Package, count: orders.filter(o => o.status === 'processing').length },
    { value: 'shipped', label: 'Shipped', icon: Truck, count: orders.filter(o => o.status === 'shipped').length },
    { value: 'delivered', label: 'Delivered', icon: CheckCircle2, count: orders.filter(o => o.status === 'delivered').length },
    { value: 'cancelled', label: 'Cancelled', icon: XCircle, count: orders.filter(o => o.status === 'cancelled').length },
  ];

  const filteredOrders = orders.filter(order => {
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-orange-100 text-orange-700 hover:bg-orange-100';
      case 'processing': return 'bg-blue-100 text-blue-700 hover:bg-blue-100';
      case 'shipped': return 'bg-purple-100 text-purple-700 hover:bg-purple-100';
      case 'delivered': return 'bg-green-100 text-green-700 hover:bg-green-100';
      case 'cancelled': return 'bg-red-100 text-red-700 hover:bg-red-100';
      default: return 'bg-gray-100 text-gray-700 hover:bg-gray-100';
    }
  };

  const getDeliveryColor = (delivery: string) => {
    switch (delivery) {
      case 'Today': return 'bg-green-600 text-white hover:bg-green-600';
      case 'Tomorrow': return 'bg-blue-600 text-white hover:bg-blue-600';
      case '2-3 Days': return 'bg-purple-600 text-white hover:bg-purple-600';
      default: return 'bg-gray-600 text-white hover:bg-gray-600';
    }
  };

  const handleAcceptOrder = (order: Order) => {
    setSelectedOrder(order);
    setActionType('accept');
    setActionDialogOpen(true);
  };

  const handleRejectOrder = (order: Order) => {
    setSelectedOrder(order);
    setActionType('reject');
    setRejectionReason('');
    setActionDialogOpen(true);
  };

  const confirmAction = () => {
    if (!selectedOrder) return;

    if (actionType === 'reject' && !rejectionReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    const newStatus = actionType === 'accept' ? 'processing' : 'cancelled';
    updateOrder({ ...selectedOrder, status: newStatus });
    
    toast.success(
      actionType === 'accept' 
        ? `Order ${selectedOrder.id} accepted successfully` 
        : `Order ${selectedOrder.id} rejected`
    );
    
    setActionDialogOpen(false);
    setSelectedOrder(null);
  };

  const handleMarkAsShipped = (order: Order) => {
    updateOrder({ ...order, status: 'shipped' });
    toast.success(`Order ${order.id} marked as shipped`);
  };

  const handleExport = () => {
    toast.success('Orders exported successfully');
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-gray-900 mb-2">Order Fulfillment</h1>
            <p className="text-gray-600">Manage and track customer orders</p>
          </div>
          <Button variant="outline" className="gap-2" onClick={handleExport}>
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {statusOptions.map((option) => {
          const Icon = option.icon;
          return (
            <Card
              key={option.value}
              className={`cursor-pointer transition-all border-2 ${
                selectedStatus === option.value
                  ? 'border-green-600 bg-green-50'
                  : 'border-gray-200 hover:border-green-300'
              }`}
              onClick={() => setSelectedStatus(option.value)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Icon className={`w-5 h-5 ${selectedStatus === option.value ? 'text-green-600' : 'text-gray-600'}`} />
                  <span className="text-gray-900">{option.count}</span>
                </div>
                <p className={selectedStatus === option.value ? 'text-green-700' : 'text-gray-600'}>
                  {option.label}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Search & Filters */}
      <Card className="border-gray-200 mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search by order ID or customer name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredOrders.length === 0 ? (
          <Card className="border-gray-200">
            <CardContent className="p-12 text-center text-gray-500">
              No orders found. Try adjusting your search or filters.
            </CardContent>
          </Card>
        ) : (
          filteredOrders.map((order) => (
            <Card 
              key={order.id} 
              className="border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onNavigate('order-details', undefined, order.id)}
            >
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Order Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-gray-900">{order.id}</h3>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                      <Badge className={getDeliveryColor(order.delivery)}>
                        {order.delivery}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-gray-600">
                      <div>
                        <p className="mb-1">Customer</p>
                        <p className="text-gray-900">{order.customer}</p>
                      </div>
                      <div>
                        <p className="mb-1">Contact</p>
                        <p className="text-gray-900">{order.phone}</p>
                      </div>
                      <div>
                        <p className="mb-1">Items</p>
                        <p className="text-gray-900">{order.items} products</p>
                      </div>
                      <div>
                        <p className="mb-1">Amount</p>
                        <p className="text-gray-900">₹{order.amount}</p>
                      </div>
                    </div>
                  </div>

                  {/* Payment & Actions */}
                  <div className="flex flex-col items-end gap-3" onClick={(e) => e.stopPropagation()}>
                    <Badge variant="outline" className="border-gray-300">
                      {order.paymentMode}
                    </Badge>
                    <p className="text-gray-500">{order.date}</p>
                    {order.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-red-600 border-red-300 hover:bg-red-50"
                          onClick={() => handleRejectOrder(order)}
                        >
                          Reject
                        </Button>
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleAcceptOrder(order)}
                        >
                          Accept
                        </Button>
                      </div>
                    )}
                    {order.status === 'processing' && (
                      <Button 
                        size="sm" 
                        className="bg-purple-600 hover:bg-purple-700"
                        onClick={() => handleMarkAsShipped(order)}
                      >
                        Mark as Shipped
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Action Confirmation Dialog */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'accept' ? 'Accept Order' : 'Reject Order'}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'accept' 
                ? `Are you sure you want to accept order ${selectedOrder?.id}?`
                : `Please provide a reason for rejecting order ${selectedOrder?.id}`
              }
            </DialogDescription>
          </DialogHeader>
          {actionType === 'reject' && (
            <div className="py-4">
              <Textarea
                placeholder="Enter rejection reason..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
              />
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              className={actionType === 'accept' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
              onClick={confirmAction}
            >
              {actionType === 'accept' ? 'Accept Order' : 'Reject Order'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
