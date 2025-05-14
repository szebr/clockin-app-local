import { useState, useEffect } from 'react';
import Logo from './assets/logo.svg?react';
import './App.css';


function App() {
  const [page, setPage] = useState('landing'); // "pages": landing, login, create, dashboard
  
  // probably won't need these variables in the final version
  // but will need to be passed to the backend
  // for the login and create account components
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');
  const [clockedIn, setClockedIn] = useState(false);
  

  // for the time component on the dashboard
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
  
    return () => clearInterval(interval);
  }, []); 


  const handleLogin = async () => {
    if (name && pin.length === 4) {
      // uncomment this block to hook into api/backend

      try {
        const res = await fetch('http://localhost:8000/api/login/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name, pin })
        });
  
        const data = await res.json();
        if (res.ok) {
          setName(data.name); // assuming backend returns name
          setPage('dashboard');
        } else {
          alert('Login failed: ' + data.detail);
        }
      } catch (err) {
        console.error('Login error:', err);
      }
  
      // Temporary fallback behavior

      // setPage('dashboard');
    }
  };

  const handleCreate = async () => {
  if (name && pin.length === 4) {

    try {
      const res = await fetch('http://localhost:8000/api/users/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, pin })
      });

      const data = await res.json();
      if (res.ok) {
        setPage('dashboard');
      } else {
        alert('Account creation failed: ' + data.detail);
      }
    } catch (err) {
      console.error('Create error:', err);
    }

    // Temporary fallback behavior

    // setPage('dashboard');
  }
};

  const handleLogout = () => {
    setName('');
    setPin('');
    setClockedIn(false);
    setPage('landing');
  };

  return (
    <div>

      {/* LANDING PAGE -------------------------*/}
      {page === 'landing' && (
        <>
          <Logo className = "logo"/>
          <h1 className = "font-bold mb-4"></h1>
          <button 
            className="text-white w-full mb-4" 
            onClick={() => setPage('login')}>
            Log In
          </button>
          <button 
            className="text-white w-full mb-4" 
            onClick={() => setPage('create')}>
            Create Account
          </button>
        </>
      )}

      {/* LOGIN PAGE -------------------------*/}
      {page === 'login' && (
        <>
          <Logo className = "logo"/>
          <h2 className = "font-bold mb-4">Log In</h2>

          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            className = "border px-4 py-2 w-full rounded mb-4"
          /><br />

          <input
            type="password"
            placeholder="4-digit PIN"
            maxLength={4}
            value={pin}
            onChange={e => setPin(e.target.value)}
            className = "border px-4 py-2 w-full rounded mb-4"
          /><br />

          <button 
            className="text-white w-full mb-4" 
            onClick={handleLogin}>
            Submit
          </button>

          <button 
            className="text-white w-full mb-4"
            onClick={() => setPage('landing')}>
            Back
          </button>

        </>
      )}

      {/* CREATE ACCOUNT PAGE -------------------------*/}
      {page === 'create' && (
        <>
          <Logo className = "logo"/>
          <h2 className="font-bold mb-4">Create Account</h2>

          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            className = "border px-4 py-2 w-full rounded mb-4"
          /><br />

          <input
            type="password"
            placeholder="4-digit PIN"
            maxLength={4}
            value={pin}
            onChange={e => setPin(e.target.value)}
            className = "border px-4 py-2 w-full rounded mb-4"
          /><br />

          <button 
            className="text-white w-full mb-4"
            onClick={handleCreate}>
            Register
          </button>

          <button 
            className="text-white w-full mb-4"
            onClick={() => setPage('landing')}>
            Back
          </button>

        </>
      )}

      {/* DASHBOARD PAGE -------------------------*/}
      {page === 'dashboard' && (
        <>
          {console.log('Dashboard page')}
          <Logo className = "logo"/>
          <h2 className = "font-bold mb-4">Current Time: {currentTime.toLocaleTimeString()}</h2>
          <p className = "font-bold mb-4 underline">{clockedIn ? 'Clocked In' : 'Clocked Out'}</p>

          <button 
            className="text-white w-full mb-4"

            onClick={async () => {
              // setClockedIn(true);

              try {
                await fetch('http://localhost:8000/api/clock/', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ name, pin, type: 'in' })
                });
              } catch (err) {
                console.error('Clock in error:', err);
              }
            }}>

            Clock In
          </button>

          <button 
            className="text-white w-full mb-4"

            onClick={async () => {
              // setClockedIn(false);

              try {
                await fetch('http://localhost:8000/api/clock/', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ name, pin, type: 'out' })
                });
              } catch (err) {
                console.error('Clock out error:', err);
              }

            }}>
            Clock Out
          </button>

        <br /><br />

          <button 
            className="text-white w-full mb-4"
            onClick={handleLogout}>
            Log Out
          </button>

        </>
      )}
    </div>
  );
}

export default App;