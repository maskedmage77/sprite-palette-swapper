import { Container, Group, rem, Card, Title, Stack, Button, ActionIcon, Tooltip } from '@mantine/core'
import { CurrentPalette, ImageDropzone, NewPalette } from '../components/PaletteSwap';
import generateAllImagesFromPalettes from '../utils/generateAllImagesFromPalettes';
import { FileExport, FileImport, Plus } from 'tabler-icons-react';
import DetailsCard from '../components/PaletteSwap/DetailsCard';
import useSelectJsonFile from '../hooks/useSelectJsonFile';
import NewPaletteType from '../types/NewPaletteType';
import { useState } from 'react'

// COMPONENT ---------------------------------------------------------------------------------------

export default function PaletteSwaps() {

  // HOOKS -----------------------------------------------------------------------------------------
  
  const [currentImage , setCurrentImage] = useState<string>('');
  const [currentPalette, setCurrentPalette] = useState<string[]>(['']);
  const { selectJsonFile } = useSelectJsonFile();
  const [newPalettes, setNewPalettes] = useState<NewPaletteType[]>([
    {
      name: 'Palette 1',
      colors: [''],
    },
  ]);

  // FUNCTIONS -------------------------------------------------------------------------------------

  async function handleFileInputChange(file: any) {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setCurrentImage(url);
  };

  // RENDER ----------------------------------------------------------------------------------------

  return (
    <Container
      my="xl"
    >

      <Stack>

      {/* DETAILS CARD ------------------------------------------------------------------------- */}

      <DetailsCard />

        <Group
          align='flex-start'
          noWrap
        >

          {/* DROPZONE ------------------------------------------------------------------------- */}
          
          <ImageDropzone
            handleFileInputChange={handleFileInputChange}
            currentImage={currentImage}
            setCurrentPalette={setCurrentPalette}
          />

          {/* CURRENT PALETTE ------------------------------------------------------------------ */}

          <Stack>
  
            <CurrentPalette
              currentColors={currentPalette}
              setCurrentColors={setCurrentPalette}
            />

            {/* OPTIONS ------------------------------------------------------------------------ */}

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
                mb="sm"
              >
                Palettes
              </Title>

              <Group>

                {/* Add Palette */}

                <Tooltip
                  label="Add Palette"
                  color="dark"
                  position="top"
                  withArrow
                  arrowPosition="center"
                >
                  <ActionIcon
                    variant="default"
                    size={rem(40)}
                    onClick={() => {
                      setNewPalettes((palettes) => {
                        const newPalettes = [...palettes];
                        newPalettes.unshift({
                          name: '',
                          colors: [''],
                        });
                        return newPalettes;
                      });
                    }}
                  >
                    <Plus/>
                  </ActionIcon>
                </Tooltip>

                {/* Import Palettes from JSON */}

                <Tooltip
                  label="Import Palettes"
                  color="dark"
                  position="top"
                  withArrow
                  arrowPosition="center"
                >
                  <ActionIcon
                    variant="default"
                    size={rem(40)}
                    onClick={async () => {
                      setNewPalettes(await selectJsonFile());
                    }}
                  >
                    <FileImport/>
                  </ActionIcon>
                </Tooltip>

                {/* Export Palettes to JSON */}

                <Tooltip
                  label="Export Palettes"
                  color="dark"
                  position="top"
                  withArrow
                  arrowPosition="center"
                >
                  <ActionIcon
                    variant="default"
                    size={rem(40)}
                    onClick={() => {
                      let jsonFile = JSON.stringify(newPalettes);
                      let blob = new Blob([jsonFile], {type: "application/json"});
                      let url  = URL.createObjectURL(blob);
                      let a = document.createElement('a');
                      a.download = "palettes.json";
                      a.href = url;
                      a.click();
                    }}
                  >
                    <FileExport/>
                  </ActionIcon>
                </Tooltip>

              </Group>

              <Title 
                order={3}
                mt="md"
                mb="sm"
              >
                Other
              </Title>

              {/* Generate All Images */}

              <Button
                color="dark"
                onClick={() => {
                  generateAllImagesFromPalettes({
                    newPalettes,
                    currentImage,
                    currentPalette,
                  });
                }}
              >
                Generate All Images
              </Button>

            </Card>
          
          </Stack>

        </Group>

        {/* NEW PALETTES ----------------------------------------------------------------------- */}

        { newPalettes.map((newPalette, newPaletteIndex) => (

          <NewPalette
            key={newPaletteIndex}
            currentImage={currentImage}
            currentPalette={currentPalette}
            newPalette={newPalette}
            newPaletteIndex={newPaletteIndex} 
            setNewPalettes={setNewPalettes}
          />

        ))}

      </Stack>

        {/* CLOSING TAGS ----------------------------------------------------------------------- */}

    </Container>
  )
}

