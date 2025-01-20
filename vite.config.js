import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/marcy-run-2025/',
  plugins: [react()],
})

// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     extensions: ['.js', '.jsx', '.json']
//   }
// })