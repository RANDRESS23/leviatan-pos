"use server"

import { db } from "@/lib/prisma";

export const getUserByAuthId = async (authId: string) => {
  try {
    const usuario = await db.usuario.findUnique({ 
      where: {
        authId
      },
      include: {
        empresa: {  include: { estado: { select: { codigo: true } } }},
        rol: { include: { 
          permisos: {
          include: {
            permiso: {
              select: { id: true, codigo: true, descripcion: true }
            }
          }
        }
        }}
      }
    });

    if (!usuario) {
      return {
        usuario: {},
        statusCode: 404,
        status: "error",
        message: "¡No se encontro el usuario!"
      }
    }
    
    return { usuario, statusCode: 200, status: "success", message: "¡Usuario encontrado exitosamente!" }
  } catch (error) {
    console.error("Error fetching user:", error);

    return { usuario: {}, statusCode: 500, status: "error", message: "¡Error al obtener el usuario!" }
  }
}