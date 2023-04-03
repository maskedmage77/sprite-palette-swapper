import { Notifications } from '@mantine/notifications'
import { ModalsProvider } from '@mantine/modals'
import { MantineProvider } from '@mantine/core'
import PaletteSwap from './pages/PaletteSwap'
import './App.css'

// COMPONENT ---------------------------------------------------------------------------------------

function App() {

  // RENDER ----------------------------------------------------------------------------------------

  return (
    <MantineProvider 
      withGlobalStyles 
      withNormalizeCSS 
      theme={{
        colorScheme: 'dark',
        fontFamily: 'Jost',
        colors: {
          grey: ['#C2C2C2','#A7A7A7', '#929292', '#5F5F5F', '#3A3A3A', '#2E2E2E', '#262626', '#1B1B1B', '#151515', '#111111'],
          dark: ['#C2C2C2', '#A7A7A7', '#929292', '#5F5F5F', '#3A3A3A', '#2E2E2E', '#262626', '#1B1B1B', '#151515', '#111111'],
          primary: [ "#A32BFF", "#9710FF", "#8B00F6", "#7E00E0", "#7300CB", "#6900B9", "#5F00A8", "#560097", "#4D0088", "#45007A"],
        },
        headings: {
          fontWeight: 300,
        },
        components: {
          Drawer: {
            styles: {
              content: {
                background: 'rgba( 0, 0, 0, 0.2 )',
                boxShadow: '0 8px 32px 0 rgba( 0, 0, 0, 1 )',
                backdropFilter: 'blur( 10px )',
                WebkitBackdropFilter: 'blur( 10px )',
                borderLeft: `3px solid rgba(255,255,255,0.05)`
              },
              header: {
                backgroundColor: 'rgba( 255, 255, 255, 0)',
                paddingRight: '1em',
              },
            }
          }
        }
      }}
    >
      <ModalsProvider>

        <Notifications />

        <PaletteSwap />

      </ModalsProvider>
    </MantineProvider>
  )
}

export default App
