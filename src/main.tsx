import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import CssBaseline from '@mui/material/CssBaseline'
import { createTheme, ThemeProvider } from '@mui/material/styles'

import App from './App'

declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xs: false // removes the `xs` breakpoint
    sm: false
    md: false
    lg: false
    xl: false
    mobile: true // adds the `mobile` breakpoint
    tablet: true
    laptop: true
    desktop: true
  }
}

const darkTheme = createTheme({
  breakpoints: {
    values: {
      mobile: 0,
      tablet: 640,
      laptop: 1024,
      desktop: 1280,
    },
  },
  palette: {
    mode: 'dark',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: `url(${'./background.webp'}) no-repeat center center fixed`,
          backgroundSize: 'cover',
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          backgroundImage:
            'linear-gradient(to right bottom, #2a4858, #204257, #153c55, #093654, #003052)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          color: 'white',
          backgroundImage: 'linear-gradient(to left, #06d6a0, #00c5b3, #00b2bd, #009fbd, #118ab2)',
          '&:hover': {
            backgroundImage:
              'linear-gradient(to right, #ef476f, #fe6a61, #ff8d58, #ffb059, #ffd166)',
          },
        },
      },
    },
  },
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
)
