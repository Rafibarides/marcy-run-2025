import { GameProvider } from './context/GameProvider'
import { GameContent } from './components/GameContent'

function App() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  )
}

export default App
