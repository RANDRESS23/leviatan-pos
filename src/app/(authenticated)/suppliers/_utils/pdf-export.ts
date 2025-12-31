import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { db } from '@/lib/prisma';

interface SupplierData {
  nit: string | null;
  nombre: string;
  telefono: string;
  direccion: string;
  tipo_proveedor: string;
  descripcion: string | null;
  estado: string;
}

interface ExportResult {
  success: boolean;
  buffer?: Uint8Array;
  fileName?: string;
  message?: string;
}

// Tipos para colores RGB
type RGBColor = [number, number, number];

export function exportSuppliersToPdf({ proveedores }: { proveedores: any[] }): ExportResult {
  try {
    // Crear instancia de jsPDF
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Configuración de colores y estilos
    const primaryColor: RGBColor = [22, 158, 245]; // Cyan
    const secondaryColor: RGBColor = [60, 174, 247]; // Light Cyan
    const textColor: RGBColor = [31, 41, 55]; // Gray-800
    const lightGray: RGBColor = [243, 244, 246]; // Gray-100

    // Función para agregar marca de agua
    const addWatermark = () => {
      doc.setTextColor(200, 200, 200);
      doc.setFontSize(60);
      doc.saveGraphicsState();
      doc.setGState(new (doc as any).GState({ opacity: 0.1 }));
      doc.text('LEVIATAN POS', 105, 150, { align: 'center', angle: 45 });
      doc.restoreGraphicsState();
      doc.setTextColor(...textColor);
    };

    // 1. ENCABEZADO DEL REPORTE
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 210, 40, 'F');

    // Título principal
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('LEVIATAN POS', 105, 20, { align: 'center' });

    doc.addImage('/leviatan-devs-icon.png', 'PNG', 15, 10, 20, 20);

    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text('Reporte de Proveedores', 105, 30, { align: 'center' });

    // 2. INFORMACIÓN DEL REPORTE
    doc.setTextColor(...textColor);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    
    const fechaActual = new Date().toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const horaActual = new Date().toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });

    // Información del reporte en recuadro
    doc.setFillColor(...lightGray);
    doc.rect(15, 50, 180, 30, 'F');
    doc.setDrawColor(...primaryColor);
    doc.rect(15, 50, 180, 30);

    doc.setFontSize(11);
    doc.text(`Fecha del reporte: ${fechaActual}`, 25, 65);
    doc.text(`Hora: ${horaActual}`, 25, 72);
    doc.text(`Total de proveedores: ${proveedores.length}`, 120, 65);
    doc.text(`Estado: Todos los proveedores`, 120, 72);

    // 3. ESTADÍSTICAS
    const proveedoresActivos = proveedores.filter(c => c.activo).length;
    const proveedoresInactivos = proveedores.filter(c => !c.activo).length;

    doc.setFillColor(...secondaryColor);
    doc.rect(15, 90, 180, 20, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Resumen de Proveedores', 105, 103, { align: 'center' });

    doc.setTextColor(...textColor);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    // Estadísticas en columnas
    doc.text(`Activos: ${proveedoresActivos}`, 30, 120);
    doc.text(`Inactivos: ${proveedoresInactivos}`, 30, 125);
    doc.text(`Porcentaje activos: ${((proveedoresActivos / proveedores.length) * 100).toFixed(1)}%`, 120, 120);
    doc.text(`Porcentaje inactivos: ${((proveedoresInactivos / proveedores.length) * 100).toFixed(1)}%`, 120, 125);

    // 4. TABLA DE PROVEEDORES
    const tableData = proveedores.map((proveedor: any, index: number) => [
      index + 1,
      proveedor?.nit || 'N/A',
      `${proveedor.nombre}`.trim(),
      proveedor.tipoProveedor,
      proveedor.telefono,
      proveedor.direccion,
      proveedor?.descripcion || 'N/A',
      proveedor.activo ? 'ACTIVO' : 'INACTIVO'
    ]);

    // Configuración de la tabla
    const tableHeaders = [
      { title: '#', dataKey: 'id' },
      { title: 'NIT', dataKey: 'nit' },
      { title: 'Nombre', dataKey: 'nombre' },
      { title: 'Tipo Proveedor', dataKey: 'tipoProveedor' },
      { title: 'Teléfono', dataKey: 'telefono' },
      { title: 'Dirección', dataKey: 'direccion' },
      { title: 'Descripción', dataKey: 'descripcion' },
      { title: 'Estado', dataKey: 'estado' }
    ];

    // Agregar tabla con estilos personalizados
    autoTable(doc, {
      head: [tableHeaders.map(h => h.title)],
      body: tableData,
      startY: 135,
      theme: 'grid',
      styles: {
        font: 'helvetica',
        fontSize: 9,
        cellPadding: 3,
        textColor: textColor,
        lineColor: [200, 200, 200],
        lineWidth: 0.1
      },
      headStyles: {
        fillColor: primaryColor,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 10
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251]
      },
      columnStyles: {
        0: { cellWidth: 12 }, // #
        1: { cellWidth: 25 }, // Nit
        2: { cellWidth: 25 }, // Nombre
        3: { cellWidth: 25 }, // Tipo Proveedor
        4: { cellWidth: 24 }, // Teléfono
        5: { cellWidth: 25 }, // Dirección
        6: { cellWidth: 26 }, // Descripción
        7: { cellWidth: 22 }  // Estado
      },
      didDrawCell: (data) => {
        // Colorear estado según activo/inactivo
        if (data.section === 'body' && data.column.index === 6) {
          const cell = data.cell;
          const text = cell.text[0];
          
          if (text === 'ACTIVO') {
            doc.setTextColor(34, 197, 94); // Green
          } else if (text === 'INACTIVO') {
            doc.setTextColor(239, 68, 68); // Red
          }
        }
      }
    });

    // 5. PIE DE PÁGINA
    const finalY = (doc as any).lastAutoTable.finalY || 200;
    
    // Línea separadora
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.5);
    doc.line(15, finalY + 10, 195, finalY + 10);

    // Información del pie
    doc.setTextColor(...textColor);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.text('Generado por LEVIATAN POS - Sistema de Gestión y Control', 105, finalY + 20, { align: 'center' });
    doc.text('Página 1 de 1', 105, finalY + 25, { align: 'center' });

    // 6. MARCA DE AGUA
    addWatermark();

    // 7. AGREGAR NUEVA PÁGINA SI HAY MUCHOS PROVEEDORES (más de 25)
    if (proveedores.length > 25) {
      // Calcular cuántas páginas adicionales se necesitan
      const proveedoresPorPagina = 25;
      const paginasAdicionales = Math.ceil((proveedores.length - 25) / proveedoresPorPagina);
      
      for (let i = 0; i < paginasAdicionales; i++) {
        doc.addPage();
        
        // Encabezado de página adicional
        doc.setFillColor(...primaryColor);
        doc.rect(0, 0, 210, 20, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('LEVIATAN POS - Reporte de Proveedores', 105, 13, { align: 'center' });
        
        // Tabla de proveedores adicionales
        const startIndex = 25 + (i * proveedoresPorPagina);
        const endIndex = Math.min(startIndex + proveedoresPorPagina, proveedores.length);
        const proveedoresPagina = proveedores.slice(startIndex, endIndex);
        
        const tableDataPagina = proveedoresPagina.map((proveedor: any, index: number) => [
          startIndex + index + 1,
          proveedor?.nit || 'N/A',
          `${proveedor.nombre}`.trim(),
          proveedor.telefono,
          proveedor.direccion,
          proveedor.tipoProveedor,
          proveedor?.descripcion || 'N/A',
          proveedor.activo ? 'ACTIVO' : 'INACTIVO'
        ]);
        
        autoTable(doc, {
          head: [tableHeaders.map(h => h.title)],
          body: tableDataPagina,
          startY: 30,
          theme: 'grid',
          styles: {
            font: 'helvetica',
            fontSize: 9,
            cellPadding: 3,
            textColor: textColor,
            lineColor: [200, 200, 200],
            lineWidth: 0.1
          },
          headStyles: {
            fillColor: primaryColor,
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            fontSize: 10
          },
          alternateRowStyles: {
            fillColor: [249, 250, 251]
          },
          columnStyles: {
            0: { cellWidth: 15 },
            1: { cellWidth: 45 },
            2: { cellWidth: 25 },
            3: { cellWidth: 25 },
            4: { cellWidth: 40 },
            5: { cellWidth: 25 },
            6: { cellWidth: 20 }
          },
          didDrawCell: (data) => {
            if (data.section === 'body' && data.column.index === 6) {
              const cell = data.cell;
              const text = cell.text[0];
              
              if (text === 'ACTIVO') {
                doc.setTextColor(34, 197, 94);
              } else if (text === 'INACTIVO') {
                doc.setTextColor(239, 68, 68);
              }
            }
          }
        });
        
        // Pie de página adicional
        const finalYPagina = (doc as any).lastAutoTable.finalY || 200;
        doc.setDrawColor(...primaryColor);
        doc.setLineWidth(0.5);
        doc.line(15, finalYPagina + 10, 195, finalYPagina + 10);
        
        doc.setTextColor(...textColor);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'italic');
        doc.text(`LEVIATAN POS - Página ${i + 2} de ${paginasAdicionales + 1}`, 105, finalYPagina + 20, { align: 'center' });
        
        addWatermark();
      }
    }

    // Generar el buffer del PDF
    const pdfBuffer = new Uint8Array(doc.output('arraybuffer'));

    return {
      success: true,
      buffer: pdfBuffer,
      fileName: `reporte_proveedores_${new Date().toISOString().split('T')[0]}.pdf`
    };

  } catch (error) {
    console.error("Error al exportar proveedores a PDF:", error);
    return {
      success: false,
      message: "¡Error al exportar los proveedores a PDF. Por favor, intente nuevamente!"
    };
  }
}
