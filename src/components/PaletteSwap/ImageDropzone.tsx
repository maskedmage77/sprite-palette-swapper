import { rem, Stack, Text } from '@mantine/core'
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone'
import { modals } from '@mantine/modals';
import { useEffect, useRef } from 'react';
import detectCurrentCanvasColors from '../../utils/detectCurrentCanvasColors';
import rgbToHex from '../../utils/rgbToHex';

// PROPS -------------------------------------------------------------------------------------------

type Props = {
  handleFileInputChange: (file: any) => void,
  currentImage: string,
  setCurrentPalette: (colors: string[]) => void,
}

// COMPONENT ---------------------------------------------------------------------------------------

export default function ImageDropzone({
  handleFileInputChange,
  currentImage,
  setCurrentPalette,
}: Props) {
  
  // HOOKS -----------------------------------------------------------------------------------------
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (currentImage) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const img = new Image();
  
      img.onload = () => {
        canvas.width = 512;
        canvas.height = 512;
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(img, 0, 0, 512, 512);

        modals.openConfirmModal({
          centered: true,
          title: 'Auto-Detect Colors?',
          children: (
            <Text size="sm">
              Would you like to auto-detect the colors in this image?
            </Text>
          ),
          labels: { confirm: 'Yes', cancel: 'No' },
          onConfirm: () => {
            setCurrentPalette(
              detectCurrentCanvasColors({
                canvas,
                ctx
              })
            );
          },
        });

      };
  
      img.src = currentImage;
    }
  }, [currentImage]);

  // FUNCTIONS -------------------------------------------------------------------------------------

  // RENDER ----------------------------------------------------------------------------------------

  return (
    <Dropzone
      onDrop={(files) => handleFileInputChange(files[0])}
      onReject={(files) => console.log('rejected files', files)}
      maxSize={3 * 1024 ** 2}
      accept={IMAGE_MIME_TYPE}
      multiple={false}
      style={{
        width: rem(512),
        height: rem(512),
        padding: rem(16),
      }}
      styles={{
        inner: {
          height: '100%',
        }
      }}
    >
      <Stack
        justify="center"
        spacing="xl"
        align="center"
        style={{
          pointerEvents: 'none',
          height: '100%',
        
        }}
      >
      
        { currentImage ? (
          <canvas ref={canvasRef} />
        ) : (
          <>
            <Text size="xl" inline>
              Drag images here or click to select files
            </Text>
            <Text size="sm" color="dimmed" inline mt={7}>
              The file should be less than 3MB and only 64x64 pixels
            </Text>
          </>
        )}
        
      </Stack>

    </Dropzone>
  )
}
