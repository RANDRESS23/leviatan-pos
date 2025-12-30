import * as XLSX from 'xlsx-js-style';

export interface ImportedClient {
  primer_nombre: string;
  segundo_nombre?: string;
  primer_apellido: string;
  segundo_apellido?: string;
  tipo_documento: string;
  numero_documento: string;
  email: string;
  telefono: string;
  direccion: string;
  estado: string;
}

export const extractExcelData = async (file: File): Promise<ImportedClient[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Leer la primera hoja (Clientes)
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convertir a formato JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
          header: 1,
          defval: '' // Valor por defecto para celdas vacías
        });
        
        // La primera fila son los encabezados
        const headers = jsonData[0] as string[];
        const rows = jsonData.slice(1) as string[][];
        
        // Validar encabezados requeridos
        const requiredHeaders = [
          'primer_nombre',
          'segundo_nombre',
          'primer_apellido',
          'segundo_apellido',
          'tipo_documento',
          'numero_documento',
          'email',
          'telefono',
          'direccion',
          'estado'
        ];
        
        // Limpiar encabezados (eliminar espacios y convertir a minúsculas)
        const cleanedHeaders = headers.map(h => h.toString().trim().toLowerCase());
        
        // Verificar si todos los encabezados requeridos están presentes
        const missingHeaders = requiredHeaders.filter(requiredHeader => {
          return !cleanedHeaders.includes(requiredHeader.toLowerCase());
        });
        
        // Verificar si hay encabezados incorrectos
        const incorrectHeaders = cleanedHeaders.filter(header => {
          return !requiredHeaders.includes(header) && header !== '';
        });
        
        if (missingHeaders.length > 0 || incorrectHeaders.length > 0) {
          const errorMessage = [
            'Error en el formato del archivo Excel:',
            '',
            'Columnas requeridas:',
            ...requiredHeaders.map(h => `  • ${h}`),
            ''
          ];
          
          if (missingHeaders.length > 0) {
            errorMessage.push('Columnas faltantes:');
            missingHeaders.forEach(h => errorMessage.push(`  • ${h}`));
            errorMessage.push('');
          }
          
          if (incorrectHeaders.length > 0) {
            errorMessage.push('Columnas incorrectas encontradas:');
            incorrectHeaders.forEach(h => errorMessage.push(`  • ${h}`));
            errorMessage.push('');
          }
          
          errorMessage.push(
            'Por favor, corrija los nombres de las columnas en su archivo Excel',
            'y asegúrese de usar exactamente los nombres listados arriba.',
            '',
            'Puede descargar una nueva plantilla desde el botón "Descargar".'
          );
          
          return reject(new Error(errorMessage.join('\n')));
        }
        
        // Mapear filas a objetos
        const clients: ImportedClient[] = rows
          .filter(row => row.some(cell => cell.trim() !== '')) // Filtrar filas vacías
          .map(row => {
            const client: ImportedClient = {
              primer_nombre: '',
              segundo_nombre: '',
              primer_apellido: '',
              segundo_apellido: '',
              tipo_documento: '',
              numero_documento: '',
              email: '',
              telefono: '',
              direccion: '',
              estado: ''
            };
            
            // Mapear cada columna según el encabezado
            headers.forEach((header, index) => {
              const value = row[index]?.toString().trim() || '';
              const cleanHeader = header.toString().trim().toLowerCase();
              
              switch (cleanHeader) {
                case 'primer_nombre':
                  client.primer_nombre = value;
                  break;
                case 'segundo_nombre':
                  client.segundo_nombre = value;
                  break;
                case 'primer_apellido':
                  client.primer_apellido = value;
                  break;
                case 'segundo_apellido':
                  client.segundo_apellido = value;
                  break;
                case 'tipo_documento':
                  client.tipo_documento = value;
                  break;
                case 'numero_documento':
                  client.numero_documento = value;
                  break;
                case 'email':
                  client.email = value;
                  break;
                case 'telefono':
                  client.telefono = value;
                  break;
                case 'direccion':
                  client.direccion = value;
                  break;
                case 'estado':
                  client.estado = value;
                  break;
              }
            });
            
            return client;
          });
        
        resolve(clients);
        
      } catch (error) {
        console.error('Error extrayendo datos del Excel:', error);
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error leyendo el archivo'));
    };
    
    reader.readAsArrayBuffer(file);
  });
};
