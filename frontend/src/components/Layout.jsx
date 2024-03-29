import React from 'react';
import Navbar from './Navbar'; // Navbar bileşenini buraya ekleyin

function Layout({ children }) {
  return (
    <div>
      <Navbar />
      <div className="container">
        {children}
      </div>
      {/* Burada diğer ortak bileşenler de eklenebilir */}
    </div>
  );
}

export default Layout;
