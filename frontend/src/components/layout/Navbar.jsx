import React from 'react';
import { Bell, Settings, User } from 'lucide-react';
import '../../styles/layout.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="logo">
          <span className="logo-icon">🤖</span>
          <span className="logo-text">Trading Agent</span>
        </div>
      </div>

      <div className="navbar-right">
        <div className="notification-icon">
          <Bell size={20} />
          <span className="notification-badge">3</span>
        </div>

        <a href="/settings" className="icon-button">
          <Settings size={20} />
        </a>

        <div className="user-menu">
          <User size={20} />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
