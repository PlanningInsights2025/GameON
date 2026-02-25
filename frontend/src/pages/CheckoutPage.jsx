import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { orderService } from '../services/api';

export default function CheckoutPage() {
  const { cart, total, clearCart } = useContext(CartContext);
  const [loading, setLoading] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [addressMode, setAddressMode] = useState('default');
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [saveAsDefault, setSaveAsDefault] = useState(false);
  const [address, setAddress] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India'
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [paying, setPaying] = useState(false);
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [note, setNote] = useState('');
  const navigate = useNavigate();

  const paymentOptions = [
    { value: 'cod', label: 'Cash on Delivery', hint: 'Pay when your order arrives', icon: '💵' },
    { value: 'upi', label: 'UPI', hint: 'Fast and secure UPI transfer', icon: '📱' },
    { value: 'card', label: 'Card', hint: 'Debit or credit card payment', icon: '💳' },
    { value: 'netbanking', label: 'Net Banking', hint: 'Pay directly via your bank', icon: '🏦' }
  ];

  const formatCardNumber = (value) => value.replace(/(\d{4})(?=\d)/g, '$1 ');
  const isPrepaid = paymentMethod !== 'cod';

  const loadAddresses = () => {
    const raw = localStorage.getItem('addresses');
    const parsed = raw ? JSON.parse(raw) : [];
    setSavedAddresses(parsed);

    if (parsed.length === 0) {
      setAddressMode('new');
      setSelectedAddressId('');
      return;
    }

    setSelectedAddressId((prevSelectedId) => {
      const selectedStillExists = parsed.some((addr) => addr.id === prevSelectedId);
      if (selectedStillExists) {
        return prevSelectedId;
      }

      const defaultAddress = parsed.find((addr) => addr.isDefault) || parsed[0];
      return defaultAddress.id;
    });
  };

  useEffect(() => {
    loadAddresses();

    const onStorage = (event) => {
      if (event.key === 'addresses') {
        loadAddresses();
      }
    };

    const onAddressesUpdated = () => {
      loadAddresses();
    };

    window.addEventListener('storage', onStorage);
    window.addEventListener('addressesUpdated', onAddressesUpdated);

    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('addressesUpdated', onAddressesUpdated);
    };
  }, []);

  const handleAddressChange = (field, value) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  const isAddressValid = () => {
    return address.name && address.phone && address.street && address.city && address.state && address.zipCode && address.country;
  };

  const getSelectedSavedAddress = () => {
    if (!selectedAddressId) return null;
    return savedAddresses.find((addr) => addr.id === selectedAddressId) || null;
  };

  const saveNewAddress = () => {
    const newAddress = {
      ...address,
      id: Date.now().toString(),
      isDefault: saveAsDefault || savedAddresses.length === 0
    };

    const updated = newAddress.isDefault
      ? savedAddresses.map((addr) => ({ ...addr, isDefault: false })).concat(newAddress)
      : savedAddresses.concat(newAddress);

    localStorage.setItem('addresses', JSON.stringify(updated));
    window.dispatchEvent(new Event('addressesUpdated'));
    setSavedAddresses(updated);
    setSelectedAddressId(newAddress.id);
  };

  const validatePaymentDetails = () => {
    if (paymentMethod === 'upi' && !upiId.trim()) {
      alert('Please enter UPI ID before payment.');
      return false;
    }

    if (paymentMethod === 'card' && cardNumber.length < 12) {
      alert('Please enter a valid card number before payment.');
      return false;
    }

    if (paymentMethod === 'netbanking' && !bankName.trim()) {
      alert('Please enter bank name before payment.');
      return false;
    }

    return true;
  };

  const handleCompletePayment = async () => {
    if (!validatePaymentDetails()) return;

    setPaying(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setPaymentConfirmed(true);
      alert('Payment successful. You can now place your order.');
    } finally {
      setPaying(false);
    }
  };

  const handleCheckout = async () => {
    const selectedSavedAddress = getSelectedSavedAddress();

    if (addressMode === 'default' && !selectedSavedAddress) {
      alert('Please select a saved address or add a new address.');
      return;
    }

    if (addressMode === 'new' && !isAddressValid()) {
      alert('Please fill in complete shipping address.');
      return;
    }

    if (isPrepaid && !paymentConfirmed) {
      alert('Please complete prepaid payment before placing the order.');
      return;
    }

    setLoading(true);
    try {
      const products = cart.map(item => ({
        product: item.product._id,
        qty: item.qty,
        price: item.product.price
      }));

      const paymentDetails = {
        note: note || null,
        upiId: paymentMethod === 'upi' ? upiId : null,
        cardLast4: paymentMethod === 'card' && cardNumber.length >= 4 ? cardNumber.slice(-4) : null,
        bankName: paymentMethod === 'netbanking' ? bankName : null
      };

      if (addressMode === 'new') {
        saveNewAddress();
      }

      const orderAddress = addressMode === 'default' ? selectedSavedAddress : address;

      await orderService.create({
        products,
        total,
        address: orderAddress,
        paymentMethod,
        paymentDetails,
        paymentConfirmed: !isPrepaid || paymentConfirmed
      });
      clearCart();
      navigate('/orders');
    } catch (error) {
      alert(error?.response?.data?.message || 'Unable to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 py-10">
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-8">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Secure Checkout</p>
          <h1 className="text-4xl font-extrabold text-gray-900 mt-1">Complete your order</h1>
          <p className="text-gray-600 mt-2">Choose your payment method and place your order in seconds.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Shipping Address</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
              <button
                type="button"
                onClick={() => setAddressMode('default')}
                disabled={savedAddresses.length === 0}
                className={`text-left border rounded-xl p-4 transition ${addressMode === 'default' ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-200' : 'border-gray-200 bg-white'} ${savedAddresses.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-300'}`}
              >
                <p className="font-semibold text-gray-900">Use Default Address</p>
                <p className="text-xs text-gray-500 mt-1">Select from your saved addresses</p>
              </button>
              <button
                type="button"
                onClick={() => setAddressMode('new')}
                className={`text-left border rounded-xl p-4 transition ${addressMode === 'new' ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-200' : 'border-gray-200 hover:border-blue-300 bg-white'}`}
              >
                <p className="font-semibold text-gray-900">Add New Address</p>
                <p className="text-xs text-gray-500 mt-1">Enter a new shipping address</p>
              </button>
            </div>

            {addressMode === 'default' && savedAddresses.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Saved Address</label>
                <select
                  value={selectedAddressId}
                  onChange={(e) => setSelectedAddressId(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {savedAddresses.map((addr) => (
                    <option key={addr.id} value={addr.id}>
                      {addr.name} - {addr.city}, {addr.state} {addr.isDefault ? '(Default)' : ''}
                    </option>
                  ))}
                </select>

                {getSelectedSavedAddress() && (
                  <div className="mt-3 p-4 border border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-700">
                    <p className="font-semibold text-gray-900">{getSelectedSavedAddress().name}</p>
                    <p>{getSelectedSavedAddress().phone}</p>
                    <p>{getSelectedSavedAddress().street}</p>
                    <p>{getSelectedSavedAddress().city}, {getSelectedSavedAddress().state} {getSelectedSavedAddress().zipCode}</p>
                    <p>{getSelectedSavedAddress().country}</p>
                  </div>
                )}
              </div>
            )}

            {addressMode === 'new' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  value={address.name}
                  onChange={(e) => handleAddressChange('name', e.target.value)}
                  placeholder="Enter full name"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  value={address.phone}
                  onChange={(e) => handleAddressChange('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="10-digit mobile number"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                <input
                  value={address.street}
                  onChange={(e) => handleAddressChange('street', e.target.value)}
                  placeholder="House no, area, landmark"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <input
                  value={address.city}
                  onChange={(e) => handleAddressChange('city', e.target.value)}
                  placeholder="Enter city"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                <input
                  value={address.state}
                  onChange={(e) => handleAddressChange('state', e.target.value)}
                  placeholder="Enter state"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">PIN Code</label>
                <input
                  value={address.zipCode}
                  onChange={(e) => handleAddressChange('zipCode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="6-digit PIN"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                <input
                  value={address.country}
                  onChange={(e) => handleAddressChange('country', e.target.value)}
                  placeholder="Country"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={saveAsDefault}
                    onChange={(e) => setSaveAsDefault(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-700">Set this as default address</span>
                </label>
              </div>
            </div>
            )}

            <h2 className="text-2xl font-bold text-gray-900 mb-5">Payment Method</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {paymentOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    setPaymentMethod(option.value);
                    setPaymentConfirmed(false);
                  }}
                  className={`text-left border rounded-xl p-4 transition ${paymentMethod === option.value ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-200' : 'border-gray-200 hover:border-blue-300 bg-white'}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg">{option.icon}</span>
                    <span className={`w-4 h-4 rounded-full border-2 ${paymentMethod === option.value ? 'border-blue-600 bg-blue-600' : 'border-gray-300'}`}></span>
                  </div>
                  <p className="font-semibold text-gray-900 mt-2">{option.label}</p>
                  <p className="text-xs text-gray-500 mt-1">{option.hint}</p>
                </button>
              ))}
            </div>

            {paymentMethod === 'upi' && (
              <div className="mt-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">UPI ID</label>
                <input
                  value={upiId}
                  onChange={(e) => {
                    setUpiId(e.target.value);
                    setPaymentConfirmed(false);
                  }}
                  placeholder="name@bank"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {paymentMethod === 'card' && (
              <div className="mt-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                <input
                  value={formatCardNumber(cardNumber)}
                  onChange={(e) => {
                    setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16));
                    setPaymentConfirmed(false);
                  }}
                  placeholder="1234 5678 9012 3456"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {paymentMethod === 'netbanking' && (
              <div className="mt-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name</label>
                <input
                  value={bankName}
                  onChange={(e) => {
                    setBankName(e.target.value);
                    setPaymentConfirmed(false);
                  }}
                  placeholder="Enter bank name"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {isPrepaid && (
              <div className="mt-5 p-4 rounded-lg border border-blue-200 bg-blue-50">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-blue-900">
                    {paymentConfirmed ? '✅ Prepaid payment completed' : 'Complete prepaid payment to place order'}
                  </p>
                  <button
                    type="button"
                    onClick={handleCompletePayment}
                    disabled={paying || paymentConfirmed}
                    className="px-4 py-2 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    {paymentConfirmed ? 'Payment Done' : paying ? 'Processing Payment...' : 'Complete Payment'}
                  </button>
                </div>
              </div>
            )}

            <div className="mt-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Note (optional)</label>
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Any payment note"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-3 max-h-72 overflow-auto pr-1">
                {cart.map(item => (
                  <div key={item.product._id} className="flex items-start justify-between pb-3 border-b border-gray-100">
                    <div className="pr-3">
                      <p className="font-medium text-gray-900 leading-snug">{item.product.name}</p>
                      <p className="text-xs text-gray-500 mt-1">Qty: {item.qty}</p>
                    </div>
                    <p className="font-semibold text-gray-900">₹{(item.product.price * item.qty).toLocaleString()}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-green-600 mt-1">
                  <span>Delivery</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between mt-3 text-2xl font-extrabold text-gray-900">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading || paying || (isPrepaid && !paymentConfirmed)}
                className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50 font-semibold"
              >
                {loading ? 'Processing...' : paymentMethod === 'cod' ? 'Place Order' : 'Pay & Place Order'}
              </button>

              <p className="text-xs text-gray-500 text-center mt-3">🔒 Secure transaction powered by GameON Pay</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
