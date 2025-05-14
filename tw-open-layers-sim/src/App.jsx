import React, { useState } from 'react';
import Map from './components/Map';
import './css/Main.css'

export default function App() {
  const [color, setColor] = useState('#e74c3c'); // default red

  return (
    <>
      <header style={{ padding: '.5rem', background: '#eee' }}>
        <input
          type="color"
          value={color}
          onChange={e => setColor(e.target.value)}
          style={{ marginRight: '.5rem' }}
        />
        Pick a country fill colour
      </header>
      <div style={{ height: '100%', width: '100vw' }}>
        <Map color={color} border="#222" />
      </div>
    </>
  );
}
