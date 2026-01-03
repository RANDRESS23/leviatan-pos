"use server"

import { db } from "@/lib/prisma"
import { SupplierForm } from "../_components/suppliers-action-dialog"
import { revalidatePath } from "next/cache";
import { ImportedSupplier } from "../_utils/excel-reader";

export const getSuppliers = async (idUserLogged: string) => {
  try {
    const usuarioLogueado = await db.usuario.findUnique({
      where: { authId: idUserLogged },
      select: { empresaId: true }
    })

    if (!usuarioLogueado) {
      return {
        proveedores: [],
        statusCode: 404,
        status: "error",
        message: "¡No se encontro el usuario logueado"
      }
    }

    const proveedores = await db.proveedor.findMany({
      where: { empresaId: usuarioLogueado.empresaId },
      orderBy: { updatedAt: "desc" }
    })

    return { proveedores, statusCode: 200, status: "success", message: "Proveedores obtenidos exitosamente!" }
  } catch (error) {
    console.error("Error al obtener a los proveedores:", error);

    return { proveedores: [], statusCode: 500, status: "error", message: "¡Error al obtener a los proveedores!" }
  }
};

export const getSupplierById = async (id: string) => {
  try {
    const proveedor = await db.proveedor.findUnique({
      where: { id },
      include: { 
        compras: { select: { id: true } },
      }
    });

    if (!proveedor) {
      return { proveedor: {}, hasPurchases: false, statusCode: 404, status: "error", message: "¡No se encontró al proveedor!" };
    }

    const hasPurchases = proveedor.compras.length > 0;
    
    return { proveedor, hasPurchases, statusCode: 200, status: "success", message: "Proveedor obtenido exitosamente!" };
  } catch (error) {
    console.error("Error al obtener el proveedor:", error);

    return { proveedor: {}, hasPurchases: false, statusCode: 500, status: "error", message: "¡Error al obtener el proveedor!" };
  }
};

export const deleteSupplierById = async (id: string) => {
  try {
    await db.proveedor.delete({
      where: { id },
    });
    
    revalidatePath("/suppliers");
    return { statusCode: 200, status: "success", message: "Proveedor eliminado exitosamente!" };
  } catch (error) {
    console.error("Error al eliminar el proveedor:", error);

    return { statusCode: 500, status: "error", message: "¡Error al eliminar el proveedor!" };
  }
};

export const createNewSupplier = async (data: SupplierForm) => {
  try {
    const isExistsSupplierWithSameNit = await db.proveedor.findFirst({
      where: { 
        nit: { 
          equals: data.nit, 
          mode: "insensitive" 
        },
        empresaId: data.empresaId
      },
      select: { id: true }
    })

    if (isExistsSupplierWithSameNit) {
      return {
        proveedor: {},
        statusCode: 400,
        status: "error",
        message: "¡Error, ya existe un proveedor con el mismo NIT!"
      }
    }
    
    const isExistsSupplierWithSameName = await db.proveedor.findFirst({
      where: { 
        nombre: { 
          equals: data.nombre, 
          mode: "insensitive" 
        },
        empresaId: data.empresaId
      },
      select: { id: true }
    })

    if (isExistsSupplierWithSameName) {
      return {
        proveedor: {},
        statusCode: 400,
        status: "error",
        message: "¡Error, ya existe un proveedor con el mismo nombre!"
      }
    }

    const isExistsSupplierWithSamePhone = await db.proveedor.findFirst({
      where: { 
        telefono: { 
          equals: data.telefono, 
          mode: "insensitive" 
        },
        empresaId: data.empresaId
      },
      select: { id: true }
    })

    if (isExistsSupplierWithSamePhone) {
      return {
        proveedor: {},
        statusCode: 400,
        status: "error",
        message: "¡Error, ya existe un proveedor con el mismo teléfono!"
      }
    }

    const proveedor = await db.proveedor.create({
      data: {
        empresaId: data.empresaId,
        nit: data.nit || null,
        nombre: data.nombre,
        telefono: data.telefono,
        direccion: data.direccion,
        tipoProveedor: data.tipoProveedor,
        descripcion: data.descripcion || null,
        activo: data.activo,
      }
    })
  
    revalidatePath("/suppliers");
    return { proveedor, statusCode: 201, status: "success", message: "¡Proveedor creado exitosamente!" }
  } catch (error) {
    console.log(error)

    return {
      proveedor: {},
      statusCode: 500,
      status: "error",
      message: "¡Error al crear el proveedor!"
    }
  }
}

export const updateSupplier = async (data: SupplierForm) => {
  try {
    const isExistsSupplierWithSameNit = await db.proveedor.findFirst({
      where: { 
        nit: { 
          equals: data.nit, 
          mode: "insensitive" 
        },
        empresaId: data.empresaId,
        id: { 
          not: data.id 
        }
      },
      select: { id: true }
    })

    if (isExistsSupplierWithSameNit) {
      return {
        proveedor: {},
        statusCode: 400,
        status: "error",
        message: "¡Error, ya existe un proveedor con el mismo NIT!"
      }
    }
    
    const isExistsSupplierWithSameName = await db.proveedor.findFirst({
      where: { 
        nombre: { 
          equals: data.nombre, 
          mode: "insensitive" 
        },
        empresaId: data.empresaId,
        id: { 
          not: data.id 
        }
      },
      select: { id: true }
    })

    if (isExistsSupplierWithSameName) {
      return {
        proveedor: {},
        statusCode: 400,
        status: "error",
        message: "¡Error, ya existe un proveedor con el mismo nombre!"
      }
    }

    const isExistsSupplierWithSamePhone = await db.proveedor.findFirst({
      where: { 
        telefono: { 
          equals: data.telefono, 
          mode: "insensitive" 
        },
        empresaId: data.empresaId,
        id: { 
          not: data.id 
        }
      },
      select: { id: true }
    })

    if (isExistsSupplierWithSamePhone) {
      return {
        proveedor: {},
        statusCode: 400,
        status: "error",
        message: "¡Error, ya existe un proveedor con el mismo teléfono!"
      }
    }

    const proveedor = await db.proveedor.update({
      where: { id: data.id },
      data: {
        empresaId: data.empresaId,
        nit: data.nit || null,
        nombre: data.nombre,
        telefono: data.telefono,
        direccion: data.direccion,
        tipoProveedor: data.tipoProveedor,
        descripcion: data.descripcion || null,
        activo: data.activo,
      }
    })
    
    revalidatePath("/suppliers");
    return { proveedor, statusCode: 200, status: "success", message: "¡Proveedor actualizado exitosamente!" }
  } catch (error) {
    console.log(error)

    return {
      proveedor: {},
      statusCode: 500,
      status: "error",
      message: "¡Error al actualizar el proveedor!"
    }
  }
}

export const importSuppliers = async (idUserLogged: string, suppliers: ImportedSupplier[]) => {
  try {
    // Obtener información del usuario y empresa
    const usuarioLogueado = await db.usuario.findUnique({
      where: { authId: idUserLogged },
      select: { empresaId: true }
    })

    if (!usuarioLogueado) {
      return {
        proveedores: [],
        statusCode: 404,
        status: "error",
        message: "¡No se encontró el usuario logueado!"
      }
    }

    const empresaId = usuarioLogueado.empresaId

    // Obtener todos los proveedores actuales de la empresa
    const proveedoresActuales = await db.proveedor.findMany({
      where: { empresaId },
      include: { 
        compras: { select: { id: true } },
      }
    })

    // Obtener tipos de documento disponibles
    const tiposProveedor = [
      {
        nombre: "Natural"
      },
      {
        nombre: "Empresa"
      }
    ]

    // Separar proveedores por categorías
    const proveedoresConVentas = proveedoresActuales.filter(proveedor => proveedor.compras.length > 0)
    const proveedoresSinVentas = proveedoresActuales.filter(proveedor => proveedor.compras.length === 0)
    
    // Crear mapa de proveedores actuales por nit para búsqueda rápida
    const mapaProveedoresActualesConNit = new Map(
      proveedoresActuales.map(proveedor => [proveedor.nit?.toLowerCase(), proveedor])
    )
    
    // Crear mapa de proveedores actuales por nit para búsqueda rápida
    const mapaProveedoresActualesConNombre = new Map(
      proveedoresActuales.map(proveedor => [proveedor.nombre?.toLowerCase(), proveedor])
    )

    // Analizar proveedores del Excel
    const proveedoresActualizar: Array<{excel: ImportedSupplier, actual: any}> = []
    const proveedoresNuevos: ImportedSupplier[] = []
    const erroresValidacion: string[] = []

    // Validar cada proveedor del Excel
    for (let i = 0; i < suppliers.length; i++) {
      const proveedorExcel = suppliers[i]
      const nit = proveedorExcel.nit?.toLowerCase().trim()
      const nombre = proveedorExcel.nombre?.toLowerCase().trim()
      
      // Validar campos requeridos
      if (!proveedorExcel.nombre.trim()) {
        erroresValidacion.push(`Fila ${i + 2}: El nombre es requerido`)
        continue
      }

      if (!proveedorExcel.telefono.trim()) {
        erroresValidacion.push(`Fila ${i + 2}: El teléfono es requerido`)
        continue
      }
      
      if (!proveedorExcel.direccion.trim()) {
        erroresValidacion.push(`Fila ${i + 2}: La dirección es requerida`)
        continue
      }

      // Validar tipo de proveedor
      const tipoProveedor = tiposProveedor.find(td => 
        td.nombre.toLowerCase() === proveedorExcel.tipo_proveedor.toLowerCase()
      )
      if (!tipoProveedor) {
        erroresValidacion.push(`Fila ${i + 2}: Tipo de proveedor "${proveedorExcel.tipo_proveedor}" no es válido`)
        continue
      }

      // Validar formato de telefono
      const telefonoRegex = /^[0-9]+$/
      if (!telefonoRegex.test(proveedorExcel.telefono)) {
        erroresValidacion.push(`Fila ${i + 2}: El teléfono "${proveedorExcel.telefono}" no tiene un formato válido`)
        continue
      }
      
      // Validar longitud mínima de teléfono
      if (proveedorExcel.telefono.length < 8) {
        erroresValidacion.push(`Fila ${i + 2}: El teléfono debe tener al menos 8 caracteres`)
        continue
      }
      
      // Validar longitud máxima de teléfono
      if (proveedorExcel.telefono.length > 10) {
        erroresValidacion.push(`Fila ${i + 2}: El teléfono no debe exceder 10 caracteres`)
        continue
      }

      if (!['ACTIVO', 'INACTIVO'].includes(proveedorExcel.estado.toUpperCase())) {
        erroresValidacion.push(`Fila ${i + 2}: El estado debe ser "ACTIVO" o "INACTIVO"`)
        continue
      }

      const proveedorExistente = mapaProveedoresActualesConNit.get(nit) || mapaProveedoresActualesConNombre.get(nombre)
      
      if (proveedorExistente) {
        proveedoresActualizar.push({ excel: proveedorExcel, actual: proveedorExistente })
      } else {
        proveedoresNuevos.push(proveedorExcel)
      }
    }

    // Validar duplicados dentro del Excel
    const nitsExcel = suppliers.map(c => c.nit?.toLowerCase().trim()).filter(nit => nit !== undefined)
    const telefonosExcel = suppliers.map(c => c.telefono?.toLowerCase().trim())
    const nombresExcel = suppliers.map(c => c.nombre?.toLowerCase().trim())
    const duplicadosExcel = new Set<string>()
    const duplicadosExcel2 = new Set<string>()
    const duplicadosExcel3 = new Set<string>()
    
    for (let i = 0; i < nitsExcel.length; i++) {
      const nit = nitsExcel[i].toLowerCase().trim()
      if (nitsExcel.indexOf(nit) !== i) {
        duplicadosExcel.add(nit)
      }
    }

    for (let i = 0; i < telefonosExcel.length; i++) {
      const telefono = telefonosExcel[i].toLowerCase().trim()
      if (telefonosExcel.indexOf(telefono) !== i) {
        duplicadosExcel2.add(telefono)
      }
    }

    for (let i = 0; i < nombresExcel.length; i++) {
      const nombre = nombresExcel[i].toLowerCase().trim()
      if (nombresExcel.indexOf(nombre) !== i) {
        duplicadosExcel3.add(nombre)
      }
    }

    if (duplicadosExcel.size > 0) {
      const duplicadosConFilas: string[] = []
      duplicadosExcel.forEach(nit => {
        const filas: number[] = []
        nitsExcel.forEach((doc, index) => {
          if (doc === nit) {
            filas.push(index + 2) // +2 porque: +1 para fila humana (no 0-indexed) y +1 porque headers están en fila 1
          }
        })
        duplicadosConFilas.push(`• NIT "${nit}" repetido en filas: ${filas.join(', ')}`)
      })
      
      return {
        proveedores: [],
        statusCode: 400,
        status: "error",
        message: "Errores de validación en el archivo Excel:\n\n" + 
                 "❌ Proveedores duplicados en el Excel:\n" + 
                 duplicadosConFilas.join('\n') + 
                 "\n\n💡 Cada proveedor debe aparecer una sola vez en el archivo Excel."
      }
    }

    if (duplicadosExcel2.size > 0) {
      const duplicadosConFilas: string[] = []
      duplicadosExcel2.forEach(telefono => {
        const filas: number[] = []
        telefonosExcel.forEach((doc, index) => {
          if (doc === telefono) {
            filas.push(index + 2) // +2 porque: +1 para fila humana (no 0-indexed) y +1 porque headers están en fila 1
          }
        })
        duplicadosConFilas.push(`• Teléfono "${telefono}" repetido en filas: ${filas.join(', ')}`)
      })
      
      return {
        proveedores: [],
        statusCode: 400,
        status: "error",
        message: "Errores de validación en el archivo Excel:\n\n" + 
                 "❌ Proveedores duplicados en el Excel:\n" + 
                 duplicadosConFilas.join('\n') + 
                 "\n\n💡 Cada proveedor debe aparecer una sola vez en el archivo Excel."
      }
    }

    if (duplicadosExcel3.size > 0) {
      const duplicadosConFilas: string[] = []
      duplicadosExcel3.forEach(nombre => {
        const filas: number[] = []
        nombresExcel.forEach((doc, index) => {
          if (doc === nombre) {
            filas.push(index + 2) // +2 porque: +1 para fila humana (no 0-indexed) y +1 porque headers están en fila 1
          }
        })
        duplicadosConFilas.push(`• Nombre "${nombre}" repetido en filas: ${filas.join(', ')}`)
      })
      
      return {
        proveedores: [],
        statusCode: 400,
        status: "error",
        message: "Errores de validación en el archivo Excel:\n\n" + 
                 "❌ Proveedores duplicados en el Excel:\n" + 
                 duplicadosConFilas.join('\n') + 
                 "\n\n💡 Cada proveedor debe aparecer una sola vez en el archivo Excel."
      }
    }

    // Validar errores de validación antes de continuar
    if (erroresValidacion.length > 0) {
      return {
        proveedores: [],
        statusCode: 400,
        status: "error",
        message: "Errores de validación en el archivo Excel:\n\n" + erroresValidacion.join("\n")
      }
    }

    // Iniciar transacción
    const resultado = await db.$transaction(async (tx) => {
      // 1. Eliminar proveedores sin ventas que no estén en el Excel
      const numerosDocExcel = new Set(
        [...proveedoresActualizar.map(c => c.excel.nit), ...proveedoresNuevos.map(c => c.nit)]
        .map(doc => doc?.toLowerCase())
      )
      
      const proveedoresAEliminar = proveedoresSinVentas.filter(proveedor => 
        !numerosDocExcel.has(proveedor.nit?.toLowerCase())
      )

      if (proveedoresAEliminar.length > 0) {
        await tx.proveedor.deleteMany({
          where: {
            id: { in: proveedoresAEliminar.map(c => c.id) }
          }
        })
      }

      // 2. Actualizar proveedores existentes
      const proveedoresActualizados = []
      for (const { excel, actual } of proveedoresActualizar) {
        const tipoDoc = tiposProveedor.find(td => 
          td.nombre.toLowerCase() === excel.tipo_proveedor.toLowerCase()
        )!

        const proveedorActualizado = await tx.proveedor.update({
          where: { id: actual.id },
          data: {
            nombre: excel.nombre.trim(),
            telefono: excel.telefono.trim(),
            direccion: excel.direccion.trim(),
            tipoProveedor: tipoDoc.nombre,
            descripcion: excel.descripcion?.trim() || null,
            activo: excel.estado.toUpperCase() === 'ACTIVO',
          }
        })
        proveedoresActualizados.push(proveedorActualizado)
      }

      // 3. Crear nuevos proveedores
      const proveedoresCreados = []
      for (const proveedorExcel of proveedoresNuevos) {
        const tipoDoc = tiposProveedor.find(td => 
          td.nombre.toLowerCase() === proveedorExcel.tipo_proveedor.toLowerCase()
        )!

        const proveedorCreado = await tx.proveedor.create({
          data: {
            empresaId,
            nit: proveedorExcel.nit?.trim() || null,
            nombre: proveedorExcel.nombre.trim(),
            telefono: proveedorExcel.telefono.trim(),
            direccion: proveedorExcel.direccion.trim(),
            descripcion: proveedorExcel.descripcion?.trim() || null,
            tipoProveedor: tipoDoc.nombre,
          }
        })
        proveedoresCreados.push(proveedorCreado)
      }

      return {
        eliminados: proveedoresAEliminar.length,
        actualizados: proveedoresActualizados.length,
        creados: proveedoresCreados.length,
        totalProcesados: suppliers.length
      }
    })

    revalidatePath("/suppliers")
    
    const mensaje = [
      `¡Importación completada exitosamente!`,
      ``,
      `📊 Resumen de la operación:`,
      `• Proveedores nuevos creados: ${resultado.creados}`,
      `• Proveedores actualizados: ${resultado.actualizados}`,
      `• Proveedores eliminados (sin ventas): ${resultado.eliminados}`,
      `• Total de filas procesadas: ${resultado.totalProcesados}`,
      ``,
      `✅ La operación es irreversible.`
    ].join('\n')

    return { 
      proveedores: suppliers, 
      statusCode: 200, 
      status: "success", 
      message: mensaje,
      resultado
    }
  } catch (error) {
    console.error("Error al importar proveedores:", error)
    
    return {
      proveedores: [],
      statusCode: 500,
      status: "error",
      message: "¡Error al importar los proveedores! Por favor, contacte al administrador."
    }
  }
}