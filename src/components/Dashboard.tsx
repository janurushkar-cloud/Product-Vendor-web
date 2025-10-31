import { TrendingUp, Package, ShoppingCart, DollarSign, Clock, Truck, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { type Page, type Product, type Order } from '../App';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  onNavigate: (page: Page, productId?: string, orderId?: string) => void;
  products: Product[];
  orders: Order[];
}

const revenueData = [
  { day: 'Mon', revenue: 4200 },
  { day: 'Tue', revenue: 5100 },
  { day: 'Wed', revenue: 3800 },
  { day: 'Thu', revenue: 6200 },
  { day: 'Fri', revenue: 7500 },
  { day: 'Sat', revenue: 8900 },
  { day: 'Sun', revenue: 6700 },
];

export function Dashboard({ onNavigate, products, orders }: DashboardProps) {
  const activeProducts = products.filter(p => p.status).length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.amount, 0);
  const lowStockItems = products.filter(p => p.stock < 50);

  const deliveryData = [
    { name: 'Today', value: orders.filter(o => o.delivery === 'Today').length, color: '#22c55e' },
    { name: 'Tomorrow', value: orders.filter(o => o.delivery === 'Tomorrow').length, color: '#86efac' },
    { name: '2-3 Days', value: orders.filter(o => o.delivery === '2-3 Days').length, color: '#dcfce7' },
  ];

  const recentOrders = orders.filter(o => o.status === 'pending' || o.status === 'processing').slice(0, 4);

  const stats = [
    { title: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, change: '+12.5%', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
    { title: 'Total Orders', value: orders.length.toString(), change: '+8.2%', icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Active Products', value: activeProducts.toString(), change: '+3', icon: Package, color: 'text-purple-600', bg: 'bg-purple-50' },
    { title: 'Pending Orders', value: pendingOrders.toString(), change: '-2', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your store today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-gray-200 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => {
              if (stat.title === 'Total Orders' || stat.title === 'Pending Orders') onNavigate('orders');
              if (stat.title === 'Active Products') onNavigate('catalog');
            }}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-600 mb-1">{stat.title}</p>
                    <h2 className="text-gray-900 mb-2">{stat.value}</h2>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-green-600">{stat.change}</span>
                    </div>
                  </div>
                  <div className={`${stat.bg} ${stat.color} p-3 rounded-xl`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2 border-gray-200">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <p className="text-gray-600">Last 7 days performance</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  formatter={(value) => `₹${value}`}
                />
                <Bar dataKey="revenue" fill="#22c55e" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Delivery Mix */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle>Delivery Mix</CardTitle>
            <p className="text-gray-600">Order distribution by delivery time</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={deliveryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {deliveryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {deliveryData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-gray-600">{item.name}</span>
                  </div>
                  <span className="text-gray-900">{item.value} orders</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <p className="text-gray-600">Latest orders requiring attention</p>
            </div>
            <Button 
              variant="ghost" 
              className="text-green-600 hover:text-green-700 hover:bg-green-50"
              onClick={() => onNavigate('orders')}
            >
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div 
                  key={order.id} 
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => onNavigate('order-details', undefined, order.id)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-gray-900">{order.id}</span>
                      <Badge 
                        variant={order.status === 'pending' ? 'secondary' : 'default'}
                        className={
                          order.status === 'pending' ? 'bg-orange-100 text-orange-700 hover:bg-orange-100' :
                          order.status === 'processing' ? 'bg-blue-100 text-blue-700 hover:bg-blue-100' :
                          'bg-green-100 text-green-700 hover:bg-green-100'
                        }
                      >
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-1">{order.customer}</p>
                    <div className="flex items-center gap-4 text-gray-500">
                      <span className="flex items-center gap-1">
                        <Package className="w-4 h-4" />
                        {order.items} items
                      </span>
                      <span className="flex items-center gap-1">
                        <Truck className="w-4 h-4" />
                        {order.delivery}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-900">₹{order.amount}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alerts */}
        <Card className="border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                Low Stock Alerts
              </CardTitle>
              <p className="text-gray-600">Products below threshold</p>
            </div>
            <Button 
              variant="ghost" 
              className="text-green-600 hover:text-green-700 hover:bg-green-50"
              onClick={() => onNavigate('inventory')}
            >
              Manage
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockItems.slice(0, 3).map((item) => (
                <div key={item.id} className="p-4 bg-orange-50 rounded-xl border border-orange-200">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-gray-900 mb-1">{item.name}</p>
                      <p className="text-orange-700">
                        {item.stock} units remaining
                      </p>
                    </div>
                    <Badge variant="secondary" className="bg-orange-200 text-orange-800 hover:bg-orange-200">
                      Low Stock
                    </Badge>
                  </div>
                  <div className="w-full bg-orange-200 rounded-full h-2">
                    <div 
                      className="bg-orange-600 h-2 rounded-full transition-all"
                      style={{ width: `${(item.stock / 50) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-orange-600 mt-2">Threshold: 50 units</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
