import React, { useEffect, useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { X, Download, BookOpen, CreditCard, CheckCircle, TrendingUp } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'pdf' | 'analytics';
  onSuccess: () => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, type, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'failed'>('pending');

  // Function to load Razorpay script dynamically
  const loadRazorpayScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (typeof window.Razorpay !== 'undefined') {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Razorpay script'));
      document.head.appendChild(script);
    });
  };

  const getPaymentDetails = () => {
    if (type === 'pdf') {
      return {
        title: 'Export to PDF',
        description: 'Get a beautiful, formatted PDF of your college preferences and analysis',
        amount: 500, // ₹5 in paise
        icon: <Download className="w-8 h-8 text-blue-500" />,
        features: [
          'Professional PDF format',
          'Complete college list',
          'Analytics summary',
          'Ready for printing',
          'Lifetime access - download unlimited times'
        ]
      };
    } else {
      return {
        title: 'Access Analytics & Recommendations',
        description: 'Unlock advanced analytics, recommendations, and expert insights',
        amount: 500, // ₹5 in paise
        icon: <TrendingUp className="w-8 h-8 text-purple-500" />,
        features: [
          'Advanced Analytics Dashboard',
          'Smart Recommendations',
          'Real-time Probability Analysis',
          'Historical Data Insights',
          'Lifetime access - use unlimited times'
        ]
      };
    }
  };

  const handlePayment = async () => {
    setIsLoading(true);
    
    try {
      // Demo mode - simulate payment success
      if (process.env.NODE_ENV === 'development') {
        console.log('Demo mode: Simulating payment success');
        setTimeout(() => {
          setPaymentStatus('success');
          localStorage.setItem(`paid_${type}`, 'true');
          setTimeout(() => {
            onSuccess();
            onClose();
          }, 1000);
        }, 1500);
        return;
      }

      // Load Razorpay script if not already loaded
      await loadRazorpayScript();

      // In a real app, you'd make an API call to your backend to create the order
      // For now, we'll simulate the payment flow
      
      const options = {
        key: 'rzp_live_7O5QP1s4dVusRGhHi7lyWpKhh', // Live Razorpay key
        amount: getPaymentDetails().amount,
        currency: 'INR',
        name: 'KCET Choice Vision',
        description: getPaymentDetails().title,
        order_id: 'order_' + Date.now(), // In real app, get this from your backend
        handler: function (response: any) {
          console.log('Payment successful:', response);
          setPaymentStatus('success');
          // Store payment status in localStorage
          localStorage.setItem(`paid_${type}`, 'true');
          setTimeout(() => {
            onSuccess();
            onClose();
          }, 2000);
        },
        prefill: {
          name: '',
          email: '',
          contact: ''
        },
        theme: {
          color: '#8B5CF6'
        },
        modal: {
          ondismiss: function() {
            setIsLoading(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStatus('failed');
    } finally {
      setIsLoading(false);
    }
  };

  const checkPaymentStatus = () => {
    return localStorage.getItem(`paid_${type}`) === 'true';
  };

  const details = getPaymentDetails();
  const hasPaid = checkPaymentStatus();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <Card className="w-full max-w-md max-h-[95vh] overflow-y-auto bg-gradient-to-br from-purple-900/95 to-indigo-900/95 border-2 border-purple-400/50 shadow-2xl">
        <div className="p-3 sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              {details.icon}
              <h2 className="text-xl sm:text-2xl font-bold text-white">{details.title}</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Payment Status */}
          {hasPaid && (
            <div className="mb-6 p-4 bg-green-900/30 border border-green-400/50 rounded-lg">
              <div className="flex items-center gap-2 text-green-400">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">Already Purchased!</span>
              </div>
              <p className="text-green-300 text-sm mt-1">
                You have lifetime access to this feature. Use it unlimited times!
              </p>
            </div>
          )}

          {/* Description */}
          <p className="text-gray-300 mb-6">{details.description}</p>

          {/* Features */}
          <div className="mb-6">
            <h3 className="text-base sm:text-lg font-semibold text-white mb-3">What you'll get:</h3>
            <ul className="space-y-2">
              {details.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-gray-300">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Price */}
          <div className="mb-6 p-3 sm:p-4 bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-400/50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-xs sm:text-base">One-time payment:</span>
              <div className="text-right">
                <div className="text-xl sm:text-2xl font-bold text-yellow-400">₹5</div>
                <div className="text-xs text-gray-400">No recurring charges</div>
              </div>
            </div>
          </div>

          {/* Payment Button */}
          {!hasPaid ? (
            <Button
              onClick={handlePayment}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 text-base sm:text-lg"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Processing...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Pay ₹5 & Get Access
                </div>
              )}
            </Button>
          ) : (
            <Button
              onClick={() => {
                onSuccess();
                onClose();
              }}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Access Now
              </div>
            </Button>
          )}

          {/* Security Note */}
          <p className="text-xs text-gray-400 text-center mt-4">
            🔒 Secure payment powered by Razorpay
          </p>
        </div>
      </Card>
    </div>
  );
};

export default PaymentModal; 