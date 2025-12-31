import * as XLSX from 'xlsx-js-style';

export interface ExcelTemplateData {
  nit?: string;
  nombre: string;
  telefono: string;
  direccion: string;
  tipo_proveedor: string;
  descripcion?: string;
  estado: string;
}

export const generateExcelTemplate = () => {
  // Datos de ejemplo para la plantilla
  const templateData: ExcelTemplateData[] = [
    {
      nit: '1234567890',
      nombre: 'Carlos',
      telefono: '3201234567',
      direccion: 'Calle 123 #45-67',
      tipo_proveedor: 'Natural',
      descripcion: 'Proveedor natural',
      estado: 'ACTIVO'
    },
    {
      nit: '0987654321',
      nombre: 'María',
      telefono: '3001234567',
      tipo_proveedor: 'Empresa',
      direccion: 'Avenida 45 #67-89',
      descripcion: 'Proveedor empresa',
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
        fgColor: { rgb: "E3F2FD" }
      },
      alignment: { 
        horizontal: "center", 
        vertical: "center",
        wrapText: false
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
    { wch: 20 }, // nit
    { wch: 17 }, // nombre
    { wch: 12 }, // telefono
    { wch: 25 }, // direccion
    { wch: 20 }, // tipo_proveedor
    { wch: 20 }, // descripcion
    { wch: 8 },  // estado
  ];
  ws['!cols'] = colWidths;

  // Estilo para datos
  const dataStyle = {
    font: { sz: 11 },
    alignment: { 
      horizontal: "left", 
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

  // Aplicar estilos a la hoja de proveedores
  const rangeProveedores = XLSX.utils.decode_range(ws['!ref'] || 'A1:J1');

  // Aplicar estilos a datos
  for (let row = 1; row <= rangeProveedores.e.r; row++) {
    for (let col = rangeProveedores.s.c; col <= rangeProveedores.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
      if (!ws[cellAddress]) continue;
      
      ws[cellAddress].s = dataStyle;
    }
  }

  // Agregar la hoja de proveedores al workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Proveedores');

  // Crear segunda hoja con tipos de proveedor
  const tiposProveedor = [
    'Natural',
    'Empresa',
  ];

  // Crear worksheet para tipos de proveedor
  const tipos_data = [
    ['Tipo de Proveedor', 'Descripción'],
    ...tiposProveedor.map(tipo => [tipo, 'Use este valor exacto en la columna tipo_proveedor'])
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

  // Aplicar estilos a hoja de tipos de proveedor
  const rangeTiposProveedor = XLSX.utils.decode_range(ws_tipos['!ref'] || 'A1:B1');

  for (let row = 1; row <= rangeTiposProveedor.e.r; row++) {
    for (let col = rangeTiposProveedor.s.c; col <= rangeTiposProveedor.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
      if (!ws_tipos[cellAddress]) continue;
      
      ws_tipos[cellAddress].s = dataStyle;
    }
  }

  // Configurar anchos para la segunda hoja
  ws_tipos['!cols'] = [
    { wch: 50 }, // Tipo de Proveedor
    { wch: 50 }, // Descripción
  ];

  // Agregar la segunda hoja al workbook
  XLSX.utils.book_append_sheet(wb, ws_tipos, 'TiposProveedor');

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

  // Aplicar estilos a hoja de estados
  const rangeEstados = XLSX.utils.decode_range(ws_tiposEstado['!ref'] || 'A1:B1'); 

  for (let row = 1; row <= rangeEstados.e.r; row++) {
    for (let col = rangeEstados.s.c; col <= rangeEstados.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
      if (!ws_tiposEstado[cellAddress]) continue;
      
      ws_tiposEstado[cellAddress].s = dataStyle;
    }
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
    link.download = `plantilla_proveedores_${new Date().toISOString().split('T')[0]}.xlsx`;
    
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
