import { useState } from 'react';
import { AlertTriangle, TrendingDown, TrendingUp, Download, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { type Product } from '../App';
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
import { Label } from './ui/label';

interface InventoryManagementProps {
  products: Product[];
  updateProduct: (product: Product) => void;
}

export function InventoryManagement({ products, updateProduct }: InventoryManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'low' | 'critical'>('all');
  const [adjustDialogOpen, setAdjustDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [adjustmentAmount, setAdjustmentAmount] = useState(0);
  const [adjustmentType, setAdjustmentType] = useState<'add' | 'remove'>('add');

  const getStockStatus = (current: number, threshold: number = 50) => {
    const percentage = (current / threshold) * 100;
    if (percentage <= 30) return 'critical';
    if (percentage <= 60) return 'low';
    return 'good';
  };

  const filteredItems = products.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === 'all') return matchesSearch;
    
    const status = getStockStatus(item.stock);
    if (filterStatus === 'critical') return matchesSearch && status === 'critical';
    if (filterStatus === 'low') return matchesSearch && (status === 'low' || status === 'critical');
    
    return matchesSearch;
  });

  const stats = {
    totalValue: products.reduce((sum, item) => sum + (item.stock * item.price), 0),
    lowStock: products.filter(item => getStockStatus(item.stock) !== 'good').length,
    outOfStock: products.filter(item => item.stock === 0).length,
  };

  const handleAdjustStock = (product: Product) => {
    setSelectedProduct(product);
    setAdjustmentAmount(0);
    setAdjustmentType('add');
    setAdjustDialogOpen(true);
  };

  const confirmAdjustment = () => {
    if (!selectedProduct) return;

    const newStock = adjustmentType === 'add' 
      ? selectedProduct.stock + adjustmentAmount
      : selectedProduct.stock - adjustmentAmount;

    if (newStock < 0) {
      toast.error('Stock cannot be negative');
      return;
    }

    updateProduct({ ...selectedProduct, stock: newStock });
    toast.success(`Stock ${adjustmentType === 'add' ? 'increased' : 'decreased'} by ${adjustmentAmount} units`);
    setAdjustDialogOpen(false);
    setSelectedProduct(null);
  };

  const handleExport = () => {
    toast.success('Inventory report exported successfully');
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-gray-900 mb-2">Inventory Management</h1>
          <p className="text-gray-600">Track and manage your product stock levels</p>
        </div>
        <Button variant="outline" className="gap-2" onClick={handleExport}>
          <Download className="w-4 h-4" />
          Export Report
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1">Total Inventory Value</p>
                <h2 className="text-gray-900">₹{stats.totalValue.toLocaleString()}</h2>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setFilterStatus('low')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1">Low Stock Items</p>
                <h2 className="text-gray-900">{stats.lowStock}</h2>
              </div>
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setFilterStatus('critical')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1">Out of Stock</p>
                <h2 className="text-gray-900">{stats.outOfStock}</h2>
              </div>
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-gray-200 mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search inventory..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('all')}
                className={filterStatus === 'all' ? 'bg-green-600 hover:bg-green-700' : ''}
              >
                All Items
              </Button>
              <Button
                variant={filterStatus === 'low' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('low')}
                className={filterStatus === 'low' ? 'bg-orange-600 hover:bg-orange-700' : ''}
              >
                Low Stock
              </Button>
              <Button
                variant={filterStatus === 'critical' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('critical')}
                className={filterStatus === 'critical' ? 'bg-red-600 hover:bg-red-700' : ''}
              >
                Critical
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card className="border-gray-200">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-gray-600">Product</th>
                  <th className="px-6 py-4 text-left text-gray-600">SKU</th>
                  <th className="px-6 py-4 text-left text-gray-600">Current Stock</th>
                  <th className="px-6 py-4 text-left text-gray-600">Stock Level</th>
                  <th className="px-6 py-4 text-left text-gray-600">Status</th>
                  <th className="px-6 py-4 text-left text-gray-600">Value</th>
                  <th className="px-6 py-4 text-left text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      No products found. Try adjusting your search or filters.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => {
                    const status = getStockStatus(item.stock);
                    const threshold = 50;
                    const percentage = Math.min((item.stock / threshold) * 100, 100);
                    
                    return (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <ImageWithFallback
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <span className="text-gray-900">{item.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{item.sku}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-900">{item.stock} units</span>
                            {item.stock > threshold ? (
                              <TrendingUp className="w-4 h-4 text-green-600" />
                            ) : (
                              <TrendingDown className="w-4 h-4 text-red-600" />
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            <div className="w-32">
                              <Progress 
                                value={percentage} 
                                className={`h-2 ${
                                  status === 'critical' ? '[&>div]:bg-red-600' :
                                  status === 'low' ? '[&>div]:bg-orange-600' :
                                  '[&>div]:bg-green-600'
                                }`}
                              />
                            </div>
                            <span className="text-gray-500">{Math.round(percentage)}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            className={
                              status === 'critical' ? 'bg-red-100 text-red-700 hover:bg-red-100' :
                              status === 'low' ? 'bg-orange-100 text-orange-700 hover:bg-orange-100' :
                              'bg-green-100 text-green-700 hover:bg-green-100'
                            }
                          >
                            {status === 'critical' ? 'Critical' : status === 'low' ? 'Low Stock' : 'Good'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-gray-900">
                          ₹{(item.stock * item.price).toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleAdjustStock(item)}
                          >
                            Adjust Stock
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Adjust Stock Dialog */}
      <Dialog open={adjustDialogOpen} onOpenChange={setAdjustDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust Stock - {selectedProduct?.name}</DialogTitle>
            <DialogDescription>
              Current stock: {selectedProduct?.stock} units
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Adjustment Type</Label>
              <div className="flex gap-3">
                <Button
                  variant={adjustmentType === 'add' ? 'default' : 'outline'}
                  onClick={() => setAdjustmentType('add')}
                  className={adjustmentType === 'add' ? 'bg-green-600 hover:bg-green-700 flex-1' : 'flex-1'}
                >
                  Add Stock
                </Button>
                <Button
                  variant={adjustmentType === 'remove' ? 'default' : 'outline'}
                  onClick={() => setAdjustmentType('remove')}
                  className={adjustmentType === 'remove' ? 'bg-red-600 hover:bg-red-700 flex-1' : 'flex-1'}
                >
                  Remove Stock
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Quantity</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={adjustmentAmount}
                onChange={(e) => setAdjustmentAmount(Number(e.target.value))}
                min="0"
              />
            </div>
            {selectedProduct && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <p className="text-blue-800">
                  New stock level: {adjustmentType === 'add' 
                    ? selectedProduct.stock + adjustmentAmount 
                    : selectedProduct.stock - adjustmentAmount} units
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAdjustDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              className={adjustmentType === 'add' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
              onClick={confirmAdjustment}
              disabled={adjustmentAmount <= 0}
            >
              Confirm Adjustment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
