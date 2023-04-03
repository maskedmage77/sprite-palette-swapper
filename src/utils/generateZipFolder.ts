import JSZip from 'jszip';

// TYPES ---------------------------------------------------------------------------------------------

type BlobWithName = {
  blob: Blob;
  fileName: string;
};

// FUNCTION -----------------------------------------------------------------------------------------

export default async function generateZipFolder(files: BlobWithName[]): Promise<Blob> {
  const zip = new JSZip();

  files.forEach(({ blob, fileName }) => {
    zip.file(fileName, blob);
  });

  const zipBlob = await zip.generateAsync({ type: 'blob' });

  return zipBlob;
}