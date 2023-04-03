// TYPE --------------------------------------------------------------------------------------------

type Props = {
  canvas: HTMLCanvasElement;
  fileName: string;
};

// FUNCTION ----------------------------------------------------------------------------------------

export default function exportCanvasAsPNG({
  canvas,
  fileName
}: Props) {

  // Create a download link and set its attributes

  const downloadLink = document.createElement("a");
  downloadLink.setAttribute("download", `${fileName}.png`);

  // Resize the canvas to be 64x64 pixels

  const resizedCanvas = document.createElement('canvas');
  resizedCanvas.width = 64;
  resizedCanvas.height = 64;
  const resizedCtx = resizedCanvas.getContext('2d');
  if (!resizedCtx) return;
  resizedCtx.drawImage(canvas, 0, 0, 64, 64);

  // Export the resized canvas as a PNG
  
  resizedCanvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    downloadLink.setAttribute("href", url);
    downloadLink.click();
    URL.revokeObjectURL(url);
  }, "image/png", 1);
}