import { useState, useEffect } from 'react';
import { ArrowLeft, Upload, X, Plus, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { type Page, type Product } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';

interface ProductDetailsProps {
  productId: string | null;
  onNavigate: (page: Page) => void;
  products: Product[];
  updateProduct: (product: Product) => void;
  addProduct: (product: Product) => void;
}

interface Variant {
  id: string;
  size: string;
  price: number;
  stock: number;
}

export function ProductDetails({ productId, onNavigate, products, updateProduct, addProduct }: ProductDetailsProps) {
  const isNewProduct = productId === 'new';
  const existingProduct = products.find(p => p.id === productId);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Vegetables',
    sku: '',
    basePrice: 0,
    discount: 0,
    tax: 5,
    stock: 0,
    lowStockAlert: 50,
    status: true,
    featured: false,
    deliveryToday: true,
    deliveryTomorrow: true,
    delivery23Days: true,
  });

  const [variants, setVariants] = useState<Variant[]>([
    { id: '1', size: '500g', price: 45, stock: 100 },
    { id: '2', size: '1kg', price: 85, stock: 100 },
  ]);

  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1546470427-227ada05e3bd?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=400&h=400&fit=crop',
  ]);

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (existingProduct) {
      setFormData({
        name: existingProduct.name,
        description: existingProduct.description || '',
        category: existingProduct.category,
        sku: existingProduct.sku,
        basePrice: existingProduct.price,
        discount: 0,
        tax: 5,
        stock: existingProduct.stock,
        lowStockAlert: 50,
        status: existingProduct.status,
        featured: false,
        deliveryToday: true,
        deliveryTomorrow: true,
        delivery23Days: true,
      });
      setImages([existingProduct.image]);
    }
  }, [existingProduct]);

  const addVariant = () => {
    setVariants([...variants, { id: Date.now().toString(), size: '', price: 0, stock: 0 }]);
    toast.success('Variant added');
  };

  const removeVariant = (id: string) => {
    if (variants.length > 1) {
      setVariants(variants.filter(v => v.id !== id));
      toast.success('Variant removed');
    } else {
      toast.error('At least one variant is required');
    }
  };

  const updateVariant = (id: string, field: keyof Variant, value: string | number) => {
    setVariants(variants.map(v => v.id === id ? { ...v, [field]: value } : v));
  };

  const handleImageUpload = () => {
    if (images.length >= 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }
    // Simulate image upload
    const newImage = 'https://images.unsplash.com/photo-1546470427-227ada05e3bd?w=400&h=400&fit=crop';
    setImages([...images, newImage]);
    toast.success('Image uploaded successfully');
  };

  const removeImage = (index: number) => {
    if (images.length > 1) {
      setImages(images.filter((_, i) => i !== index));
      toast.success('Image removed');
    } else {
      toast.error('At least one image is required');
    }
  };

  const validate = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.sku.trim()) newErrors.sku = 'SKU is required';
    if (formData.basePrice <= 0) newErrors.basePrice = 'Price must be greater than 0';
    if (formData.stock < 0) newErrors.stock = 'Stock cannot be negative';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) {
      toast.error('Please fix all validation errors');
      return;
    }

    const productData: Product = {
      id: isNewProduct ? Date.now().toString() : productId!,
      name: formData.name,
      sku: formData.sku,
      category: formData.category,
      price: formData.basePrice,
      stock: formData.stock,
      status: formData.status,
      image: images[0],
      description: formData.description,
      variants: variants,
    };

    if (isNewProduct) {
      addProduct(productData);
      toast.success('Product created successfully!');
    } else {
      updateProduct(productData);
      toast.success('Product updated successfully!');
    }
    
    setTimeout(() => {
      onNavigate('catalog');
    }, 1000);
  };

  const finalPrice = formData.basePrice * (1 - formData.discount / 100) * (1 + formData.tax / 100);
  const yourEarnings = finalPrice * 0.85; // After 15% commission

  return (
    <div className="p-8">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => onNavigate('catalog')}
          className="gap-2 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Catalog
        </Button>
        <h1 className="text-gray-900 mb-2">
          {isNewProduct ? 'Add New Product' : 'Edit Product'}
        </h1>
        <p className="text-gray-600">
          {isNewProduct ? 'Create a new product listing' : 'Update product information'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Information */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle>General Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="productName">Product Name *</Label>
                <Input
                  id="productName"
                  placeholder="Enter product name"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: '' });
                  }}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.name}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your product..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) => {
                    setFormData({ ...formData, description: e.target.value });
                    if (errors.description) setErrors({ ...errors, description: '' });
                  }}
                  className={errors.description ? 'border-red-500' : ''}
                />
                {errors.description && (
                  <p className="text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.description}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <select
                    id="category"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option>Vegetables</option>
                    <option>Fruits</option>
                    <option>Dairy</option>
                    <option>Grains</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU *</Label>
                  <Input
                    id="sku"
                    placeholder="Product SKU"
                    value={formData.sku}
                    onChange={(e) => {
                      setFormData({ ...formData, sku: e.target.value.toUpperCase() });
                      if (errors.sku) setErrors({ ...errors, sku: '' });
                    }}
                    className={errors.sku ? 'border-red-500' : ''}
                  />
                  {errors.sku && (
                    <p className="text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.sku}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Variants */}
          <Card className="border-gray-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Product Variants</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addVariant}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Variant
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {variants.map((variant, index) => (
                <div key={variant.id} className="flex items-end gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="flex-1 grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Size/Weight</Label>
                      <Input
                        placeholder="e.g., 500g"
                        value={variant.size}
                        onChange={(e) => updateVariant(variant.id, 'size', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Price (₹)</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={variant.price}
                        onChange={(e) => updateVariant(variant.id, 'price', Number(e.target.value))}
                        min="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Stock</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={variant.stock}
                        onChange={(e) => updateVariant(variant.id, 'stock', Number(e.target.value))}
                        min="0"
                      />
                    </div>
                  </div>
                  {variants.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeVariant(variant.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle>Pricing & Tax</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="basePrice">Base Price (₹) *</Label>
                  <Input
                    id="basePrice"
                    type="number"
                    placeholder="0"
                    value={formData.basePrice}
                    onChange={(e) => {
                      setFormData({ ...formData, basePrice: Number(e.target.value) });
                      if (errors.basePrice) setErrors({ ...errors, basePrice: '' });
                    }}
                    className={errors.basePrice ? 'border-red-500' : ''}
                    min="0"
                  />
                  {errors.basePrice && (
                    <p className="text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.basePrice}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discount">Discount (%)</Label>
                  <Input
                    id="discount"
                    type="number"
                    placeholder="0"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) })}
                    min="0"
                    max="100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tax">Tax (%)</Label>
                  <Input
                    id="tax"
                    type="number"
                    placeholder="0"
                    value={formData.tax}
                    onChange={(e) => setFormData({ ...formData, tax: Number(e.target.value) })}
                    min="0"
                    max="100"
                  />
                </div>
              </div>
              <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Final Price (incl. tax):</span>
                  <span className="text-green-700">₹{finalPrice.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Your Earnings (after 15% commission):</span>
                  <span className="text-green-700">₹{yourEarnings.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Media */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle>Product Media</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4 mb-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <ImageWithFallback
                      src={image}
                      alt={`Product ${index + 1}`}
                      className="w-full h-32 object-cover rounded-xl"
                    />
                    <button 
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    {index === 0 && (
                      <div className="absolute bottom-2 left-2 px-2 py-1 bg-green-600 text-white rounded text-xs">
                        Primary
                      </div>
                    )}
                  </div>
                ))}
                {images.length < 5 && (
                  <button 
                    onClick={handleImageUpload}
                    className="h-32 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-green-500 hover:bg-green-50 transition-colors"
                  >
                    <Upload className="w-6 h-6 text-gray-400" />
                    <span className="text-gray-600">Upload</span>
                  </button>
                )}
              </div>
              <p className="text-gray-500">
                First image will be used as the primary product image. Max 5 images allowed.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle>Status & Visibility</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-gray-900 mb-1">Active</p>
                  <p className="text-gray-600">Product is visible to customers</p>
                </div>
                <Switch 
                  checked={formData.status}
                  onCheckedChange={(checked) => setFormData({ ...formData, status: checked })}
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-gray-900 mb-1">Featured</p>
                  <p className="text-gray-600">Show in featured section</p>
                </div>
                <Switch 
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Delivery Options */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle>Delivery Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-700">Today</span>
                <Switch 
                  checked={formData.deliveryToday}
                  onCheckedChange={(checked) => setFormData({ ...formData, deliveryToday: checked })}
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-700">Tomorrow</span>
                <Switch 
                  checked={formData.deliveryTomorrow}
                  onCheckedChange={(checked) => setFormData({ ...formData, deliveryTomorrow: checked })}
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-700">2-3 Days</span>
                <Switch 
                  checked={formData.delivery23Days}
                  onCheckedChange={(checked) => setFormData({ ...formData, delivery23Days: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Inventory */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle>Inventory Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="totalStock">Total Stock *</Label>
                <Input
                  id="totalStock"
                  type="number"
                  placeholder="0"
                  value={formData.stock}
                  onChange={(e) => {
                    setFormData({ ...formData, stock: Number(e.target.value) });
                    if (errors.stock) setErrors({ ...errors, stock: '' });
                  }}
                  className={errors.stock ? 'border-red-500' : ''}
                  min="0"
                />
                {errors.stock && (
                  <p className="text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.stock}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lowStock">Low Stock Alert</Label>
                <Input
                  id="lowStock"
                  type="number"
                  placeholder="0"
                  value={formData.lowStockAlert}
                  onChange={(e) => setFormData({ ...formData, lowStockAlert: Number(e.target.value) })}
                  min="0"
                />
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button className="w-full bg-green-600 hover:bg-green-700" onClick={handleSave}>
              {isNewProduct ? 'Create Product' : 'Save Changes'}
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => onNavigate('catalog')}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
