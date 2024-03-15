import React, { useState } from 'react';
import axios from 'axios';
import './styles.css'; // Import the CSS file

const FileUpload = () => {
  const [file, setFile] = useState(null);

  const onChangeHandler = (e) => {
    setFile(e.target.files[0]);
  };

  const onClickHandler = () => {
    const formData = new FormData();
    formData.append('file', file);

    axios.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className="file-upload-container">
      <h2>Upload CSV File</h2>
      <input type="file" onChange={onChangeHandler} className="file-upload-input" />
      <button onClick={onClickHandler} className="file-upload-button">Upload</button>
    </div>
  );
};

export default FileUpload;
