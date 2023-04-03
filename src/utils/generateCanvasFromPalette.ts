import swapColors from "./swapCanvasColors";

// TYPES -------------------------------------------------------------------------------------------

type Props = {
  newColors: string[];
  width: number;
  height: number;
  image: string;
  oldColors: string[];
};

// FUNCTION -----------------------------------------------------------------------------------------

export default function generateCanvasFromPalette({
  newColors,
  width,
  height,
  image,
  oldColors
}: Props): Promise<HTMLCanvasElement> {

  // Return promise

  return new Promise((resolve, reject) => {

    // Create canvas and context

    const canvas = document.createElement('canvas');
    if (!canvas) reject('Canvas creation failed');
    const ctx = canvas.getContext('2d');
    if (!ctx) reject('Context creation failed');
    const img = new Image();

    // Load image and draw it on canvas

    img.onload = () => {
      if (ctx) {
        canvas.width = width;
        canvas.height = height;
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(img, 0, 0, width, height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.width = width;
        canvas.height = height;
        ctx.putImageData(imageData, 0, 0);
        swapColors({
          canvas,
          oldColors,
          newColors: newColors,
          originalData: imageData,
        });
        resolve(canvas);
      } else {
        reject('Context creation failed');
      }
    };

    // Handle image load error

    img.onerror = () => {
      reject('Image load failed');
    }

    // Load image

    img.src = image;

  });
}