import { Group, rem, useMantineTheme, ActionIcon, Card, Title, CloseButton, Box } from '@mantine/core'
import { ColorPicker, Plus } from 'tabler-icons-react';
import { useEyeDropper } from '@mantine/hooks';

// PROPS -------------------------------------------------------------------------------------------

type Props = { 
  currentColors: string[], 
  setCurrentColors: (colors: (prevColors: string[]) => string[]) => void 
}

// COMPONENT ---------------------------------------------------------------------------------------

export default function CurrentPalette({ currentColors, setCurrentColors }: Props) {

  // HOOKS -----------------------------------------------------------------------------------------

  const theme = useMantineTheme();
  const { supported, open } = useEyeDropper();
  

  // FUNCTIONS -------------------------------------------------------------------------------------

  async function pickColor(colorIndex: number) {
    try {
      const { sRGBHex } = await open();
      setCurrentColors((colors) => {
        const newColors = [...colors];
        newColors[colorIndex] = sRGBHex;
        return newColors;
      });
    } catch (e) {
      console.log(e);
    }
  };

  // RENDER ----------------------------------------------------------------------------------------

  return (
    <Card
      shadow="md"
      withBorder
      style={{
        width: rem(400),
        height: rem(248),
      }}
    >

      <Title 
        order={3}
        style={{
          textAlign: 'center',
        }}
      >
        Current Palette
      </Title>

      <Group
        mt="md"
        spacing="xs"
      >

        {currentColors.map((color, index) => (
          
          <Box
            key={index}
            sx={{
              position: 'relative',
            }}
          >
            <ActionIcon
              variant="default"
              size={rem(48)}
              onClick={() => {
                pickColor(index)
              }}
              style={{
                backgroundColor: currentColors[index],
              }}
            >
              <ColorPicker size="1.5rem" />
              
            </ActionIcon>

            <CloseButton
              size="xs"
              onClick={() => {
                setCurrentColors((colors) => {
                  const newColors = colors.filter((color, i) => i !== index);
                  if (newColors.length === 0) newColors.push('');
                  return newColors;
                });
              }}
              aria-label="Close modal"
              style={{
                backgroundColor: theme.colors.red[6],
                position: 'absolute',
                right: -6,
                top: -6,
              }}
            />

          </Box>
        
        ))}

        {/* NEW COLOR BUTTON --------------------------------------------------------------- */}

        <ActionIcon
          variant="default"
          size={rem(48)}
          onClick={() => {
            pickColor(currentColors.length)
          }}
        >
          <Plus size="1.5rem" />
        </ActionIcon>

      </Group>

    </Card>
  );
}