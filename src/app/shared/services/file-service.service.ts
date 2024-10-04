import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as JSZip from 'jszip';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class FileServiceService {

  constructor(private http: HttpClient) {}

  downloadFilesAsZip(archivos: { fileName: string }[]) {
    const zip = new JSZip();
    const folder = zip.folder('archivos')!; // Carpeta dentro del ZIP

    const promesas = archivos.map(archivo => {
      return this.http.get(archivo.fileName, { responseType: 'blob' }).toPromise().then(blob => {
        const nombreArchivo = this.getFileNameFromUrl(archivo.fileName);
        folder.file(nombreArchivo, blob);
      });
    });

    // Esperar que todas las promesas se resuelvan
    Promise.all(promesas).then(() => {
      zip.generateAsync({ type: 'blob' }).then(content => {
        // Guardar el archivo ZIP en el navegador
        saveAs(content, 'archivos.zip');
      });
    }).catch(error => {
      console.error('Error al generar el archivo ZIP:', error);
    });
  }

  // Función para obtener el nombre del archivo desde la URL
  getFileNameFromUrl(url: string): string {
    return url.split('/').pop() || 'archivo-sin-nombre';
  }
}
