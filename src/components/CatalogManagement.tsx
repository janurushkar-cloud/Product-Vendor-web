import { useState } from 'react';
import { Search, Plus, Edit2, Eye, EyeOff, MoreVertical, Upload, Trash2, Copy } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { type Page, type Product } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

interface CatalogManagementProps {
  onNavigate: (page: Page, productId?: string) => void;
  products: Product[];
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
}

export function CatalogManagement({ onNavigate, products, updateProduct, deleteProduct }: CatalogManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [bulkUploadOpen, setBulkUploadOpen] = useState(false);

  const categories = ['all', 'Vegetables', 'Fruits', 'Dairy', 'Grains'];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handlePriceChange = (productId: string, newPrice: number) => {
    const product = products.find(p => p.id === productId);
    if (product && newPrice >= 0) {
      updateProduct({ ...product, price: newPrice });
      toast.success('Price updated successfully');
    }
  };

  const handleStockChange = (productId: string, newStock: number) => {
    const product = products.find(p => p.id === productId);
    if (product && newStock >= 0) {
      updateProduct({ ...product, stock: newStock });
      toast.success('Stock updated successfully');
    }
  };

  const handleStatusToggle = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      updateProduct({ ...product, status: !product.status });
      toast.success(product.status ? 'Product deactivated' : 'Product activated');
    }
  };

  const handleDeleteProduct = (product: Product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      deleteProduct(productToDelete.id);
      toast.success(`${productToDelete.name} deleted successfully`);
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const handleDuplicateProduct = (product: Product) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      name: `${product.name} (Copy)`,
      sku: `${product.sku}-COPY`,
    };
    // Note: In real app, this would call addProduct
    toast.success('Product duplicated successfully');
  };

  const handleBulkUpload = () => {
    setBulkUploadOpen(true);
  };

  const processBulkUpload = () => {
    // Simulate bulk upload
    toast.success('Bulk upload completed. 15 products added successfully.');
    setBulkUploadOpen(false);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-gray-900 mb-2">Catalog Management</h1>
          <p className="text-gray-600">Manage your product listings and inventory</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2" onClick={handleBulkUpload}>
            <Upload className="w-4 h-4" />
            Bulk Upload
          </Button>
          <Button 
            className="bg-green-600 hover:bg-green-700 gap-2"
            onClick={() => onNavigate('product-details', 'new')}
          >
            <Plus className="w-4 h-4" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-gray-200 mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search by name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  onClick={() => {
                    setSelectedCategory(category);
                    toast.success(`Filtered by: ${category}`);
                  }}
                  className={selectedCategory === category ? 'bg-green-600 hover:bg-green-700' : ''}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card className="border-gray-200">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-gray-600">Product</th>
                  <th className="px-6 py-4 text-left text-gray-600">SKU</th>
                  <th className="px-6 py-4 text-left text-gray-600">Category</th>
                  <th className="px-6 py-4 text-left text-gray-600">Price (₹)</th>
                  <th className="px-6 py-4 text-left text-gray-600">Stock</th>
                  <th className="px-6 py-4 text-left text-gray-600">Status</th>
                  <th className="px-6 py-4 text-left text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      No products found. Try adjusting your search or filters.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <ImageWithFallback
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <span className="text-gray-900">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{product.sku}</td>
                      <td className="px-6 py-4">
                        <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">
                          {product.category}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          value={product.price}
                          onChange={(e) => handlePriceChange(product.id, Number(e.target.value))}
                          className="w-24 px-3 py-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          min="0"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          value={product.stock}
                          onChange={(e) => handleStockChange(product.id, Number(e.target.value))}
                          className={`w-24 px-3 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                            product.stock < 50 ? 'border-orange-300 bg-orange-50' : 'border-gray-200'
                          }`}
                          min="0"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Switch 
                            checked={product.status}
                            onCheckedChange={() => handleStatusToggle(product.id)}
                          />
                          {product.status ? (
                            <Eye className="w-4 h-4 text-green-600" />
                          ) : (
                            <EyeOff className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onNavigate('product-details', product.id)}
                            title="Edit Product"
                          >
                            <Edit2 className="w-4 h-4 text-gray-600" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="w-4 h-4 text-gray-600" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleDuplicateProduct(product)}>
                                <Copy className="w-4 h-4 mr-2" />
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDeleteProduct(product)}
                                className="text-red-600"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{productToDelete?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Upload Dialog */}
      <Dialog open={bulkUploadOpen} onOpenChange={setBulkUploadOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Upload Products</DialogTitle>
            <DialogDescription>
              Upload a CSV file to add multiple products at once
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-green-500 transition-colors cursor-pointer text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-900 mb-2">Click to upload or drag and drop</p>
              <p className="text-gray-600">CSV file (max 10MB)</p>
            </div>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-blue-800 mb-2">📥 Download CSV Template</p>
              <p className="text-blue-600">Get the correct format for bulk upload</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkUploadOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-green-600 hover:bg-green-700" onClick={processBulkUpload}>
              Upload Products
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
