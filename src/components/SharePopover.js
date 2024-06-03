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

const SharePopover = ({ generateShareableURL }) => {
  const [isOpen, setIsOpen] = useState(false);

  const togglePopover = () => {
    setIsOpen(!isOpen);
  };

  const url = generateShareableURL();
  const message = `Check out this management ranking:`;

  return (
    <div className="share-popover">
      <button onClick={togglePopover}>
        <i className="fa fa-share-alt" />
      </button>
      {isOpen && (
        <div className="popover-content">
          <h1>Link is copied to clipboard</h1>
          <div className="share-buttons">
            <WhatsappShareButton url={url} title={message}>
              <WhatsappIcon size={32} round={true} />
            </WhatsappShareButton>
            <FacebookShareButton url={url} quote={message}>
              <FacebookIcon size={32} round={true} />
            </FacebookShareButton>
            <LinkedinShareButton url={url} title={message}>
              <LinkedinIcon size={32} round={true} />
            </LinkedinShareButton>
          </div>
        </div>
      )}
    </div>
  );
};

export default SharePopover;
