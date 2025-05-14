import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

// Components
import App from './App.jsx'

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
