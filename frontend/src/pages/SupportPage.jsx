import { Link } from 'react-router-dom';

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">How Can We Help You?</h1>
          <p className="text-xl text-blue-100">We're here to support your sports journey</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Contact Options */}
        <div className="grid md:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto">
          <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Email Support</h3>
            <p className="text-gray-600 mb-4">Get help via email within 24 hours</p>
            <a href="mailto:support@gameon.com" className="text-blue-600 font-semibold hover:text-blue-700">
              support@gameon.com
            </a>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Phone Support</h3>
            <p className="text-gray-600 mb-4">Call us Monday to Friday, 9 AM - 6 PM</p>
            <a href="tel:+1234567890" className="text-green-600 font-semibold hover:text-green-700">
              +1 (234) 567-890
            </a>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4 max-w-3xl mx-auto">
            <details className="bg-white rounded-lg p-6 shadow-md">
              <summary className="font-semibold text-lg cursor-pointer hover:text-blue-600">
                How long does shipping take?
              </summary>
              <p className="mt-4 text-gray-600">
                Standard shipping takes 5-7 business days. Express shipping is available for 2-3 business days delivery.
              </p>
            </details>

            <details className="bg-white rounded-lg p-6 shadow-md">
              <summary className="font-semibold text-lg cursor-pointer hover:text-blue-600">
                What is your return policy?
              </summary>
              <p className="mt-4 text-gray-600">
                We offer a 30-day return policy for unused items in original packaging. Return shipping is free for defective items.
              </p>
            </details>

            <details className="bg-white rounded-lg p-6 shadow-md">
              <summary className="font-semibold text-lg cursor-pointer hover:text-blue-600">
                Do you offer international shipping?
              </summary>
              <p className="mt-4 text-gray-600">
                Yes, we ship to most countries worldwide. International shipping times vary by location, typically 10-15 business days.
              </p>
            </details>

            <details className="bg-white rounded-lg p-6 shadow-md">
              <summary className="font-semibold text-lg cursor-pointer hover:text-blue-600">
                How can I track my order?
              </summary>
              <p className="mt-4 text-gray-600">
                Once your order ships, you'll receive a tracking number via email. You can also track your order in the <Link to="/orders" className="text-blue-600 hover:underline">Orders</Link> section.
              </p>
            </details>

            <details className="bg-white rounded-lg p-6 shadow-md">
              <summary className="font-semibold text-lg cursor-pointer hover:text-blue-600">
                What payment methods do you accept?
              </summary>
              <p className="mt-4 text-gray-600">
                We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers.
              </p>
            </details>

            <details className="bg-white rounded-lg p-6 shadow-md">
              <summary className="font-semibold text-lg cursor-pointer hover:text-blue-600">
                Are your products authentic?
              </summary>
              <p className="mt-4 text-gray-600">
                Yes, all our products are 100% authentic and sourced directly from official manufacturers and authorized distributors.
              </p>
            </details>
          </div>
        </div>

        {/* Additional Help */}
        <div className="bg-blue-50 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Still Need Help?</h2>
          <p className="text-gray-700 mb-6">Can't find what you're looking for? Our support team is ready to assist you.</p>
          <a 
            href="mailto:support@gameon.com" 
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
