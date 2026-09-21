import React from 'react';

export default function Footer() {
  return (
   <footer className="bg-slate-900 text-white py-10 px-6">
  <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
    
    <div className="max-w-sm">
      <h2 className="text-xl font-bold mb-2">APEX ENTHUSIAST</h2>
      <p className="text-gray-400 text-sm">
        Penyedia sepatu olahraga pilihan untuk performa maksimal di lapangan. 100% Original.
      </p>
    </div>

    <div>
      <h3 className="font-semibold text-lg mb-3">Kategori</h3>
      <ul className="space-y-2 text-gray-400 text-sm">
        <li><a href="#" className="hover:text-white">Sepak Bola</a></li>
        <li><a href="#" className="hover:text-white">Futsal</a></li>
        <li><a href="#" className="hover:text-white">Sepatu Lari</a></li>
      </ul>
    </div>

    {/* KANAN: Sosial Media */}
    <div>
      <h3 className="font-semibold text-lg mb-3">Sosial Media</h3>
      <ul className="space-y-2 text-gray-400 text-sm">
        <li><a href="#" className="hover:text-white">Instagram</a></li>
        <li><a href="#" className="hover:text-white">TikTok</a></li>
        <li><a href="#" className="hover:text-white">WhatsApp</a></li>
      </ul>
    </div>

  </div>

  <div className="border-t border-gray-800 mt-8 pt-4 text-center text-gray-500 text-xs">
    © 2026 APEX ENTHUSIAST. All rights reserved.
  </div>
</footer>
  );
}