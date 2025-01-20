import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Add the easter egg console message
console.log(
  "%c👀 Hey you!!! Stop looking at my code! 🚫\n" +
  "%cNothing to see here... 🙈\n" +
  "%c(but since you're here, feel free to check out my linkedIn https://www.linkedin.com/in/rafibarides/) 🎮 :)",
  "color: #ff6b6b; font-size: 20px; font-weight: bold;",
  "color: #4ecdc4; font-size: 16px; font-style: italic;",
  "color: #95a5a6; font-size: 14px;"
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
