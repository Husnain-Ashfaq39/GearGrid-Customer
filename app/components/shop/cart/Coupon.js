'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';

const Coupon = ({ onApplyCoupon }) => {
  const [couponCode, setCouponCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_APPWRITE_LOCALHOST_ENDPOINT}/vouchers/${couponCode}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Invalid coupon code');
      }

      onApplyCoupon(data);
      toast.success('Coupon applied successfully!');
      setCouponCode('');
    } catch (error) {
      toast.error(error.message || 'Failed to apply coupon');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="coupon-container" style={{ marginBottom: '20px' }}>
      <div className="coupon-input-group" style={{ 
        display: 'flex', 
        gap: '10px',
        alignItems: 'center'
      }}>
        <input
          className="form-control"
          type="text"
          placeholder="Coupon code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          aria-label="Coupon code"
          style={{
            height: '45px',
            borderRadius: '8px',
            border: '1px solid #e6e6e6',
            padding: '0 15px',
            fontSize: '14px',
            flex: '1',
            outline: 'none',
          }}
        />
        <button 
          type="button" 
          onClick={handleApplyCoupon}
          disabled={loading}
          style={{
            backgroundColor: '#ffc107',
            color: '#1c1c1c',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 20px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            height: '45px',
            minWidth: '120px',
            transition: 'background-color 0.2s',
            ':hover': {
              backgroundColor: '#ffb300'
            }
          }}
        >
          {loading ? 'Applying...' : 'Apply Coupon'}
        </button>
      </div>
    </div>
  );
};

export default Coupon;
