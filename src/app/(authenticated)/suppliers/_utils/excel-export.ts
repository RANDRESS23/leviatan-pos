import * as XLSX from 'xlsx-js-style';
import { db } from '@/lib/prisma';

interface SupplierData {
  nit: string;
  nombre: string;
  telefono: string;
  direccion: string;
  tipo_proveedor: string;
  descripcion: string;
  estado: string;
}

interface TipoProveedorData {
  tipo_proveedor: string;
  descripcion: string;
}

interface EstadoData {
  estado: string;
  descripcion: string;
}

export function exportSuppliersToExcel({ proveedores }: { proveedores: any[] }) {
  try {
    // Crear el workbook
    const wb = XLSX.utils.book_new();

    // 1. Hoja de Proveedores
    const proveedoresData: SupplierData[] = proveedores.map((proveedor: any, index: number) => ({
      'nit': proveedor.nit || '',
      'nombre': proveedor.nombre || '',
      'telefono': proveedor.telefono || '',
      'direccion': proveedor.direccion || '',
      'tipo_proveedor': proveedor.tipoProveedor || '',
      'descripcion': proveedor.descripcion || '',
      'estado': proveedor.activo ? 'ACTIVO' : 'INACTIVO'
    }));

    // Crear worksheet para proveedores con estilos
    const wsProveedores = XLSX.utils.aoa_to_sheet([
      [
        'nit',
        'nombre', 
        'telefono',
        'direccion',
        'tipo_proveedor',
        'descripcion',
        'estado'
      ],
      ...proveedoresData.map((proveedor: SupplierData) => [
        proveedor.nit,
        proveedor.nombre,
        proveedor.telefono,
        proveedor.direccion,
        proveedor.tipo_proveedor,
        proveedor.descripcion,
        proveedor.estado
      ])
    ]);

    // Aplicar estilos a la hoja de proveedores
    const rangeProveedores = XLSX.utils.decode_range(wsProveedores['!ref'] || 'A1:J1');
    
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
    for (let col = rangeProveedores.s.c; col <= rangeProveedores.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
      if (!wsProveedores[cellAddress]) continue;
      
      wsProveedores[cellAddress].s = headerStyle;
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
    wsProveedores['!cols'] = colWidths;

    // Aplicar estilos a datos
    for (let row = 1; row <= rangeProveedores.e.r; row++) {
      for (let col = rangeProveedores.s.c; col <= rangeProveedores.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
        if (!wsProveedores[cellAddress]) continue;
        
        wsProveedores[cellAddress].s = dataStyle;
      }
    }

    const tiposProveedor = [
      { 'tipo_proveedor': 'Natural', 'descripcion': 'Use este valor exacto en la columna tipo_proveedor' },
      { 'tipo_proveedor': 'Empresa', 'descripcion': 'Use este valor exacto en la columna tipo_proveedor' },
    ];

    // 2. Hoja de TiposProveedor
    const tiposProveedorData: TipoProveedorData[] = tiposProveedor.map((tipo: any) => ({
      'tipo_proveedor': tipo.tipo_proveedor,
      'descripcion': "Use este valor exacto en la columna tipo_proveedor"
    }));

    const wsTiposProveedor = XLSX.utils.aoa_to_sheet([
      ['Tipo de Proveedor', 'Descripción'],
      ...tiposProveedorData.map((tipo: TipoProveedorData) => [tipo.tipo_proveedor, tipo.descripcion])
    ]);

    // Aplicar estilos a hoja de tipos de documento
    const rangeTiposProveedor = XLSX.utils.decode_range(wsTiposProveedor['!ref'] || 'A1:B1');
    
    for (let col = rangeTiposProveedor.s.c; col <= rangeTiposProveedor.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
      if (!wsTiposProveedor[cellAddress]) continue;
      
      wsTiposProveedor[cellAddress].s = headerStyle;
    }

    for (let row = 1; row <= rangeTiposProveedor.e.r; row++) {
      for (let col = rangeTiposProveedor.s.c; col <= rangeTiposProveedor.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
        if (!wsTiposProveedor[cellAddress]) continue;
        
        wsTiposProveedor[cellAddress].s = dataStyle;
      }
    }

    // Ajustar ancho de columnas para tipos de proveedor
    if (!wsTiposProveedor['!cols']) wsTiposProveedor['!cols'] = [];
    wsTiposProveedor['!cols'] = [
      { width: 50 }, // TIPO PROVEEDOR
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
    XLSX.utils.book_append_sheet(wb, wsProveedores, "Proveedores");
    XLSX.utils.book_append_sheet(wb, wsTiposProveedor, "TiposProveedor");
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
      fileName: `proveedores_exportados_${new Date().toISOString().split('T')[0]}.xlsx`
    };
  } catch (error) {
    console.error("Error al exportar proveedores:", error);

    return { 
      success: false, 
      message: "¡Error al exportar los proveedores. Por favor, intente nuevamente!" 
    };
  }
}
