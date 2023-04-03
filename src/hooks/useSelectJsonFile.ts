import { useState } from "react";

export default function useSelectJsonFile() {

  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const selectJsonFile = () => {
    return new Promise<any>((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
  
      input.onchange = (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.readAsText(file);
          reader.onload = () => {
            let importedData = reader.result as string;
            setSelectedFile(importedData);
            importedData = JSON.parse(importedData);
            resolve(importedData);
          };
          reader.onerror = () => {
            reject(reader.error);
          }
        }
      };
  
      input.click();
    });
  };

  return {
    selectedFile,
    selectJsonFile
  };
}