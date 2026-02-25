import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

export default function CartPage() {
  const { cart, removeFromCart, updateQty, total } = useContext(CartContext);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Your Cart</h1>
          <p className="text-gray-600 mb-4">Your cart is empty</p>
          <Link to="/products" className="text-blue-600 hover:underline">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Your Cart</h1>
        <div className="bg-white p-6 rounded-lg shadow">
          {cart.map(item => (
            <div key={item.product._id} className="flex justify-between items-center border-b py-4">
              <div>
                <h3 className="font-semibold">{item.product.name}</h3>
                <p className="text-gray-600">₹{item.product.price.toLocaleString()}</p>
              </div>
              <div className="flex gap-4 items-center">
                <input
                  type="number"
                  min="1"
                  value={item.qty}
                  onChange={e => updateQty(item.product._id, Number(e.target.value))}
                  className="border px-2 py-1 w-16"
                />
                <button onClick={() => removeFromCart(item.product._id)} className="text-red-600 hover:underline">
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div className="flex justify-between items-center mt-6">
            <h2 className="text-2xl font-bold">Total: ₹{total.toLocaleString()}</h2>
            <Link to="/checkout" className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700">
              Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
