"use server"

import { db } from "@/lib/prisma"
import { UserForm } from "../_components/users-action-dialog"
import { revalidatePath } from "next/cache";
import { User } from "../_data/schema";
import { encryptPassword, verifyPassword } from "@/lib/bcrypt";
import { createClient } from "@supabase/supabase-js";

export const getUsers = async (idUserLogged: string, isSuperAdmin: boolean) => {
  try {
    let usuarios: User[] = []
    let empresas: {id: string, nombre: string}[] = []
    let roles: {id: string, nombre: string}[] = []

    if (isSuperAdmin) {
      usuarios = await db.usuario.findMany({
        where: { rol: { nombre: "CEO" } },
        include: { rol: { select: { nombre: true } } },
        omit: { password: true },
        orderBy: { updatedAt: "desc" }
      })

      empresas = await db.empresa.findMany({
        where: { ceoAsignado: false },
        select: { id: true, nombre: true }
      })
    } else {
      const usuarioLogueado = await db.usuario.findUnique({
        where: { authId: idUserLogged },
        select: { empresaId: true }
      })

      if (!usuarioLogueado) {
        return {
          usuarios: [],
          empresas: [],
          roles: [],
          statusCode: 404,
          status: "error",
          message: "¡No se encontro el usuario logueado"
        }
      }

      usuarios = await db.usuario.findMany({
        where: { empresaId: usuarioLogueado.empresaId, rol: { nombre: { not: "CEO" } } },
        include: { rol: { select: { nombre: true } } },
        omit: { password: true },
        orderBy: { updatedAt: "desc" }
      })

      roles = await db.rol.findMany({
        where: { empresaId: usuarioLogueado.empresaId },
        select: { id: true, nombre: true }
      })
    }

    return { usuarios, roles, empresas, statusCode: 200, status: "success", message: "Usuarios obtenidos exitosamente!" }
  } catch (error) {
    console.error("Error al obtener a los usuarios:", error);

    return { usuarios: [], roles: [], empresas: [], statusCode: 500, status: "error", message: "¡Error al obtener a los usuarios!" }
  }
};

export const createUser = async (data: UserForm, isSuperAdmin: boolean) => {
  try {
    const isExistsUserWithSameEmail = await db.usuario.findFirst({
      where: { 
        email: { 
          equals: data.email, 
          mode: "insensitive" 
        }
      },
      select: { id: true }
    })

    if (isExistsUserWithSameEmail) {
      return {
        usuario: {},
        statusCode: 400,
        status: "error",
        message: "¡Error, ya existe un usuario con el mismo correo electrónico!"
      }
    }

    const isExistsUserWithSamePhone = await db.usuario.findFirst({
      where: { 
        telefono: { 
          equals: data.telefono, 
          mode: "insensitive" 
        }
      },
      select: { id: true }
    })

    if (isExistsUserWithSamePhone) {
      return {
        usuario: {},
        statusCode: 400,
        status: "error",
        message: "¡Error, ya existe un usuario con el mismo teléfono!"
      }
    }

    let rolCeoId = ''

    if (isSuperAdmin) {
      const rolCeo = await db.rol.findUnique({
        where: { nombre: "CEO", empresaId: data.empresaId },
        select: { id: true }
      })
  
      if (!rolCeo) {
        return {
          usuario: {},
          statusCode: 404,
          status: "error",
          message: "¡Error, no se encontro el rol CEO!"
        }
      }

      rolCeoId = rolCeo.id

      const permisos = await db.permiso.findMany({ select: { id: true } })
      const rolYPermisos = permisos.map(permiso => ({
        rolId: rolCeo.id,
        permisoId: permiso.id
      }))

      await db.rolPermiso.createMany({
        data: [
          ...rolYPermisos
        ]
      })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
    const serviceRolKey = process.env.SERVICE_ROL_KEY ?? ''

    const supabase = createClient(supabaseUrl, serviceRolKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    const { data: { user }, error } = await supabase.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true
    })

    if (error) {
      console.log({ error })

      return {
        usuario: {},
        statusCode: 400,
        status: "error",
        message: "¡Error al registrar el usuario en el BD de autenticación!"
      }
    }

    if (!user) {
      return {
        usuario: {},
        statusCode: 400,
        status: "error",
        message: "¡Error, no se encontró el usuario en la BD de autenticación!"
      }
    }

    const hashedPassword = await encryptPassword(data.password)
    const usuario = await db.usuario.create({
      data: {
        authId: user.id,
        empresaId: data.empresaId,
        rolId: isSuperAdmin ? rolCeoId : data.rolId,
        primer_nombre: data.primer_nombre,
        segundo_nombre: data.segundo_nombre,
        primer_apellido: data.primer_apellido,
        segundo_apellido: data.segundo_apellido,
        email: data.email,
        telefono: data.telefono,
        password: hashedPassword
      }
    })

    if (isSuperAdmin) {
      await db.empresa.update({
        where: { id: usuario.empresaId },
        data: { ceoAsignado: true }
      })
    }
  
    revalidatePath("/users");
    return { usuario, statusCode: 201, status: "success", message: "¡Usuario creado exitosamente!" }
  } catch (error) {
    console.log(error)

    return {
      usuario: {},
      statusCode: 500,
      status: "error",
      message: "¡Error al crear el usuario!"
    }
  }
}

export const updateUser = async (data: UserForm, isSuperAdmin: boolean) => {
  try {
    const isExistsUserWithSameEmail = await db.usuario.findFirst({
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

    if (isExistsUserWithSameEmail) {
      return {
        usuario: {},
        statusCode: 400,
        status: "error",
        message: "¡Error, ya existe un usuario con el mismo correo electrónico!"
      }
    }

    const isExistsUserWithSamePhone = await db.usuario.findFirst({
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

    if (isExistsUserWithSamePhone) {
      return {
        usuario: {},
        statusCode: 400,
        status: "error",
        message: "¡Error, ya existe un usuario con el mismo teléfono!"
      }
    }

    const usuarioInfo = await db.usuario.findUnique({
      where: { id: data.id }
    })

    if (!usuarioInfo) {
      return {
        usuario: {},
        statusCode: 404,
        status: "error",
        message: "¡Error, no se encontro el usuario a actualizar!"
      }
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
    const serviceRolKey = process.env.SERVICE_ROL_KEY ?? ''
    const supabase = createClient(supabaseUrl, serviceRolKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    const isSamePassword = data.password 
      ? await verifyPassword(data.password, usuarioInfo.password) : true

    if (usuarioInfo.email !== data.email || !isSamePassword) {
      const updateInfo = usuarioInfo.email !== data.email && !isSamePassword
        ? { email: data.email, password: data.password }
        : usuarioInfo.email !== data.email
          ? { email: data.email }
          : !isSamePassword
            ? { password: data.password }
            : {}

      const { error } = await supabase.auth.admin.updateUserById(
        usuarioInfo.authId as string,
        { ...updateInfo }
      )

      if (error) {
        console.log({ error })

        return {
          usuario: {},
          statusCode: 400,
          status: "error",
          message: "¡Error al actualizar el usuario en el BD de autenticación!"
        }
      }
    }

    let hashedPassword = usuarioInfo.password

    if (!isSamePassword) {
      hashedPassword = await encryptPassword(data.password)
    }

    if (usuarioInfo.activo !== data.activo) {
      const banDuration = data.activo ? "0h" : "876600h"

      const { error } = await supabase.auth.admin.updateUserById(usuarioInfo.authId, {
        ban_duration: banDuration
      })

      if (error) {
        console.log({ error })

        return {
          usuario: {},
          statusCode: 400,
          status: "error",
          message: "¡Error al actualizar el estado del usuario en el BD de autenticación!"
        }
      }
    }

    const usuario = await db.usuario.update({
      where: { id: data.id },
      data: {
        rolId: isSuperAdmin ? usuarioInfo.rolId : data.rolId,
        primer_nombre: data.primer_nombre,
        segundo_nombre: data.segundo_nombre || null,
        primer_apellido: data.primer_apellido,
        segundo_apellido: data.segundo_apellido || null,
        email: data.email,
        telefono: data.telefono,
        activo: data.activo,
        password: hashedPassword
      }
    })
    
    revalidatePath("/users");
    return { usuario, statusCode: 200, status: "success", message: "¡Usuario actualizado exitosamente!" }
  } catch (error) {
    console.log(error)

    return {
      usuario: {},
      statusCode: 500,
      status: "error",
      message: "¡Error al actualizar el usuario!"
    }
  }
}