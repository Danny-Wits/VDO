import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import '@mantine/core/styles.css'

import { MantineProvider, createTheme } from '@mantine/core'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

const theme = createTheme({
  primaryColor: 'wood',
  colors: {
    wood: [
      '#fcf6e8',
      '#efe9d7',
      '#dbceb3',
      '#c8b38b',
      '#b79b68',
      '#ac8c51',
      '#a68444',
      '#917135',
      '#82642d',
      '#735522',
    ],
  },
  defaultRadius: 'xl',
  fontFamily: '"Inter", sans-serif',
  headings: { fontFamily: '"Playfair Display", serif' },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <MantineProvider forceColorScheme="dark" theme={theme}>
        <App />
      </MantineProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
