import React from 'react';
import { useNavigate } from 'react-router-dom';

function FrontPage() {
  const navigate = useNavigate();

  return (
    <div style={{
      position: 'relative',
      height: '100vh',
      background: 'white',
      overflow: 'hidden',
    }}>
      {/* background image */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: 'url("iitPic2.jpg")',
        backgroundSize: 'cover',
        opacity: 0.9,
        '@media (max-width: 768px)': {
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }
      }}></div>
      {/* Content */}
      <div style={{
        position: 'relative', 
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        padding: '0 20px',
        zIndex: 1,
      }}>
        <h1 style={{ textAlign: 'center', cursor: 'pointer', fontSize: '3rem', marginBottom: '20px', marginTop: '-120px', 
                      '@media (max-width: 768px)': {
                        fontSize: '2rem',
                        marginBottom: '10px',
                        marginTop: '-80px'
                      }
                    }}>Welcome to the College Rankings</h1>
        
        <button
          onClick={() => navigate('/rankings')}
          style={{
            padding: '12px 24px',
            fontSize: '1rem',
            cursor: 'pointer',
            marginTop: '20px',
            borderRadius: '5px',
            border: 'none',
            backgroundColor: '#007bff',
            color: 'white',
            outline: 'none',
            transition: 'background-color 0.3s, box-shadow 0.3s',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
            '@media (max-width: 768px)': {
              marginTop: '10px',
              padding: '10px 20px',
              fontSize: '0.8rem'
            }
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#007bff'}
        >
          See Rankings
        </button>
      </div>
    </div>
  );
}

export default FrontPage;
