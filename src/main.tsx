import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import '@mantine/core/styles.css';
import {ColorSchemeScript, createTheme, MantineProvider} from '@mantine/core';

import App from './App.tsx'

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

const queryClient = new QueryClient()

const theme = createTheme({
  primaryColor: 'cyan',
});

createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <ColorSchemeScript defaultColorScheme="dark" />
      <MantineProvider theme={theme} defaultColorScheme="dark" forceColorScheme='dark'>
        <QueryClientProvider client={queryClient}>
          <App/>
        </QueryClientProvider>
      </MantineProvider>
    </StrictMode>
)
