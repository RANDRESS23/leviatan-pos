"use server"

import { db } from "@/lib/prisma"
import { RoleForm } from "../_components/roles-and-permissions-action-dialog"
import { revalidatePath } from "next/cache";

export const getRolesAndPermissions = async (authId: string) => {
  try {
    const usuarioLogged = await db.usuario.findUnique({
      where: { authId },
      select: { empresaId: true }
    })

    if (!usuarioLogged) {
      return {
        roles: [],
        permisos: [],
        statusCode: 404,
        status: "error",
        message: "¡Error, no se encontro el usuario logueado!"
      }
    }

    const roles = await db.rol.findMany({ 
      where: { empresaId: usuarioLogged.empresaId, nombre: { not: "CEO" } },
      orderBy: { updatedAt: "desc" },
      include: {
        permisos: {
          include: {
            permiso: {
              select: { id: true, codigo: true, descripcion: true }
            }
          }
        }
      }
    });

    const permisos = await db.permiso.findMany()
    
    return { roles, permisos, statusCode: 200, status: "success", message: "Roles y permisos obtenidos exitosamente!" }
  } catch (error) {
    console.error("Error al obtener los roles y permisos:", error);

    return { roles: [], permisos: [], statusCode: 500, status: "error", message: "¡Error al obtener los roles y permisos!" }
  }
};

export const createRole = async (data: RoleForm) => {
  try {
    const isExistsRol = await db.rol.findFirst({
      where: { 
        nombre: { 
          equals: data.nombre, 
          mode: "insensitive" 
        } 
      },
      select: { id: true }
    })

    if (isExistsRol) {
      return {
        rol: {},
        statusCode: 400,
        status: "error",
        message: "¡Error, ya existe un rol con el mismo nombre!"
      }
    }

    const rol = await db.rol.create({
      data: {
        empresaId: data.empresaId,
        nombre: data.nombre,
        descripcion: data.descripcion || null,
      }
    })

    await db.rolPermiso.createMany({
      data: data.permisos.map((permisoId) => ({
        rolId: rol.id,
        permisoId,
      }))
    })
    
    revalidatePath("/roles-and-permissions");
    return { rol: {}, statusCode: 201, status: "success", message: "¡Rol creado exitosamente!" }
  } catch (error) {
    console.log(error)

    return {
      rol: {},
      statusCode: 500,
      status: "error",
      message: "¡Error al crear el rol!"
    }
  }
}

export const updateRole = async (data: RoleForm) => {
  try {
    const isExistsRol = await db.rol.findFirst({
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

    if (isExistsRol) {
      return {
        rol: {},
        statusCode: 400,
        status: "error",
        message: "¡Error, ya existe un rol con el mismo nombre!"
      }
    }
  
    const rol = await db.rol.update({
      where: {
        id: data.id
      },
      data: {
        nombre: data.nombre,
        descripcion: data.descripcion || null,
        permisos: {
          deleteMany: {
            rolId: data.id
          },
          createMany: {
            data: data.permisos.map((permisoId) => ({
              permisoId,
            }))
          }
        }
      }
    })
  
    revalidatePath("/roles-and-permissions");
    return { rol, statusCode: 200, status: "success", message: "¡Rol actualizado exitosamente!" }
  } catch (error) {
    console.log(error)

    return {
      rol: {},
      statusCode: 500,
      status: "error",
      message: "¡Error al actualizar el rol!"
    }
  }
}