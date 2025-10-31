import { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Onboarding } from './components/Onboarding';
import { CatalogManagement } from './components/CatalogManagement';
import { ProductDetails } from './components/ProductDetails';
import { InventoryManagement } from './components/InventoryManagement';
import { OrderFulfillment } from './components/OrderFulfillment';
import { OrderDetails } from './components/OrderDetails';
import { ReportsAnalytics } from './components/ReportsAnalytics';
import { Support } from './components/Support';
import { Toaster } from './components/ui/sonner';

export type Page = 
  | 'dashboard' 
  | 'onboarding' 
  | 'catalog' 
  | 'product-details'
  | 'inventory' 
  | 'orders' 
  | 'order-details'
  | 'reports' 
  | 'support';

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  status: boolean;
  image: string;
  description?: string;
  variants?: Array<{ id: string; size: string; price: number; stock: number }>;
}

export interface Order {
  id: string;
  customer: string;
  phone: string;
  items: number;
  amount: number;
  delivery: string;
  paymentMode: string;
  status: string;
  date: string;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Global state for products and orders
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Organic Tomatoes',
      sku: 'VEG-TOM-001',
      category: 'Vegetables',
      price: 45,
      stock: 150,
      status: true,
      image: 'https://images.unsplash.com/photo-1546470427-227ada05e3bd?w=200&h=200&fit=crop',
      description: 'Fresh organic tomatoes, locally sourced from certified farms.',
    },
    {
      id: '2',
      name: 'Fresh Spinach',
      sku: 'VEG-SPN-002',
      category: 'Vegetables',
      price: 30,
      stock: 85,
      status: true,
      image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=200&h=200&fit=crop',
      description: 'Nutrient-rich fresh spinach leaves.',
    },
    {
      id: '3',
      name: 'Green Beans',
      sku: 'VEG-BEN-003',
      category: 'Vegetables',
      price: 55,
      stock: 120,
      status: true,
      image: 'https://images.unsplash.com/photo-1594317526002-18f4068f1a94?w=200&h=200&fit=crop',
      description: 'Crisp and fresh green beans.',
    },
    {
      id: '4',
      name: 'Organic Carrots',
      sku: 'VEG-CAR-004',
      category: 'Vegetables',
      price: 40,
      stock: 95,
      status: false,
      image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=200&h=200&fit=crop',
      description: 'Sweet and crunchy organic carrots.',
    },
    {
      id: '5',
      name: 'Red Capsicum',
      sku: 'VEG-CAP-005',
      category: 'Vegetables',
      price: 80,
      stock: 60,
      status: true,
      image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=200&h=200&fit=crop',
      description: 'Vibrant red capsicum, rich in vitamins.',
    },
    {
      id: '6',
      name: 'Fresh Broccoli',
      sku: 'VEG-BRO-006',
      category: 'Vegetables',
      price: 65,
      stock: 45,
      status: true,
      image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=200&h=200&fit=crop',
      description: 'Healthy and fresh broccoli florets.',
    },
  ]);

  const [orders, setOrders] = useState<Order[]>([
    { id: 'ORD-1234', customer: 'Rajesh Kumar', phone: '+91 98765 43210', items: 3, amount: 1250, delivery: 'Today', paymentMode: 'Prepaid', status: 'pending', date: '2025-10-31 09:30 AM' },
    { id: 'ORD-1235', customer: 'Priya Sharma', phone: '+91 98765 43211', items: 5, amount: 2100, delivery: 'Tomorrow', paymentMode: 'COD', status: 'processing', date: '2025-10-31 10:15 AM' },
    { id: 'ORD-1236', customer: 'Amit Patel', phone: '+91 98765 43212', items: 2, amount: 890, delivery: 'Today', paymentMode: 'Prepaid', status: 'shipped', date: '2025-10-30 04:20 PM' },
    { id: 'ORD-1237', customer: 'Sneha Desai', phone: '+91 98765 43213', items: 4, amount: 1560, delivery: '2-3 Days', paymentMode: 'Prepaid', status: 'pending', date: '2025-10-31 11:00 AM' },
    { id: 'ORD-1238', customer: 'Vikram Singh', phone: '+91 98765 43214', items: 1, amount: 450, delivery: 'Tomorrow', paymentMode: 'COD', status: 'delivered', date: '2025-10-29 02:30 PM' },
    { id: 'ORD-1239', customer: 'Ananya Reddy', phone: '+91 98765 43215', items: 6, amount: 2850, delivery: '2-3 Days', paymentMode: 'Prepaid', status: 'cancelled', date: '2025-10-30 01:45 PM' },
  ]);

  const handleNavigate = (page: Page, productId?: string, orderId?: string) => {
    setCurrentPage(page);
    if (productId !== undefined) setSelectedProductId(productId);
    if (orderId !== undefined) setSelectedOrderId(orderId);
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const addProduct = (newProduct: Product) => {
    setProducts([...products, newProduct]);
  };

  const deleteProduct = (productId: string) => {
    setProducts(products.filter(p => p.id !== productId));
  };

  const updateOrder = (updatedOrder: Order) => {
    setOrders(orders.map(o => o.id === updatedOrder.id ? updatedOrder : o));
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} products={products} orders={orders} />;
      case 'onboarding':
        return <Onboarding onNavigate={handleNavigate} />;
      case 'catalog':
        return <CatalogManagement onNavigate={handleNavigate} products={products} updateProduct={updateProduct} deleteProduct={deleteProduct} />;
      case 'product-details':
        return <ProductDetails productId={selectedProductId} onNavigate={handleNavigate} products={products} updateProduct={updateProduct} addProduct={addProduct} />;
      case 'inventory':
        return <InventoryManagement products={products} updateProduct={updateProduct} />;
      case 'orders':
        return <OrderFulfillment onNavigate={handleNavigate} orders={orders} updateOrder={updateOrder} />;
      case 'order-details':
        return <OrderDetails orderId={selectedOrderId} onNavigate={handleNavigate} orders={orders} updateOrder={updateOrder} />;
      case 'reports':
        return <ReportsAnalytics orders={orders} products={products} />;
      case 'support':
        return <Support />;
      default:
        return <Dashboard onNavigate={handleNavigate} products={products} orders={orders} />;
    }
  };

  return (
    < >
      <Layout currentPage={currentPage} onNavigate={handleNavigate}>
        {renderPage()}
      </Layout>
      <Toaster />
    </>
  );
}
