"use server"

import { db } from "@/lib/prisma"
import { ClientForm } from "../_components/clients-action-dialog"
import { revalidatePath } from "next/cache";
import { ImportedClient } from "../_utils/excel-reader";

export const getClients = async (idUserLogged: string) => {
  try {
    const usuarioLogueado = await db.usuario.findUnique({
      where: { authId: idUserLogged },
      select: { empresaId: true }
    })

    if (!usuarioLogueado) {
      return {
        clientes: [],
        tiposDocumento: [],
        statusCode: 404,
        status: "error",
        message: "¡No se encontro el usuario logueado"
      }
    }

    const clientes = await db.cliente.findMany({
      where: { empresaId: usuarioLogueado.empresaId },
      include: { tipoDocumento: { select: { tipoDocumento: true} } },
      orderBy: { updatedAt: "desc" }
    })

    const tiposDocumento = await db.tipoDocumento.findMany()

    return { clientes, tiposDocumento, statusCode: 200, status: "success", message: "Clientes obtenidos exitosamente!" }
  } catch (error) {
    console.error("Error al obtener a los clientes:", error);

    return { clientes: [], tiposDocumento: [], statusCode: 500, status: "error", message: "¡Error al obtener a los clientes!" }
  }
};

export const createNewClient = async (data: ClientForm) => {
  try {
    const isExistsClientWithSameDocument = await db.cliente.findFirst({
      where: { 
        numeroDocumento: { 
          equals: data.numeroDocumento, 
          mode: "insensitive" 
        }
      },
      select: { id: true }
    })

    if (isExistsClientWithSameDocument) {
      return {
        cliente: {},
        statusCode: 400,
        status: "error",
        message: "¡Error, ya existe un cliente con el mismo número de documento!"
      }
    }
    
    const isExistsClientWithSameEmail = await db.cliente.findFirst({
      where: { 
        email: { 
          equals: data.email, 
          mode: "insensitive" 
        }
      },
      select: { id: true }
    })

    if (isExistsClientWithSameEmail) {
      return {
        cliente: {},
        statusCode: 400,
        status: "error",
        message: "¡Error, ya existe un cliente con el mismo correo electrónico!"
      }
    }

    const isExistsClientWithSamePhone = await db.cliente.findFirst({
      where: { 
        telefono: { 
          equals: data.telefono, 
          mode: "insensitive" 
        }
      },
      select: { id: true }
    })

    if (isExistsClientWithSamePhone) {
      return {
        cliente: {},
        statusCode: 400,
        status: "error",
        message: "¡Error, ya existe un cliente con el mismo teléfono!"
      }
    }

    const cliente = await db.cliente.create({
      data: {
        empresaId: data.empresaId,
        primer_nombre: data.primer_nombre,
        segundo_nombre: data.segundo_nombre || null,
        primer_apellido: data.primer_apellido,
        segundo_apellido: data.segundo_apellido || null,
        email: data.email,
        telefono: data.telefono,
        tipoDocumentoId: data.tipoDocumentoId,
        numeroDocumento: data.numeroDocumento,
        activo: data.activo,
        direccion: data.direccion
      }
    })
  
    revalidatePath("/clients");
    return { cliente, statusCode: 201, status: "success", message: "¡Cliente creado exitosamente!" }
  } catch (error) {
    console.log(error)

    return {
      cliente: {},
      statusCode: 500,
      status: "error",
      message: "¡Error al crear el cliente!"
    }
  }
}

export const updateClient = async (data: ClientForm) => {
  try {
    const isExistsClientWithSameDocument = await db.cliente.findFirst({
      where: { 
        numeroDocumento: { 
          equals: data.numeroDocumento, 
          mode: "insensitive" 
        },
        id: { 
          not: data.id 
        }
      },
      select: { id: true }
    })

    if (isExistsClientWithSameDocument) {
      return {
        cliente: {},
        statusCode: 400,
        status: "error",
        message: "¡Error, ya existe un cliente con el mismo número de documento!"
      }
    }
    
    const isExistsClientWithSameEmail = await db.cliente.findFirst({
      where: { 
        email: { 
          equals: data.email, 
          mode: "insensitive" 
        },
        id: { 
          not: data.id 
        }
      },
      select: { id: true }
    })

    if (isExistsClientWithSameEmail) {
      return {
        cliente: {},
        statusCode: 400,
        status: "error",
        message: "¡Error, ya existe un cliente con el mismo correo electrónico!"
      }
    }

    const isExistsClientWithSamePhone = await db.cliente.findFirst({
      where: { 
        telefono: { 
          equals: data.telefono, 
          mode: "insensitive" 
        },
        id: { 
          not: data.id 
        }
      },
      select: { id: true }
    })

    if (isExistsClientWithSamePhone) {
      return {
        cliente: {},
        statusCode: 400,
        status: "error",
        message: "¡Error, ya existe un cliente con el mismo teléfono!"
      }
    }

    const cliente = await db.cliente.update({
      where: { id: data.id },
      data: {
        primer_nombre: data.primer_nombre,
        segundo_nombre: data.segundo_nombre || null,
        primer_apellido: data.primer_apellido,
        segundo_apellido: data.segundo_apellido || null,
        email: data.email,
        telefono: data.telefono,
        tipoDocumentoId: data.tipoDocumentoId,
        numeroDocumento: data.numeroDocumento,
        activo: data.activo,
        direccion: data.direccion
      }
    })
    
    revalidatePath("/clients");
    return { cliente, statusCode: 200, status: "success", message: "¡Cliente actualizado exitosamente!" }
  } catch (error) {
    console.log(error)

    return {
      cliente: {},
      statusCode: 500,
      status: "error",
      message: "¡Error al actualizar el cliente!"
    }
  }
}

export const importClients = async (idUserLogged: string, clients: ImportedClient[]) => {
  try {
    // Obtener información del usuario y empresa
    const usuarioLogueado = await db.usuario.findUnique({
      where: { authId: idUserLogged },
      select: { empresaId: true }
    })

    if (!usuarioLogueado) {
      return {
        clientes: [],
        statusCode: 404,
        status: "error",
        message: "¡No se encontró el usuario logueado!"
      }
    }

    const empresaId = usuarioLogueado.empresaId

    // Obtener todos los clientes actuales de la empresa
    const clientesActuales = await db.cliente.findMany({
      where: { empresaId },
      include: { 
        ventas: { select: { id: true } },
        tipoDocumento: { select: { tipoDocumento: true } }
      }
    })

    // Obtener tipos de documento disponibles
    const tiposDocumento = await db.tipoDocumento.findMany()

    // Separar clientes por categorías
    const clientesConVentas = clientesActuales.filter(cliente => cliente.ventas.length > 0)
    const clientesSinVentas = clientesActuales.filter(cliente => cliente.ventas.length === 0)
    
    // Crear mapa de clientes actuales por número de documento para búsqueda rápida
    const mapaClientesActuales = new Map(
      clientesActuales.map(cliente => [cliente.numeroDocumento.toLowerCase(), cliente])
    )

    // Analizar clientes del Excel
    const clientesActualizar: Array<{excel: ImportedClient, actual: any}> = []
    const clientesNuevos: ImportedClient[] = []
    const erroresValidacion: string[] = []

    // Validar cada cliente del Excel
    for (let i = 0; i < clients.length; i++) {
      const clienteExcel = clients[i]
      const numeroDoc = clienteExcel.numero_documento.toLowerCase().trim()
      
      // Validar campos requeridos
      if (!clienteExcel.primer_nombre.trim()) {
        erroresValidacion.push(`Fila ${i + 2}: El primer nombre es requerido`)
        continue
      }
      if (!clienteExcel.primer_apellido.trim()) {
        erroresValidacion.push(`Fila ${i + 2}: El primer apellido es requerido`)
        continue
      }
      if (!clienteExcel.numero_documento.trim()) {
        erroresValidacion.push(`Fila ${i + 2}: El número de documento es requerido`)
        continue
      }
      if (!clienteExcel.email.trim()) {
        erroresValidacion.push(`Fila ${i + 2}: El email es requerido`)
        continue
      }
      if (!clienteExcel.telefono.trim()) {
        erroresValidacion.push(`Fila ${i + 2}: El teléfono es requerido`)
        continue
      }

      // Validar tipo de documento
      const tipoDoc = tiposDocumento.find(td => 
        td.tipoDocumento.toLowerCase() === clienteExcel.tipo_documento.toLowerCase()
      )
      if (!tipoDoc) {
        erroresValidacion.push(`Fila ${i + 2}: Tipo de documento "${clienteExcel.tipo_documento}" no es válido`)
        continue
      }

      // Validar formato de documento
      const documentoRegex = /^[0-9]+$/
      if (!documentoRegex.test(clienteExcel.numero_documento)) {
        erroresValidacion.push(`Fila ${i + 2}: El número de documento "${clienteExcel.numero_documento}" no tiene un formato válido`)
        continue
      }

      // Validar cantidad minima de caracteres de documento
      if (clienteExcel.numero_documento.length < 8) {
        erroresValidacion.push(`Fila ${i + 2}: El número de documento debe tener al menos 8 caracteres`)
        continue
      }

      // Validar cantidad máxima de caracteres de documento
      if (clienteExcel.numero_documento.length > 10) {
        erroresValidacion.push(`Fila ${i + 2}: El número de documento no debe exceder 10 caracteres`)
        continue
      }

      // Validar formato de telefono
      const telefonoRegex = /^[0-9]+$/
      if (!telefonoRegex.test(clienteExcel.telefono)) {
        erroresValidacion.push(`Fila ${i + 2}: El teléfono "${clienteExcel.telefono}" no tiene un formato válido`)
        continue
      }
      
      // Validar longitud mínima de teléfono
      if (clienteExcel.telefono.length < 8) {
        erroresValidacion.push(`Fila ${i + 2}: El teléfono debe tener al menos 8 caracteres`)
        continue
      }
      
      // Validar longitud máxima de teléfono
      if (clienteExcel.telefono.length > 10) {
        erroresValidacion.push(`Fila ${i + 2}: El teléfono no debe exceder 10 caracteres`)
        continue
      }
      
      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(clienteExcel.email)) {
        erroresValidacion.push(`Fila ${i + 2}: El email "${clienteExcel.email}" no tiene un formato válido`)
        continue
      }

      // Validar estado
      if (!['ACTIVO', 'INACTIVO'].includes(clienteExcel.estado.toUpperCase())) {
        erroresValidacion.push(`Fila ${i + 2}: El estado debe ser "ACTIVO" o "INACTIVO"`)
        continue
      }

      // Verificar si el cliente ya existe
      const clienteExistente = mapaClientesActuales.get(numeroDoc)
      
      if (clienteExistente) {
        // Cliente existe - se actualizará
        clientesActualizar.push({ excel: clienteExcel, actual: clienteExistente })
      } else {
        // Cliente nuevo - se agregará
        clientesNuevos.push(clienteExcel)
      }
    }

    // Si hay errores de validación, retornarlos
    if (erroresValidacion.length > 0) {
      return {
        clientes: [],
        statusCode: 400,
        status: "error",
        message: "Errores de validación en el archivo Excel:\n\n" + erroresValidacion.join("\n")
      }
    }

    // Iniciar transacción
    const resultado = await db.$transaction(async (tx) => {
      // 1. Eliminar clientes sin ventas que no estén en el Excel
      const numerosDocExcel = new Set(
        [...clientesActualizar.map(c => c.excel.numero_documento), ...clientesNuevos.map(c => c.numero_documento)]
        .map(doc => doc.toLowerCase())
      )
      
      const clientesAEliminar = clientesSinVentas.filter(cliente => 
        !numerosDocExcel.has(cliente.numeroDocumento.toLowerCase())
      )

      if (clientesAEliminar.length > 0) {
        await tx.cliente.deleteMany({
          where: {
            id: { in: clientesAEliminar.map(c => c.id) }
          }
        })
      }

      // 2. Actualizar clientes existentes
      const clientesActualizados = []
      for (const { excel, actual } of clientesActualizar) {
        const tipoDoc = tiposDocumento.find(td => 
          td.tipoDocumento.toLowerCase() === excel.tipo_documento.toLowerCase()
        )!

        const clienteActualizado = await tx.cliente.update({
          where: { id: actual.id },
          data: {
            primer_nombre: excel.primer_nombre.trim(),
            segundo_nombre: excel.segundo_nombre?.trim() || null,
            primer_apellido: excel.primer_apellido.trim(),
            segundo_apellido: excel.segundo_apellido?.trim() || null,
            email: excel.email.trim(),
            telefono: excel.telefono.trim(),
            direccion: excel.direccion.trim(),
            activo: excel.estado.toUpperCase() === 'ACTIVO',
            tipoDocumentoId: tipoDoc.id
          }
        })
        clientesActualizados.push(clienteActualizado)
      }

      // 3. Crear nuevos clientes
      const clientesCreados = []
      for (const clienteExcel of clientesNuevos) {
        const tipoDoc = tiposDocumento.find(td => 
          td.tipoDocumento.toLowerCase() === clienteExcel.tipo_documento.toLowerCase()
        )!

        const clienteCreado = await tx.cliente.create({
          data: {
            empresaId,
            primer_nombre: clienteExcel.primer_nombre.trim(),
            segundo_nombre: clienteExcel.segundo_nombre?.trim() || null,
            primer_apellido: clienteExcel.primer_apellido.trim(),
            segundo_apellido: clienteExcel.segundo_apellido?.trim() || null,
            email: clienteExcel.email.trim(),
            telefono: clienteExcel.telefono.trim(),
            direccion: clienteExcel.direccion.trim(),
            activo: clienteExcel.estado.toUpperCase() === 'ACTIVO',
            tipoDocumentoId: tipoDoc.id,
            numeroDocumento: clienteExcel.numero_documento.trim()
          }
        })
        clientesCreados.push(clienteCreado)
      }

      return {
        eliminados: clientesAEliminar.length,
        actualizados: clientesActualizados.length,
        creados: clientesCreados.length,
        totalProcesados: clients.length
      }
    })

    revalidatePath("/clients")
    
    const mensaje = [
      `¡Importación completada exitosamente!`,
      ``,
      `📊 Resumen de la operación:`,
      `• Clientes nuevos creados: ${resultado.creados}`,
      `• Clientes actualizados: ${resultado.actualizados}`,
      `• Clientes eliminados (sin ventas): ${resultado.eliminados}`,
      `• Total de filas procesadas: ${resultado.totalProcesados}`,
      ``,
      `✅ La operación es irreversible.`
    ].join('\n')

    return { 
      clientes: clients, 
      statusCode: 200, 
      status: "success", 
      message: mensaje,
      resultado
    }
  } catch (error) {
    console.error("Error al importar clientes:", error)
    
    return {
      clientes: [],
      statusCode: 500,
      status: "error",
      message: "¡Error al importar los clientes! Por favor, contacte al administrador."
    }
  }
}