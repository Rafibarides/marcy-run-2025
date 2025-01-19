import styled from 'styled-components'

const LoadingContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #000;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`

const LoadingText = styled.div`
  font-family: 'Kid Games', sans-serif;
  font-size: 2rem;
  color: white;
  animation: pulse 1.5s infinite;

  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }
`

export default function LoadingScreen() {
  return (
    <LoadingContainer>
      <LoadingText>LOADING...</LoadingText>
    </LoadingContainer>
  )
} 