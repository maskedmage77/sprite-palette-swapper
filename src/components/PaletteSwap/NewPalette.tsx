import { Group, rem, ActionIcon, Card, CloseButton, Box, useMantineTheme, Stack, Text, TextInput, Tooltip } from '@mantine/core'
import { ColorPicker, Edit, FileExport, Plus } from 'tabler-icons-react';
import exportCanvasAsPNG from '../../utils/exportCanvasAsPNG';
import { useEyeDropper, useHover } from '@mantine/hooks';
import NewPaletteType from '../../types/NewPaletteType';
import swapColors from '../../utils/swapCanvasColors';
import { useEffect, useRef } from 'react';

// PROPS -------------------------------------------------------------------------------------------

type Props = {
  currentImage: string,
  newPalette: NewPaletteType,
  currentPalette: string[],
  newPaletteIndex: number,
  setNewPalettes: (palettes: (prevPalettes: NewPaletteType[]) => NewPaletteType[]) => void,
}

// COMPONENT ---------------------------------------------------------------------------------------

export default function NewPalette({
  currentImage,
  currentPalette,
  newPalette,
  newPaletteIndex,
  setNewPalettes
} : Props) {

  // HOOKS -----------------------------------------------------------------------------------------

  const theme = useMantineTheme();
  const { supported, open } = useEyeDropper();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const originalCanvasRef = useRef<ImageData | null>(null);
  const { hovered, ref } = useHover();

  // This is the first time the canvas is rendered, so we need to draw the image on it
  
  useEffect(() => {
    if (currentImage) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const img = new Image();

      img.onload = () => {
        canvas.width = 128;
        canvas.height = 128;
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(img, 0, 0, 128, 128);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        originalCanvasRef.current = imageData;
        swapColors({
          originalData: originalCanvasRef.current,
          canvas,
          oldColors: currentPalette,
          newColors: newPalette.colors,
        });
      };

      img.src = currentImage;
    }
  }, [currentImage]);

  // Updates the canvas when the new palette changes

  useEffect(() => {
    if (!canvasRef.current) return;
    if (!originalCanvasRef.current) return;
    swapColors({
      originalData: originalCanvasRef.current,
      canvas: canvasRef.current,
      oldColors: currentPalette,
      newColors: newPalette.colors,
    });
  }, [JSON.stringify(currentPalette), JSON.stringify(newPalette)]);


  // FUNCTIONS -------------------------------------------------------------------------------------

  async function pickNewColor(paletteIndex: number, index: number) {
    try {
      const { sRGBHex } = await open();
      setNewPalettes((palettes) => {
        const newPalettes = [...palettes];
        newPalettes[paletteIndex].colors[index] = sRGBHex;
        return newPalettes;
      });
    } catch (e) {
      console.log(e);
    }
  };

  function namePalette(name: string, index: number) {
    setNewPalettes((palettes) => {
      const newPalettes = [...palettes];
      newPalettes[index].name = name;
      return newPalettes;
    });
  }

  // RENDER ----------------------------------------------------------------------------------------

  return (
    <Card
      key={newPaletteIndex}
      ref={ref}
      shadow="md"
      p={0}
      withBorder
      style={{
        overflow: 'visible',
      }}
    >

      <Group 
        position="apart"
        spacing={0}
      >

        <Stack 
          p="sm"
          style={{
            flex: 1,
          }}
        >

          <Group 
            position='apart'
            style={{
              alignItems: 'flex-start',
            }}
          >

          <TextInput
            icon={<Edit size={24}/>}
            variant="unstyled"
            placeholder="Palette Name"
            size="xs"
            styles={{
              input: {
                height: 2,
                fontSize: rem(24),
                fontWeight: 300,
              },
            }}
            value={newPalette.name}
            onChange={(event) => {
              namePalette(event.currentTarget.value, newPaletteIndex)
            }}
          />

          <Tooltip
            label="Generate Image"
            color="dark"
            position="left"
            withArrow
            arrowPosition="center"
          >
          
            <ActionIcon 
              variant="default"
              size={rem(40)}
              onClick={() => {
                if (!canvasRef.current) return;
                exportCanvasAsPNG({
                  canvas: canvasRef.current,
                  fileName: newPalette.name ? newPalette.name : 'untitled',
                }
              )}}
            >
              <FileExport size={24}/>
            </ActionIcon>

          </Tooltip>

          </Group>

          {/* COLOR PALETTE GROUP -------------------------------------------------------------- */}

          <Group spacing="xs">

            { newPalette.colors.map((color, index) => (
              
              <Box
                key={index}
                sx={{
                  position: 'relative',
                }}
              >

                <ActionIcon
                  variant="default"
                  size={rem(40)}
                  onClick={() => {
                    pickNewColor(newPaletteIndex, index)
                  }}
                  style={{
                    backgroundColor: newPalette.colors[index],
                  }}
                >

                  <ColorPicker size="1.5rem" />

                </ActionIcon>

                <CloseButton
                  size="xs"
                  onClick={() => {
                    setNewPalettes((palettes) => {
                      const newPalettes = [...palettes];
                      newPalettes[newPaletteIndex].colors
                        = newPalettes[newPaletteIndex].colors.filter((color, i) => i !== index);
                      if (newPalettes[newPaletteIndex].colors.length === 0) {
                        newPalettes[newPaletteIndex].colors.push('');
                      }
                      return newPalettes;
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

            {/* NEW COLOR BUTTON ------------------------------------------------------------- */}
            
            <Tooltip
              label="Add Color"
              color="dark"
              position="right"
              withArrow
              arrowPosition="center"
            >

              <ActionIcon
                variant="default"
                size={rem(40)}
                onClick={() => {
                  pickNewColor(newPaletteIndex, newPalette.colors.length)
                }}
              >
                <Plus size="1.25rem" />
              </ActionIcon>

            </Tooltip>

          </Group>
        
        </Stack>

        <Card
          style={{
            width: rem(128),
            height: rem(128),
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
            padding: 0,
            borderCollapse: 'collapse',
            backgroundColor: theme.colors.grey[7],
          }}
          withBorder
        >
          { currentImage
            ? <canvas ref={canvasRef} />
            : <Text align='center' p="md">Preview Image</Text>
          }
        </Card>

      </Group>

      {/* CLOSE BUTTON ------------------------------------------------------------------------- */}

      { hovered && (
        <CloseButton
          size="xs"
          onClick={() => {
            setNewPalettes((palettes) => {
              const newPalettes = [...palettes];
              newPalettes.splice(newPaletteIndex, 1);
              return newPalettes;
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
      )}

    </Card>
  )
}
