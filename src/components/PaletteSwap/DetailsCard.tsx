import { Card, Title, Text } from '@mantine/core'

// COMPONENT ---------------------------------------------------------------------------------------

export default function DetailsCard() {
  return (
    <Card
      shadow="md"
      withBorder
    >
    
      <Title
        order={1}
        mb="md"
      >
        Sprite Palette Swapper
      </Title>

      <Text>
        {`
        Welcome to the Sprite Palette Swapper! 
        This tool currently allows you to choose 
        a 64x64 image and swap the colors of the 
        image with a palette or multiple palettes 
        of your choosing. The image will be saved 
        as a PNG file.
        
        To get started, drag and drop an image
        into the dropzone or click the dropzone
        to open a file explorer. Once you have
        an image loaded, you can choose a color
        from the image and add it to the current
        palette. You can also add a new palette
        and add colors to that palette. Once you
        have a palette with colors, you can swap
        the colors of the image with the colors
        in the palette. You can also save the
        image with the new colors.

        This tool is still in development, so
        please report any bugs or issues you
        encounter.
        `}
      </Text>

    </Card>
  )
}
