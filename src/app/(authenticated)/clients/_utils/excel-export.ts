import * as XLSX from 'xlsx-js-style';
import { db } from '@/lib/prisma';

interface ClientData {
  primer_nombre: string;
  segundo_nombre: string;
  primer_apellido: string;
  segundo_apellido: string;
  tipo_documento: string;
  numero_documento: string;
  email: string;
  telefono: string;
  direccion: string;
  estado: string;
}

interface TipoDocData {
  tipo_documento: string;
  descripcion: string;
}

interface EstadoData {
  estado: string;
  descripcion: string;
}

export function exportClientsToExcel({ clientes, tiposDocumento }: { clientes: any[], tiposDocumento: any[] }) {
  try {
    // Crear el workbook
    const wb = XLSX.utils.book_new();

    // 1. Hoja de Clientes
    const clientesData: ClientData[] = clientes.map((cliente: any, index: number) => ({
      'primer_nombre': cliente.primer_nombre || '',
      'segundo_nombre': cliente.segundo_nombre || '',
      'primer_apellido': cliente.primer_apellido || '',
      'segundo_apellido': cliente.segundo_apellido || '',
      'tipo_documento': cliente.tipoDocumento?.tipoDocumento || '',
      'numero_documento': cliente.numeroDocumento || '',
      'email': cliente.email || '',
      'telefono': cliente.telefono || '',
      'direccion': cliente.direccion || '',
      'estado': cliente.activo ? 'ACTIVO' : 'INACTIVO'
    }));

    // Crear worksheet para clientes con estilos
    const wsClientes = XLSX.utils.aoa_to_sheet([
      [
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
      ],
      ...clientesData.map((cliente: ClientData) => [
        cliente.primer_nombre,
        cliente.segundo_nombre,
        cliente.primer_apellido,
        cliente.segundo_apellido,
        cliente.tipo_documento,
        cliente.numero_documento,
        cliente.email,
        cliente.telefono,
        cliente.direccion,
        cliente.estado
      ])
    ]);

    // Aplicar estilos a la hoja de clientes
    const rangeClientes = XLSX.utils.decode_range(wsClientes['!ref'] || 'A1:J1');
    
    // Estilo para encabezados
    const headerStyle = {
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

    // Aplicar estilos a encabezados
    for (let col = rangeClientes.s.c; col <= rangeClientes.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
      if (!wsClientes[cellAddress]) continue;
      
      wsClientes[cellAddress].s = headerStyle;
    }

    // Configurar anchos de columna
    const colWidths = [
      { wch: 15 }, // primer_nombre
      { wch: 17 }, // segundo_nombre
      { wch: 15 }, // primer_apellido
      { wch: 17 }, // segundo_apellido
      { wch: 20 }, // tipo_documento
      { wch: 20 }, // numero_documento
      { wch: 28 }, // email
      { wch: 12 }, // telefono
      { wch: 25 }, // direccion
      { wch: 8 },  // estado
    ];
    wsClientes['!cols'] = colWidths;

    // Aplicar estilos a datos
    for (let row = 1; row <= rangeClientes.e.r; row++) {
      for (let col = rangeClientes.s.c; col <= rangeClientes.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
        if (!wsClientes[cellAddress]) continue;
        
        wsClientes[cellAddress].s = dataStyle;
      }
    }

    // 2. Hoja de TiposDocumento
    const tiposDocData: TipoDocData[] = tiposDocumento.map((tipo: any) => ({
      'tipo_documento': tipo.tipoDocumento,
      'descripcion': "Use este valor exacto en la columna tipo_documento"
    }));

    const wsTiposDoc = XLSX.utils.aoa_to_sheet([
      ['Tipo de Documento', 'Descripción'],
      ...tiposDocData.map((tipo: TipoDocData) => [tipo.tipo_documento, tipo.descripcion])
    ]);

    // Aplicar estilos a hoja de tipos de documento
    const rangeTiposDoc = XLSX.utils.decode_range(wsTiposDoc['!ref'] || 'A1:B1');
    
    for (let col = rangeTiposDoc.s.c; col <= rangeTiposDoc.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
      if (!wsTiposDoc[cellAddress]) continue;
      
      wsTiposDoc[cellAddress].s = headerStyle;
    }

    for (let row = 1; row <= rangeTiposDoc.e.r; row++) {
      for (let col = rangeTiposDoc.s.c; col <= rangeTiposDoc.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
        if (!wsTiposDoc[cellAddress]) continue;
        
        wsTiposDoc[cellAddress].s = dataStyle;
      }
    }

    // Ajustar ancho de columnas para tipos de documento
    if (!wsTiposDoc['!cols']) wsTiposDoc['!cols'] = [];
    wsTiposDoc['!cols'] = [
      { width: 50 }, // TIPO DOCUMENTO
      { width: 50 }  // DESCRIPCIÓN
    ];

    // 3. Hoja de TiposEstado
    const estadosData: EstadoData[] = [
      { 'estado': 'ACTIVO', 'descripcion': 'Use este valor exacto en la columna Estado' },
      { 'estado': 'INACTIVO', 'descripcion': 'Use este valor exacto en la columna Estado' }
    ];

    const wsEstados = XLSX.utils.aoa_to_sheet([
      ['Tipo de Estado', 'Descripción'],
      ...estadosData.map((estado: EstadoData) => [estado.estado, estado.descripcion])
    ]);

    // Aplicar estilos a hoja de estados
    const rangeEstados = XLSX.utils.decode_range(wsEstados['!ref'] || 'A1:B1');
    
    for (let col = rangeEstados.s.c; col <= rangeEstados.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
      if (!wsEstados[cellAddress]) continue;
      
      wsEstados[cellAddress].s = headerStyle;
    }

    for (let row = 1; row <= rangeEstados.e.r; row++) {
      for (let col = rangeEstados.s.c; col <= rangeEstados.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
        if (!wsEstados[cellAddress]) continue;
        
        wsEstados[cellAddress].s = dataStyle;
      }
    }

    // Ajustar ancho de columnas para estados
    if (!wsEstados['!cols']) wsEstados['!cols'] = [];
    wsEstados['!cols'] = [
      { width: 20 }, // ESTADO
      { width: 50 }  // DESCRIPCIÓN
    ];

    // Agregar hojas al workbook
    XLSX.utils.book_append_sheet(wb, wsClientes, "Clientes");
    XLSX.utils.book_append_sheet(wb, wsTiposDoc, "TiposDocumento");
    XLSX.utils.book_append_sheet(wb, wsEstados, "TiposEstado");

    // Generar el archivo Excel
    const excelBuffer = XLSX.write(wb, { 
      bookType: 'xlsx', 
      type: 'array',
      cellStyles: true
    });

    // Retornar el buffer para que la acción del servidor lo maneje
    return {
      success: true,
      buffer: excelBuffer,
      fileName: `clientes_exportados_${new Date().toISOString().split('T')[0]}.xlsx`
    };
  } catch (error) {
    console.error("Error al exportar clientes:", error);

    return { 
      success: false, 
      message: "¡Error al exportar los clientes. Por favor, intente nuevamente!" 
    };
  }
}
