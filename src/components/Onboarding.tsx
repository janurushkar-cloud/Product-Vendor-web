import { useState } from 'react';
import { Check, Building2, CreditCard, FileText, CheckCircle2, Upload, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { type Page } from '../App';
import { toast } from 'sonner@2.0.3';

interface OnboardingProps {
  onNavigate: (page: Page) => void;
}

type Step = 'business' | 'bank' | 'documents' | 'terms';

interface FormData {
  businessName: string;
  taxId: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  contact: string;
  email: string;
  accountName: string;
  accountNumber: string;
  confirmAccount: string;
  ifsc: string;
  bankName: string;
  branch: string;
  accountType: string;
}

export function Onboarding({ onNavigate }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState<Step>('business');
  const [uploadedDocs, setUploadedDocs] = useState<{ [key: string]: boolean }>({});
  const [termsAccepted, setTermsAccepted] = useState({
    terms1: false,
    terms2: false,
    terms3: false,
  });

  const [formData, setFormData] = useState<FormData>({
    businessName: '',
    taxId: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    contact: '',
    email: '',
    accountName: '',
    accountNumber: '',
    confirmAccount: '',
    ifsc: '',
    bankName: '',
    branch: '',
    accountType: '',
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  const steps = [
    { id: 'business' as Step, label: 'Business Details', icon: Building2 },
    { id: 'bank' as Step, label: 'Bank Information', icon: CreditCard },
    { id: 'documents' as Step, label: 'Document Upload', icon: FileText },
    { id: 'terms' as Step, label: 'Terms & Conditions', icon: CheckCircle2 },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  const validateBusinessDetails = () => {
    const newErrors: Partial<FormData> = {};
    if (!formData.businessName.trim()) newErrors.businessName = 'Business name is required';
    if (!formData.taxId.trim()) newErrors.taxId = 'Tax ID is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.pincode.trim() || !/^\d{6}$/.test(formData.pincode)) newErrors.pincode = 'Valid 6-digit PIN code required';
    if (!formData.contact.trim() || !/^\+?\d{10,}$/.test(formData.contact.replace(/\s/g, ''))) newErrors.contact = 'Valid contact number required';
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Valid email required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateBankDetails = () => {
    const newErrors: Partial<FormData> = {};
    if (!formData.accountName.trim()) newErrors.accountName = 'Account holder name is required';
    if (!formData.accountNumber.trim() || !/^\d{9,18}$/.test(formData.accountNumber)) newErrors.accountNumber = 'Valid account number required';
    if (formData.accountNumber !== formData.confirmAccount) newErrors.confirmAccount = 'Account numbers do not match';
    if (!formData.ifsc.trim() || !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifsc)) newErrors.ifsc = 'Valid IFSC code required';
    if (!formData.bankName.trim()) newErrors.bankName = 'Bank name is required';
    if (!formData.branch.trim()) newErrors.branch = 'Branch name is required';
    if (!formData.accountType) newErrors.accountType = 'Account type is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateDocuments = () => {
    if (!uploadedDocs.license || !uploadedDocs.gst || !uploadedDocs.id) {
      toast.error('Please upload all required documents');
      return false;
    }
    return true;
  };

  const validateTerms = () => {
    if (!termsAccepted.terms1 || !termsAccepted.terms2 || !termsAccepted.terms3) {
      toast.error('Please accept all terms and conditions');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    let isValid = true;

    if (currentStep === 'business') {
      isValid = validateBusinessDetails();
      if (!isValid) {
        toast.error('Please fill all required fields correctly');
        return;
      }
    } else if (currentStep === 'bank') {
      isValid = validateBankDetails();
      if (!isValid) {
        toast.error('Please fill all bank details correctly');
        return;
      }
    } else if (currentStep === 'documents') {
      isValid = validateDocuments();
      if (!isValid) return;
    } else if (currentStep === 'terms') {
      isValid = validateTerms();
      if (!isValid) return;
    }

    if (currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1].id);
      toast.success('Progress saved');
    } else {
      toast.success('Onboarding completed successfully!');
      setTimeout(() => {
        onNavigate('dashboard');
      }, 1500);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1].id);
    }
  };

  const handleFileUpload = (docType: string) => {
    // Simulate file upload
    setUploadedDocs({ ...uploadedDocs, [docType]: true });
    toast.success(`${docType.charAt(0).toUpperCase() + docType.slice(1)} document uploaded successfully`);
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData({ ...formData, [field]: value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  return (
    <div className="min-h-full bg-gradient-to-br from-green-50 to-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-gray-900 mb-2">Vendor Onboarding</h1>
          <p className="text-gray-600">Complete these steps to start selling on our platform</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = index < currentStepIndex;
              const isCurrent = step.id === currentStep;
              
              return (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center mb-2 transition-all cursor-pointer ${
                        isCompleted
                          ? 'bg-green-600 text-white'
                          : isCurrent
                          ? 'bg-green-600 text-white ring-4 ring-green-100'
                          : 'bg-gray-200 text-gray-400'
                      }`}
                      onClick={() => {
                        if (index < currentStepIndex) {
                          setCurrentStep(step.id);
                        }
                      }}
                    >
                      {isCompleted ? <Check className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                    </div>
                    <p className={`text-center ${isCurrent ? 'text-gray-900' : 'text-gray-600'}`}>
                      {step.label}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`h-1 flex-1 mx-4 mb-8 rounded-full ${
                      isCompleted ? 'bg-green-600' : 'bg-gray-200'
                    }`}></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <Card className="border-gray-200 shadow-lg">
          <CardContent className="p-8">
            {currentStep === 'business' && (
              <div className="space-y-6">
                <h2 className="text-gray-900 mb-6">Business Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name *</Label>
                    <Input 
                      id="businessName" 
                      placeholder="Enter your business name" 
                      value={formData.businessName}
                      onChange={(e) => handleInputChange('businessName', e.target.value)}
                      className={errors.businessName ? 'border-red-500' : ''}
                    />
                    {errors.businessName && (
                      <p className="text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.businessName}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="taxId">Tax ID / GSTIN *</Label>
                    <Input 
                      id="taxId" 
                      placeholder="Enter GST number" 
                      value={formData.taxId}
                      onChange={(e) => handleInputChange('taxId', e.target.value.toUpperCase())}
                      className={errors.taxId ? 'border-red-500' : ''}
                    />
                    {errors.taxId && (
                      <p className="text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.taxId}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Business Address *</Label>
                    <Input 
                      id="address" 
                      placeholder="Street address" 
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className={errors.address ? 'border-red-500' : ''}
                    />
                    {errors.address && (
                      <p className="text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.address}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input 
                      id="city" 
                      placeholder="City" 
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className={errors.city ? 'border-red-500' : ''}
                    />
                    {errors.city && (
                      <p className="text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.city}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input 
                      id="state" 
                      placeholder="State" 
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      className={errors.state ? 'border-red-500' : ''}
                    />
                    {errors.state && (
                      <p className="text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.state}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pincode">PIN Code *</Label>
                    <Input 
                      id="pincode" 
                      placeholder="PIN code" 
                      value={formData.pincode}
                      onChange={(e) => handleInputChange('pincode', e.target.value)}
                      maxLength={6}
                      className={errors.pincode ? 'border-red-500' : ''}
                    />
                    {errors.pincode && (
                      <p className="text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.pincode}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact">Contact Number *</Label>
                    <Input 
                      id="contact" 
                      placeholder="+91" 
                      value={formData.contact}
                      onChange={(e) => handleInputChange('contact', e.target.value)}
                      className={errors.contact ? 'border-red-500' : ''}
                    />
                    {errors.contact && (
                      <p className="text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.contact}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="business@example.com" 
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={errors.email ? 'border-red-500' : ''}
                    />
                    {errors.email && (
                      <p className="text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 'bank' && (
              <div className="space-y-6">
                <h2 className="text-gray-900 mb-6">Bank Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="accountName">Account Holder Name *</Label>
                    <Input 
                      id="accountName" 
                      placeholder="As per bank records" 
                      value={formData.accountName}
                      onChange={(e) => handleInputChange('accountName', e.target.value)}
                      className={errors.accountName ? 'border-red-500' : ''}
                    />
                    {errors.accountName && (
                      <p className="text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.accountName}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accountNumber">Account Number *</Label>
                    <Input 
                      id="accountNumber" 
                      placeholder="Enter account number" 
                      value={formData.accountNumber}
                      onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                      className={errors.accountNumber ? 'border-red-500' : ''}
                    />
                    {errors.accountNumber && (
                      <p className="text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.accountNumber}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmAccount">Confirm Account Number *</Label>
                    <Input 
                      id="confirmAccount" 
                      placeholder="Re-enter account number" 
                      value={formData.confirmAccount}
                      onChange={(e) => handleInputChange('confirmAccount', e.target.value)}
                      className={errors.confirmAccount ? 'border-red-500' : ''}
                    />
                    {errors.confirmAccount && (
                      <p className="text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.confirmAccount}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ifsc">IFSC Code *</Label>
                    <Input 
                      id="ifsc" 
                      placeholder="Enter IFSC code" 
                      value={formData.ifsc}
                      onChange={(e) => handleInputChange('ifsc', e.target.value.toUpperCase())}
                      className={errors.ifsc ? 'border-red-500' : ''}
                    />
                    {errors.ifsc && (
                      <p className="text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.ifsc}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bankName">Bank Name *</Label>
                    <Input 
                      id="bankName" 
                      placeholder="Bank name" 
                      value={formData.bankName}
                      onChange={(e) => handleInputChange('bankName', e.target.value)}
                      className={errors.bankName ? 'border-red-500' : ''}
                    />
                    {errors.bankName && (
                      <p className="text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.bankName}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="branch">Branch Name *</Label>
                    <Input 
                      id="branch" 
                      placeholder="Branch name" 
                      value={formData.branch}
                      onChange={(e) => handleInputChange('branch', e.target.value)}
                      className={errors.branch ? 'border-red-500' : ''}
                    />
                    {errors.branch && (
                      <p className="text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.branch}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accountType">Account Type *</Label>
                    <select 
                      id="accountType" 
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                        errors.accountType ? 'border-red-500' : 'border-gray-200'
                      }`}
                      value={formData.accountType}
                      onChange={(e) => handleInputChange('accountType', e.target.value)}
                    >
                      <option value="">Select account type</option>
                      <option value="savings">Savings</option>
                      <option value="current">Current</option>
                    </select>
                    {errors.accountType && (
                      <p className="text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.accountType}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <p className="text-blue-800">
                    💡 Ensure all bank details are accurate. Payments will be processed to this account.
                  </p>
                </div>
              </div>
            )}

            {currentStep === 'documents' && (
              <div className="space-y-6">
                <h2 className="text-gray-900 mb-6">Document Upload</h2>
                <div className="space-y-4">
                  {[
                    { id: 'license', label: 'Business License', required: true },
                    { id: 'gst', label: 'GST Certificate', required: true },
                    { id: 'id', label: 'ID Proof (Aadhaar/PAN)', required: true },
                    { id: 'cancelled', label: 'Cancelled Cheque', required: false },
                  ].map((doc) => (
                    <div key={doc.id} className={`p-6 border-2 border-dashed rounded-xl hover:border-green-500 transition-colors ${
                      uploadedDocs[doc.id] ? 'border-green-500 bg-green-50' : 'border-gray-300'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <FileText className={`w-5 h-5 ${uploadedDocs[doc.id] ? 'text-green-600' : 'text-gray-400'}`} />
                            <span className="text-gray-900">{doc.label}</span>
                            {doc.required && <span className="text-red-600">*</span>}
                          </div>
                          {uploadedDocs[doc.id] && (
                            <div className="flex items-center gap-2 text-green-600">
                              <Check className="w-4 h-4" />
                              <span>Uploaded successfully</span>
                            </div>
                          )}
                        </div>
                        <Button
                          variant={uploadedDocs[doc.id] ? 'outline' : 'default'}
                          className={uploadedDocs[doc.id] ? '' : 'bg-green-600 hover:bg-green-700'}
                          onClick={() => handleFileUpload(doc.id)}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          {uploadedDocs[doc.id] ? 'Change' : 'Upload'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-xl">
                  <p className="text-orange-800">
                    📄 Accepted formats: PDF, JPG, PNG (Max 5MB per file)
                  </p>
                </div>
              </div>
            )}

            {currentStep === 'terms' && (
              <div className="space-y-6">
                <h2 className="text-gray-900 mb-6">Terms & Conditions</h2>
                <div className="p-6 bg-gray-50 rounded-xl max-h-96 overflow-y-auto border border-gray-200">
                  <h3 className="text-gray-900 mb-4">Vendor Agreement</h3>
                  <div className="space-y-4 text-gray-600">
                    <p>
                      By accepting these terms, you agree to the following conditions for selling on our platform:
                    </p>
                    <ol className="list-decimal list-inside space-y-3">
                      <li>You will provide accurate product information and maintain quality standards.</li>
                      <li>You agree to fulfill orders within the promised delivery timeframes (Today, Tomorrow, or 2-3 Days).</li>
                      <li>Platform commission: 15% on each successful order.</li>
                      <li>Payment settlement: Within 7 business days after delivery confirmation.</li>
                      <li>You are responsible for managing inventory and updating stock levels.</li>
                      <li>You will handle product packaging as per platform guidelines.</li>
                      <li>Customer returns must be processed within 48 hours of request.</li>
                      <li>You agree to maintain a minimum 90% order fulfillment rate.</li>
                      <li>Platform reserves the right to suspend accounts violating terms.</li>
                      <li>All disputes will be resolved as per platform policies.</li>
                    </ol>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className={`flex items-start gap-3 p-4 rounded-xl border transition-colors ${
                    termsAccepted.terms1 ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
                  }`}>
                    <Checkbox 
                      id="terms1" 
                      className="mt-1" 
                      checked={termsAccepted.terms1}
                      onCheckedChange={(checked) => setTermsAccepted({ ...termsAccepted, terms1: checked as boolean })}
                    />
                    <label htmlFor="terms1" className="text-gray-700 cursor-pointer">
                      I have read and agree to the Vendor Terms & Conditions
                    </label>
                  </div>
                  <div className={`flex items-start gap-3 p-4 rounded-xl border transition-colors ${
                    termsAccepted.terms2 ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
                  }`}>
                    <Checkbox 
                      id="terms2" 
                      className="mt-1" 
                      checked={termsAccepted.terms2}
                      onCheckedChange={(checked) => setTermsAccepted({ ...termsAccepted, terms2: checked as boolean })}
                    />
                    <label htmlFor="terms2" className="text-gray-700 cursor-pointer">
                      I confirm that all information provided is accurate and complete
                    </label>
                  </div>
                  <div className={`flex items-start gap-3 p-4 rounded-xl border transition-colors ${
                    termsAccepted.terms3 ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
                  }`}>
                    <Checkbox 
                      id="terms3" 
                      className="mt-1" 
                      checked={termsAccepted.terms3}
                      onCheckedChange={(checked) => setTermsAccepted({ ...termsAccepted, terms3: checked as boolean })}
                    />
                    <label htmlFor="terms3" className="text-gray-700 cursor-pointer">
                      I agree to the commission structure and payment terms
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStepIndex === 0}
                className={currentStepIndex === 0 ? 'invisible' : ''}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={handleNext}
                className="bg-green-600 hover:bg-green-700"
              >
                {currentStepIndex === steps.length - 1 ? 'Complete Onboarding' : 'Continue'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
