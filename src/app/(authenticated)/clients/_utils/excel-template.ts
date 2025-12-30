import * as XLSX from 'xlsx-js-style';

export interface ExcelTemplateData {
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

export const generateExcelTemplate = () => {
  // Datos de ejemplo para la plantilla
  const templateData: ExcelTemplateData[] = [
    {
      primer_nombre: 'Juan',
      segundo_nombre: 'Carlos',
      primer_apellido: 'Pérez',
      segundo_apellido: 'González',
      tipo_documento: 'Cédula de ciudadanía',
      numero_documento: '1234567890',
      email: 'juan.perez@example.com',
      telefono: '3001234567',
      direccion: 'Calle 123 #45-67',
      estado: 'ACTIVO'
    },
    {
      primer_nombre: 'María',
      segundo_nombre: '',
      primer_apellido: 'Rodríguez',
      segundo_apellido: 'López',
      tipo_documento: 'Cédula de ciudadanía',
      numero_documento: '0987654321',
      email: 'maria.rodriguez@example.com',
      telefono: '3109876543',
      direccion: 'Avenida 45 #67-89',
      estado: 'ACTIVO'
    }
  ];

  // Crear el workbook y worksheet
  const wb = XLSX.utils.book_new();
  
  // Construir worksheet manualmente para poder aplicar estilos
  const headers = Object.keys(templateData[0]);
  const ws_data = [
    headers, // Encabezados
    ...templateData.map(row => headers.map(header => row[header as keyof ExcelTemplateData]))
  ];
  
  const ws = XLSX.utils.aoa_to_sheet(ws_data);

  // Aplicar negrita y fondo a los encabezados (primera fila)
  for (let col = 0; col < headers.length; col++) {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
    if (!ws[cellAddress]) continue;
    
    ws[cellAddress].s = {
      font: { 
        bold: true,
        sz: 12
      },
      fill: { 
        patternType: "solid",
        fgColor: { rgb: "F2F2F2" }
      },
      alignment: { 
        horizontal: "center", 
        vertical: "center",
        wrapText: true
      },
      border: {
        top: { style: "thin", color: { auto: 1 } },
        bottom: { style: "thin", color: { auto: 1 } },
        left: { style: "thin", color: { auto: 1 } },
        right: { style: "thin", color: { auto: 1 } }
      }
    };
  }

  // Configurar anchos de columna
  const colWidths = [
    { wch: 15 }, // primer_nombre
    { wch: 15 }, // segundo_nombre
    { wch: 15 }, // primer_apellido
    { wch: 15 }, // segundo_apellido
    { wch: 20 }, // tipo_documento
    { wch: 12 }, // numero_documento
    { wch: 28 }, // email
    { wch: 12 }, // telefono
    { wch: 25 }, // direccion
    { wch: 8 },  // estado
  ];
  ws['!cols'] = colWidths;

  // Agregar la hoja de clientes al workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Clientes');

  // Crear segunda hoja con tipos de documento
  const tiposDocumento = [
    'Registro civil',
    'Tarjeta de identidad',
    'Cédula de ciudadanía',
    'Tarjeta de extranjería',
    'Cédula de extranjería',
    'NIT',
    'Pasaporte',
    'Documento de identificación extranjero',
    'PEP',
    'NIT otro país',
    'NUIP',
    'PPT (Permiso Protección Temporal)'
  ];

  // Crear worksheet para tipos de documento
  const tipos_data = [
    ['Tipo de Documento', 'Descripción'],
    ...tiposDocumento.map(tipo => [tipo, 'Use este valor exacto en la columna tipo_documento'])
  ];
  
  const ws_tipos = XLSX.utils.aoa_to_sheet(tipos_data);

  // Aplicar estilos a los encabezados de la segunda hoja
  for (let col = 0; col < 2; col++) {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
    if (!ws_tipos[cellAddress]) continue;
    
    ws_tipos[cellAddress].s = {
      font: { 
        bold: true,
        sz: 12
      },
      fill: { 
        patternType: "solid",
        fgColor: { rgb: "E3F2FD" } // Color azul claro para diferenciar
      },
      alignment: { 
        horizontal: "center", 
        vertical: "center",
        wrapText: true
      },
      border: {
        top: { style: "thin", color: { auto: 1 } },
        bottom: { style: "thin", color: { auto: 1 } },
        left: { style: "thin", color: { auto: 1 } },
        right: { style: "thin", color: { auto: 1 } }
      }
    };
  }

  // Configurar anchos para la segunda hoja
  ws_tipos['!cols'] = [
    { wch: 50 }, // Tipo de Documento
    { wch: 50 }, // Descripción
  ];

  // Agregar la segunda hoja al workbook
  XLSX.utils.book_append_sheet(wb, ws_tipos, 'TiposDocumento');

  // Crear tercera hoja con tipos de estado
  const tiposEstado = [
    'ACTIVO',
    'INACTIVO'
  ];

  // Crear worksheet para tipos de estado
  const tiposEstado_data = [
    ['Tipo de Estado', 'Descripción'],
    ...tiposEstado.map(tipo => [tipo, 'Use este valor exacto en la columna Estado'])
  ];
  
  const ws_tiposEstado = XLSX.utils.aoa_to_sheet(tiposEstado_data);

  // Aplicar estilos a los encabezados de la tercera hoja
  for (let col = 0; col < 2; col++) {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
    if (!ws_tiposEstado[cellAddress]) continue;
    
    ws_tiposEstado[cellAddress].s = {
      font: { 
        bold: true,
        sz: 12
      },
      fill: { 
        patternType: "solid",
        fgColor: { rgb: "E3F2FD" } // Color azul claro para diferenciar
      },
      alignment: { 
        horizontal: "center", 
        vertical: "center",
        wrapText: true
      },
      border: {
        top: { style: "thin", color: { auto: 1 } },
        bottom: { style: "thin", color: { auto: 1 } },
        left: { style: "thin", color: { auto: 1 } },
        right: { style: "thin", color: { auto: 1 } }
      }
    };
  }

  // Configurar anchos para la tercera hoja
  ws_tiposEstado['!cols'] = [
    { wch: 20 }, // Tipo de Estado
    { wch: 50 }, // Descripción
  ];

  // Agregar la tercera hoja al workbook
  XLSX.utils.book_append_sheet(wb, ws_tiposEstado, 'TiposEstado');

  // Generar el archivo Excel
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

  // Crear un Blob
  const blob = new Blob([excelBuffer], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
  });

  return blob;
};

export const downloadExcelTemplate = () => {
  try {
    const blob = generateExcelTemplate();
    
    // Crear URL para descargar
    const url = window.URL.createObjectURL(blob);
    
    // Crear enlace temporal
    const link = document.createElement('a');
    link.href = url;
    link.download = `plantilla_clientes_${new Date().toISOString().split('T')[0]}.xlsx`;
    
    // Simular click
    document.body.appendChild(link);
    link.click();
    
    // Limpiar
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    return { success: true, message: 'Plantilla descargada exitosamente' };
  } catch (error) {
    console.error('Error descargando plantilla:', error);
    return { success: false, message: 'Error al descargar la plantilla' };
  }
};
