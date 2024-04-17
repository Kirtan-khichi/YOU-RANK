import React from 'react';
import './AboutUsPage.css'; // Import the CSS file for styling

const AboutUsPage = () => {
  return (
    <div className="about-us-container">
      <h2 className="about-us-heading">About Us</h2>
      <div className="about-us-content">
        <p>
          Founder - Kirtan, Sophomore at Sitare University
        </p>
        <p>
          Co-Founder - Dr. Achal Agrawal, Assistant Professor at Sitare University. Alumnus of Chennai Mathematical Institute.
        </p>
        <p>
          Conflict of Interest - Sitare University and Chennai Mathematical Institute are not part of these rankings and hence there is no conflict of interest.
        </p>
        <p>
          This initiative is completely open source and not for profit : <a href="https://github.com/Kirtan-khichi/YOU-RANK" target="_blank" rel="noopener noreferrer" className="link">Github Link</a>
        </p>
        <p>
          Our aim is to provide alternatives to for-profit and opaque rankings, while fixing some of their flaws. By letting users choose the weights for the parameters themselves, we also hope to remove any bias that other rankings might impose.
        </p>
        <p>
          In the future, we plan to expand these rankings to include more colleges, have better and more sophisticated measures for research, as well as create new innovative parameters to better measure the colleges. Do join us at Github if you feel this is worthwhile and you want to contribute.
        </p>
      </div>
    </div>
  );
};

export default AboutUsPage;
