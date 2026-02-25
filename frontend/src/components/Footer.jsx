export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white mt-auto overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Main Footer Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top Section - Logo and Description */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 border-b border-gray-700/50 pb-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg shadow-blue-500/50">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  GameON
                </h3>
                <p className="text-xs text-gray-400 font-semibold tracking-wider">SPORTS PRO</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md">
              Your ultimate destination for premium sports equipment. Empowering athletes and enthusiasts with top-quality gear since 2020.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3 mt-6">
              {[
                { icon: 'M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z', label: 'Twitter' },
                { icon: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z', label: 'Facebook' },
                { icon: 'M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01', label: 'Instagram' }
              ].map((social, idx) => (
                <button
                  key={idx}
                  className="p-2.5 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:border-blue-500 hover:bg-gradient-to-br hover:from-blue-600/20 hover:to-purple-600/20 transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-blue-500/30 backdrop-blur-sm"
                  aria-label={social.label}
                >
                  <svg className="w-5 h-5 text-gray-400 hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={social.icon} />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-black text-white mb-4 tracking-wide uppercase">Quick Links</h4>
            <ul className="space-y-2.5">
              {['About Us', 'Contact', 'Careers', 'Blog'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-400 hover:text-white text-sm transition-all duration-200 hover:translate-x-1 inline-block">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-black text-white mb-4 tracking-wide uppercase">Support</h4>
            <ul className="space-y-2.5">
              {['Help Center', 'Track Order', 'Returns', 'Shipping Info'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-400 hover:text-white text-sm transition-all duration-200 hover:translate-x-1 inline-block">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section - Copyright & Payment */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            &copy; 2026 <span className="font-bold text-white">GameON</span> — Sports Equipment. All rights reserved.
          </p>
          
          {/* Payment Icons */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 font-semibold">Secure Payment:</span>
            <div className="flex gap-2">
              {['Visa', 'MC', 'UPI', 'GPay'].map((payment) => (
                <div key={payment} className="px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-lg border border-gray-700/50 text-xs font-bold text-gray-300">
                  {payment}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
