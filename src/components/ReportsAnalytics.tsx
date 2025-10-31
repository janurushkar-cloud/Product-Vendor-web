import { useState } from 'react';
import { Download, TrendingUp, Package, DollarSign, ShoppingCart, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { type Order, type Product } from '../App';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { toast } from 'sonner@2.0.3';

interface ReportsAnalyticsProps {
  orders: Order[];
  products: Product[];
}

const salesData = [
  { date: 'Oct 24', revenue: 4200, orders: 24 },
  { date: 'Oct 25', revenue: 5100, orders: 28 },
  { date: 'Oct 26', revenue: 3800, orders: 22 },
  { date: 'Oct 27', revenue: 6200, orders: 35 },
  { date: 'Oct 28', revenue: 7500, orders: 42 },
  { date: 'Oct 29', revenue: 8900, orders: 48 },
  { date: 'Oct 30', revenue: 6700, orders: 38 },
  { date: 'Oct 31', revenue: 9200, orders: 52 },
];

const cancellationReasons = [
  { reason: 'Out of Stock', count: 8, percentage: 32 },
  { reason: 'Customer Request', count: 6, percentage: 24 },
  { reason: 'Wrong Address', count: 5, percentage: 20 },
  { reason: 'Payment Failed', count: 4, percentage: 16 },
  { reason: 'Others', count: 2, percentage: 8 },
];

export function ReportsAnalytics({ orders, products }: ReportsAnalyticsProps) {
  const [dateRange, setDateRange] = useState('7days');

  const totalSales = orders.reduce((sum, o) => sum + o.amount, 0);
  const totalOrders = orders.length;
  const totalProductsSold = orders.reduce((sum, o) => sum + o.items, 0);
  const cancelledOrders = orders.filter(o => o.status === 'cancelled').length;
  const cancellationRate = totalOrders > 0 ? ((cancelledOrders / totalOrders) * 100).toFixed(1) : '0';

  const deliveryData = [
    { name: 'Today', value: orders.filter(o => o.delivery === 'Today').length, color: '#22c55e' },
    { name: 'Tomorrow', value: orders.filter(o => o.delivery === 'Tomorrow').length, color: '#3b82f6' },
    { name: '2-3 Days', value: orders.filter(o => o.delivery === '2-3 Days').length, color: '#a855f7' },
  ];

  // Calculate top products from orders
  const productSales = products.map(product => ({
    name: product.name,
    sales: Math.floor(Math.random() * 200) + 50, // Mock data
    revenue: Math.floor(Math.random() * 10000) + 5000,
    trend: `+${Math.floor(Math.random() * 20) + 5}%`,
  })).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

  const stats = [
    {
      title: 'Total Sales',
      value: `₹${totalSales.toLocaleString()}`,
      change: '+18.2%',
      icon: DollarSign,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      title: 'Total Orders',
      value: totalOrders.toString(),
      change: '+12.5%',
      icon: ShoppingCart,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      title: 'Products Sold',
      value: totalProductsSold.toString(),
      change: '+8.7%',
      icon: Package,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      title: 'Cancellation Rate',
      value: `${cancellationRate}%`,
      change: '-2.1%',
      icon: XCircle,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
  ];

  const handleExport = (format: 'pdf' | 'excel') => {
    toast.success(`Report exported as ${format.toUpperCase()}`);
  };

  const handleDateRangeChange = (range: string) => {
    setDateRange(range);
    toast.success(`Date range updated to: ${range.replace('days', ' days').replace('months', ' months')}`);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-gray-900 mb-2">Reports & Analytics</h1>
          <p className="text-gray-600">Track your business performance and insights</p>
        </div>
        <div className="flex gap-3">
          <select
            value={dateRange}
            onChange={(e) => handleDateRangeChange(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="3months">Last 3 Months</option>
            <option value="year">This Year</option>
          </select>
          <Button variant="outline" className="gap-2" onClick={() => handleExport('pdf')}>
            <Download className="w-4 h-4" />
            Export PDF
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => handleExport('excel')}>
            <Download className="w-4 h-4" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-600 mb-1">{stat.title}</p>
                    <h2 className="text-gray-900 mb-2">{stat.value}</h2>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className={stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                        {stat.change}
                      </span>
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
        {/* Revenue & Orders Chart */}
        <Card className="lg:col-span-2 border-gray-200">
          <CardHeader>
            <CardTitle>Sales Performance</CardTitle>
            <p className="text-gray-600">Revenue and order trends</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis yAxisId="left" stroke="#9ca3af" />
                <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={{ fill: '#22c55e', r: 4 }}
                  name="Revenue (₹)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="orders"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', r: 4 }}
                  name="Orders"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Delivery Mix */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle>Delivery Type Distribution</CardTitle>
            <p className="text-gray-600">Order breakdown by delivery time</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={deliveryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
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
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
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
        {/* Top Selling Products */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
            <p className="text-gray-600">Best performing products this period</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {productSales.map((product, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 mb-1">{product.name}</p>
                    <p className="text-gray-600">{product.sales} units sold</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-900 mb-1">₹{product.revenue.toLocaleString()}</p>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                      {product.trend}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Cancellation Analysis */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle>Cancellation Reasons</CardTitle>
            <p className="text-gray-600">Analysis of order cancellations</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cancellationReasons.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">{item.reason}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-600">{item.count} orders</span>
                      <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                        {item.percentage}%
                      </Badge>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-orange-600 h-2 rounded-full transition-all"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-xl">
              <p className="text-orange-800">
                💡 Focus on inventory management to reduce "Out of Stock" cancellations
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
