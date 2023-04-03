import generateCanvasFromPalette from "./generateCanvasFromPalette";
import createBlobFromCanvas from "./createBlobFromCanvas";
import { notifications } from "@mantine/notifications";
import NewPaletteType from "../types/NewPaletteType";
import generateZipFolder from "./generateZipFolder";
import { Check } from "tabler-icons-react";
import { rem } from "@mantine/core";

// TYPES -------------------------------------------------------------------------------------------

type Props = {
  newPalettes: NewPaletteType[];
  currentPalette: string[];
  currentImage: string;
  showNotification?: boolean;
};

// FUNCTION ----------------------------------------------------------------------------------------

export default async function generateAllImagesFromPalettes({
  newPalettes,
  currentPalette,
  currentImage,
  showNotification = true,
}: Props ) {

  // declare variables

  let startTime;
  let endTime;
  let timeInSeconds;

  // show generating images notification

  if (showNotification) {
    notifications.show({
      id: 'generatingImages',
      title: "Generating images...",
      message: "This may take a while...",
      loading: true,
    });

    startTime = performance.now();
  }

  // generate images
    
  const promises = newPalettes.map(async (palette, index) => {
    const canvas = await generateCanvasFromPalette({
      newColors: palette.colors,
      width: 64,
      height: 64,
      image: currentImage,
      oldColors: currentPalette,
    });

    const blob = await createBlobFromCanvas(canvas);
    const fileName = (palette.name ? palette.name : index) + ".png";

    return {
      fileName,
      blob,
    };
  });

  const images = await Promise.all(promises);

  // generate zip folder

  const zipFolder = await generateZipFolder(images);

  // download zip folder

  const url = URL.createObjectURL(zipFolder);
  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = "images.zip";
  downloadLink.click();
  URL.revokeObjectURL(url);

  // show images generated notification

  if (startTime) {
    endTime = performance.now();
    timeInSeconds = ((endTime - startTime) / 1000).toFixed(2);
  }

  if (showNotification) {
    notifications.hide('generatingImages');

    notifications.show({
      id: 'imagesGenerated',
      title: "Images generated!",
      message: `It took ${timeInSeconds} seconds to generate all images.`,
      color: 'green',
      icon: <Check size={rem(16)}/>,
    });
  }
}