import React, { useState } from 'react';
import { Info } from 'lucide-react';
import '../styles/components.css';

function TooltipHelper({ text }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="tooltip-container">
      <div
        className="tooltip-trigger"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onClick={() => setVisible(!visible)}
      >
        <Info size={16} />
      </div>
      {visible && (
        <div className="tooltip-content">
          {text}
        </div>
      )}
    </div>
  );
}

export default TooltipHelper;
