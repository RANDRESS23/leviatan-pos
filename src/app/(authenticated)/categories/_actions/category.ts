"use server"

import { db } from "@/lib/prisma"
import { type CategoryForm } from "../_components/category-action-dialog"
import { revalidatePath } from "next/cache";

export const getCategories = async (authId: string) => {
  try {
    const usuarioLogged = await db.usuario.findUnique({
      where: { authId },
      select: { empresaId: true }
    })

    if (!usuarioLogged) {
      return {
        categorias: [],
        statusCode: 404,
        status: "error",
        message: "¡Error, no se encontro el usuario logueado!"
      }
    }

    const categorias = await db.categoria.findMany({ 
      where: { empresaId: usuarioLogged.empresaId },
      orderBy: { updatedAt: "desc" },
    });
    
    return { categorias, statusCode: 200, status: "success", message: "Categorías obtenidas exitosamente!" }
  } catch (error) {
    console.error("Error al obtener las categorías:", error);

    return { categorias: [], statusCode: 500, status: "error", message: "¡Error al obtener las categorías!" }
  }
};

export const createCategory = async (data: CategoryForm) => {
  try {
    const isExistsCategory = await db.categoria.findFirst({
      where: { 
        nombre: { 
          equals: data.nombre, 
          mode: "insensitive" 
        },
        empresaId: data.empresaId,
      },
      select: { id: true }
    })

    if (isExistsCategory) {
      return {
        categoria: {},
        statusCode: 400,
        status: "error",
        message: "¡Error, ya existe una categoría con el mismo nombre!"
      }
    }

    const categoria = await db.categoria.create({
      data: {
        empresaId: data.empresaId,
        nombre: data.nombre,
      }
    })
    
    revalidatePath("/categories");
    return { categoria, statusCode: 201, status: "success", message: "¡Categoría creada exitosamente!" }
  } catch (error) {
    console.log(error)

    return {
      categoria: {},
      statusCode: 500,
      status: "error",
      message: "¡Error al crear la categoría!"
    }
  }
}

export const updateCategory = async (data: CategoryForm) => {
  try {
    const isExistsCategory = await db.categoria.findFirst({
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

    if (isExistsCategory) {
      return {
        categoria: {},
        statusCode: 400,
        status: "error",
        message: "¡Error, ya existe una categoría con el mismo nombre!"
      }
    }
  
    const categoria = await db.categoria.update({
      where: {
        id: data.id
      },
      data: {
        nombre: data.nombre,
        activa: data.activa
      }
    })
  
    revalidatePath("/categories");
    return { categoria, statusCode: 200, status: "success", message: "¡Categoría actualizada exitosamente!" }
  } catch (error) {
    console.log(error)

    return {
      categoria: {},
      statusCode: 500,
      status: "error",
      message: "¡Error al actualizar la categoría!"
    }
  }
}