import rgbToHex from "./rgbToHex";

// TYPES -------------------------------------------------------------------------------------------

type Props = {
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
}

// FUNCTION -----------------------------------------------------------------------------------------

export default function detectCurrentCanvasColors({
  ctx,
  canvas,
}: Props) {

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixelArray = imageData.data;
  const colors: { hex: string; brightness: number }[] = [];

  for (let i = 0; i < pixelArray.length; i += 4) {
    const r = pixelArray[i];
    const g = pixelArray[i + 1];
    const b = pixelArray[i + 2];
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    const hex = rgbToHex(r, g, b);

    if (hex === '#000000') {
      continue; // skip black color
    }

    if (!colors.some((c) => c.hex === hex)) {
      colors.push({ hex, brightness });
    }
    
  }

  // Sort colors by brightness

  colors.sort((a, b) => b.brightness - a.brightness).reverse();

  // Return colors

  return colors.map((c) => c.hex);
}