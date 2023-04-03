import hexToRgb from "./hexToRgb";
import rgbToHex from "./rgbToHex";

type Props = {
  canvas: HTMLCanvasElement;
  oldColors: string[];
  newColors: string[];
  originalData: ImageData; // Add a new prop to store the original data
};

export default function swapColors({ canvas, oldColors, newColors, originalData }: Props) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Make a copy of the original data
  const imageData = new ImageData(originalData.width, originalData.height);
  imageData.data.set(originalData.data);

  const pixels = imageData.data;
  const numPixels = pixels.length / 4; // 4 components per pixel (RGBA)
  
  for (let i = 0; i < numPixels; i++) {
    const r = pixels[i * 4];
    const g = pixels[i * 4 + 1];
    const b = pixels[i * 4 + 2];
    const hexColor = rgbToHex(r, g, b);
    
    const index = oldColors.indexOf(hexColor);
    if (index !== -1) {
      const newColor = newColors[index];
      const newRgb = hexToRgb(newColor);
      if (!newRgb) continue;
      pixels[i * 4] = newRgb.r;
      pixels[i * 4 + 1] = newRgb.g;
      pixels[i * 4 + 2] = newRgb.b;
    }
  }

  // Update the canvas with the modified data
  ctx.putImageData(imageData, 0, 0);
}
