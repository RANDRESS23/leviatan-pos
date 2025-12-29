"use server"

import { db } from "@/lib/prisma"
import { CompanyForm } from "../_components/companies-action-dialog"
import { revalidatePath } from "next/cache";

export const getCompanies = async () => {
  try {
    const empresas = await db.empresa.findMany({ 
      include: { estado: { select: { codigo: true } } },
      orderBy: { updatedAt: "desc" }
    });
    
    return { empresas, statusCode: 200, status: "success", message: "¡Empresas obtenidas exitosamente!" }
  } catch (error) {
    console.error("Error al obtener las empresas:", error);

    return { empresas: [], statusCode: 500, status: "error", message: "¡Error al obtener las empresas!" }
  }
};

export const createCompany = async (data: CompanyForm) => {
  try {
    const isExistsName = await db.empresa.findFirst({
      where: { 
        nombre: { 
          equals: data.nombre, 
          mode: "insensitive" 
        } 
      },
      select: { id: true }
    })

    if (isExistsName) {
      return {
        empresa: {},
        statusCode: 400,
        status: "error",
        message: "¡Error, ya existe una empresa con el mismo nombre!"
      }
    }

    const isExistsEmail = await db.empresa.findFirst({
      where: { 
        emailContacto: { 
          equals: data.emailContacto, 
          mode: "insensitive" 
        } 
      },
      select: { id: true }
    })

    if (isExistsEmail) {
      return {
        empresa: {},
        statusCode: 400,
        status: "error",
        message: "¡Error, ya existe una empresa con el mismo email de contacto!"
      }
    }

    const isExistsPhone = await db.empresa.findFirst({
      where: { 
        telefono: { 
          equals: data.telefono, 
          mode: "insensitive" 
        } 
      },
      select: { id: true }
    })

    if (isExistsPhone) {
      return {
        empresa: {},
        statusCode: 400,
        status: "error",
        message: "¡Error, ya existe una empresa con el mismo telefono de contacto!"
      }
    }

    const estadoActivo = await db.estado.findUnique({
      where: {
        codigo: "ACTIVO"
      }
    })
  
    if (!estadoActivo) {
      return {
        empresa: {},
        statusCode: 404,
        status: "error",
        message: "¡Error, no se encontro el estado Activo!"
      }
    }
  
    const empresa = await db.empresa.create({
      data: {
        nombre: data.nombre,
        emailContacto: data.emailContacto,
        telefono: data.telefono,
        moduloRestaurante: data.moduloRestaurante,
        estadoId: estadoActivo.id
      }
    })
  
    revalidatePath("/companies");
    return { empresa, statusCode: 201, status: "success", message: "¡Empresa creada exitosamente!" }
  } catch (error) {
    console.log(error)

    return {
      empresa: {},
      statusCode: 500,
      status: "error",
      message: "¡Error al crear la empresa!"
    }
  }
}

export const updateCompany = async (data: CompanyForm) => {
  try {
    const isExistsName = await db.empresa.findFirst({
      where: { 
        nombre: { 
          equals: data.nombre, 
          mode: "insensitive" 
        },
        id: { 
          not: data.id 
        }
      },
      select: { id: true }
    })

    if (isExistsName) {
      return {
        empresa: {},
        statusCode: 400,
        status: "error",
        message: "¡Error, ya existe una empresa con el mismo nombre!"
      }
    }

    const isExistsEmail = await db.empresa.findFirst({
      where: { 
        emailContacto: { 
          equals: data.emailContacto, 
          mode: "insensitive" 
        },
        id: { 
          not: data.id 
        }
      },
      select: { id: true }
    })

    if (isExistsEmail) {
      return {
        empresa: {},
        statusCode: 400,
        status: "error",
        message: "¡Error, ya existe una empresa con el mismo email de contacto!"
      }
    }

    const isExistsPhone = await db.empresa.findFirst({
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

    if (isExistsPhone) {
      return {
        empresa: {},
        statusCode: 400,
        status: "error",
        message: "¡Error, ya existe una empresa con el mismo telefono de contacto!"
      }
    }
    
    const estado = await db.estado.findUnique({
      where: {
        codigo: data.estado ? "ACTIVO" : "INACTIVO"
      }
    })
  
    if (!estado) {
      return {
        empresa: {},
        statusCode: 404,
        status: "error",
        message: "¡No se encontro el estado!"
      }
    }
  
    const empresa = await db.empresa.update({
      where: {
        id: data.id
      },
      data: {
        nombre: data.nombre,
        emailContacto: data.emailContacto || null,
        telefono: data.telefono || null,
        moduloRestaurante: data.moduloRestaurante,
        estadoId: estado.id
      }
    })
  
    revalidatePath("/companies");
    return { empresa, statusCode: 200, status: "success", message: "¡Empresa actualizada exitosamente!" }
  } catch (error) {
    console.log(error)

    return {
      empresa: {},
      statusCode: 500,
      status: "error",
      message: "¡Error al actualizar la empresa!"
    }
  }
}