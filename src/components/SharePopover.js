import React, { useState } from 'react';
import {
  FacebookShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  FacebookIcon,
  LinkedinIcon,
  WhatsappIcon
} from 'react-share';
import './SharePopover.css';

const SharePopover = ({ shareableURL, message }) => {
  const [showPopover, setShowPopover] = useState(false);

  const handleTogglePopover = () => {
    setShowPopover(!showPopover);
  };

  return (
    <div className="share-popover">
      <button className={showPopover ? 'active' : ''} onClick={handleTogglePopover}>
        {showPopover ? 'Close (X)' : 'Share'}
      </button>
      <div className={`popover-content ${showPopover ? 'show' : ''}`}>
        <h1>Link is copied to clipboard</h1>
        <div className="share-buttons">
          <WhatsappShareButton url={shareableURL} title={message}>
            <WhatsappIcon size={32} round={true} />
          </WhatsappShareButton>
          <FacebookShareButton url={shareableURL} quote={message}>
            <FacebookIcon size={32} round={true} />
          </FacebookShareButton>
          <LinkedinShareButton url={shareableURL} title={message}>
            <LinkedinIcon size={32} round={true} />
          </LinkedinShareButton>
        </div>
      </div>
    </div>
  );
};

export default SharePopover;
