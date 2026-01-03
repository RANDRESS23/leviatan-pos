"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { type User } from "../_data/schema";
import { Switch } from "@/components/ui/switch";
import { createUser, updateUser } from "../_actions/user";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { PasswordInput } from "@/components/password-input";
import { SelectDropdown } from "@/components/select-dropdown";
import { useAuth } from "@/hooks/use-auth";

export const formSchema = z
  .object({
    id: z.string().optional(),
    empresaId: z
      .string("La empresa no puede estar vacia.")
      .min(1, "La empresa es requerida"),
    primer_nombre: z
      .string("El nombre no puede estar vacío")
      .min(1, "El nombre es requerido"),
    segundo_nombre: z.string().nullable().optional(),
    primer_apellido: z
      .string("El apellido no puede estar vacío")
      .min(1, "El apellido es requerido"),
    segundo_apellido: z.string().nullable().optional(),
    email: z.email("El correo electrónico no es válido"),
    telefono: z
      .string("El teléfono es requerido")
      .min(8, "El teléfono debe tener al menos 8 caracteres"),
    activo: z.boolean(),
    rolId: z
      .string("El rol no puede estar vacío")
      .min(1, "El rol es requerido."),
    password: z.string().transform((pwd) => pwd.trim()),
    confirmPassword: z.string().transform((pwd) => pwd.trim()),
    isEdit: z.boolean(),
  })
  .refine(
    (data) => {
      if (data.isEdit && !data.password) return true;
      return data.password.length > 0;
    },
    {
      message: "La contraseña es requerida",
      path: ["password"],
    }
  )
  .refine(
    ({ isEdit, password }) => {
      if (isEdit && !password) return true;
      return password.length >= 8;
    },
    {
      message: "La contraseña debe tener al menos 8 caracteres.",
      path: ["password"],
    }
  )
  .refine(
    ({ isEdit, password }) => {
      if (isEdit && !password) return true;
      return /[a-z]/.test(password);
    },
    {
      message: "La contraseña debe contener al menos una letra minúscula.",
      path: ["password"],
    }
  )
  .refine(
    ({ isEdit, password }) => {
      if (isEdit && !password) return true;
      return /\d/.test(password);
    },
    {
      message: "La contraseña debe contener al menos un número.",
      path: ["password"],
    }
  )
  .refine(
    ({ isEdit, password, confirmPassword }) => {
      if (isEdit && !password) return true;
      return password === confirmPassword;
    },
    {
      message: "Las contraseñas no coinciden.",
      path: ["confirmPassword"],
    }
  );
export type UserForm = z.infer<typeof formSchema>;

type UserActionDialogProps = {
  currentRow?: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  empresas: { id: string; nombre: string }[];
  roles: { id: string; nombre: string }[];
  isSuperAdmin: boolean;
  onShoot: () => void;
};

export function UsersActionDialog({
  currentRow,
  open,
  onOpenChange,
  empresas,
  roles,
  isSuperAdmin,
  onShoot,
}: UserActionDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const rolesFilter = roles.filter((rol) => rol.nombre !== "CEO");

  const isEdit = !!currentRow;
  const form = useForm<UserForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          id: currentRow.id,
          empresaId: currentRow.empresaId,
          primer_nombre: currentRow.primer_nombre,
          segundo_nombre: currentRow.segundo_nombre,
          primer_apellido: currentRow.primer_apellido,
          segundo_apellido: currentRow.segundo_apellido,
          email: currentRow.email,
          telefono: currentRow.telefono,
          activo: currentRow.activo,
          rolId: currentRow.rolId,
          password: "",
          confirmPassword: "",
          isEdit,
        }
      : {
          id: undefined,
          empresaId: isSuperAdmin ? "" : user?.empresaId || "",
          primer_nombre: "",
          segundo_nombre: undefined,
          primer_apellido: "",
          segundo_apellido: undefined,
          email: "",
          telefono: "",
          activo: true,
          rolId: isSuperAdmin ? "N/A" : "",
          password: "",
          confirmPassword: "",
          isEdit,
        },
  });

  useEffect(() => {
    if (user && !isSuperAdmin) {
      form.setValue("empresaId", user.empresaId);
    }
  }, [user]);

  const onSubmit = async (values: UserForm) => {
    setIsLoading(true);

    try {
      let user = null;

      if (isEdit) {
        const isInvalideToUpdate =
          currentRow.primer_nombre === values.primer_nombre &&
          currentRow.segundo_nombre === values.segundo_nombre &&
          currentRow.primer_apellido === values.primer_apellido &&
          currentRow.segundo_apellido === values.segundo_apellido &&
          currentRow.email === values.email &&
          currentRow.telefono === values.telefono &&
          currentRow.activo === values.activo &&
          currentRow.rolId === values.rolId &&
          values.password === "";

        if (isInvalideToUpdate)
          return toast.error("¡No hay cambios para actualizar!");

        user = await updateUser(values, isSuperAdmin);
      } else {
        user = await createUser(values, isSuperAdmin);
      }

      if (user.statusCode === 201 || user.statusCode === 200) {
        toast.success(user.message);
        onShoot();

        form.reset();
        onOpenChange(false);
      } else toast.error(user.message);
    } catch (error) {
      console.log(error);

      toast.error(
        isEdit
          ? "¡Error al actualizar el usuario!"
          : "¡Error al crear el usuario!"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const isPasswordTouched = !!form.formState.dirtyFields.password;

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset();
        onOpenChange(state);
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-start">
          <DialogTitle>
            {isEdit
              ? `Editar ${isSuperAdmin ? "CEO" : "usuario"}`
              : `Registrar nuevo ${isSuperAdmin ? "CEO" : "usuario"}`}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? `Edita el ${isSuperAdmin ? "CEO" : "usuario"} aquí. `
              : `Registra un nuevo ${isSuperAdmin ? "CEO" : "usuario"} aquí. `}
            Haga clic en{" "}
            {isEdit
              ? `'Actualizar ${isSuperAdmin ? "CEO" : "usuario"}'`
              : `'Guardar ${isSuperAdmin ? "CEO" : "usuario"}'`}{" "}
            cuando haya terminado.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-105 w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3">
          <Form {...form}>
            <form
              id="user-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 px-0.5"
            >
              {isSuperAdmin && !isEdit && (
                <div className="flex flex-col md:flex-row justify-between items-start gap-3">
                  <FormField
                    control={form.control}
                    name="empresaId"
                    render={({ field }) => (
                      <FormItem className="w-full flex flex-col space-y-0 gap-x-4 gap-y-2">
                        <FormLabel className="text-start">
                          Empresa
                          <span className="text-destructive font-bold -ml-1.5 text-md">
                            *
                          </span>
                        </FormLabel>
                        <SelectDropdown
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          placeholder="Selecciona una empresa"
                          className="w-full"
                          items={empresas.map(({ nombre, id }) => ({
                            label: nombre,
                            value: id,
                          }))}
                        />
                        <FormMessage className="w-full" />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <div className="flex flex-col md:flex-row justify-between items-start gap-3">
                <FormField
                  control={form.control}
                  name="primer_nombre"
                  render={({ field }) => (
                    <FormItem className="w-full flex flex-col space-y-0 gap-x-4 gap-y-2">
                      <FormLabel className="text-start">
                        Primer nombre
                        <span className="text-destructive font-bold -ml-1.5 text-md">
                          *
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John"
                          className=""
                          autoComplete="off"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="segundo_nombre"
                  render={({ field }) => (
                    <FormItem className="w-full flex flex-col space-y-0 gap-x-4 gap-y-2">
                      <FormLabel className="text-start">
                        Segundo nombre
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John"
                          className=""
                          value={field.value || ""}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                        />
                      </FormControl>
                      <FormMessage className="" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col md:flex-row justify-between items-start gap-3">
                <FormField
                  control={form.control}
                  name="primer_apellido"
                  render={({ field }) => (
                    <FormItem className="w-full flex flex-col space-y-0 gap-x-4 gap-y-2">
                      <FormLabel className="text-start">
                        Primer apellido
                        <span className="text-destructive font-bold -ml-1.5 text-md">
                          *
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Doe"
                          className=""
                          autoComplete="off"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="segundo_apellido"
                  render={({ field }) => (
                    <FormItem className="w-full flex flex-col space-y-0 gap-x-4 gap-y-2">
                      <FormLabel className="text-start">
                        Segundo apellido
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Doe"
                          className=""
                          value={field.value || ""}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                        />
                      </FormControl>
                      <FormMessage className="" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col md:flex-row justify-between items-start gap-3">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="w-full flex flex-col space-y-0 gap-x-4 gap-y-2">
                      <FormLabel className="text-start">
                        Correo electrónico
                        <span className="text-destructive font-bold -ml-1.5 text-md">
                          *
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="john.doe@gmail.com"
                          className=""
                          value={field.value || ""}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                        />
                      </FormControl>
                      <FormMessage className="" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="telefono"
                  render={({ field }) => (
                    <FormItem className="w-full flex flex-col space-y-0 gap-x-4 gap-y-2">
                      <FormLabel className="text-start">
                        Teléfono
                        <span className="text-destructive font-bold -ml-1.5 text-md">
                          *
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="+123456789"
                          className=""
                          value={field.value || ""}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                        />
                      </FormControl>
                      <FormMessage className="" />
                    </FormItem>
                  )}
                />
              </div>

              {!isSuperAdmin && (
                <FormField
                  control={form.control}
                  name="rolId"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start space-y-0 gap-x-4 gap-y-1">
                      <FormLabel className="text-end">
                        Rol{" "}
                        <span className="text-destructive font-bold -ml-1.5 text-md">
                          *
                        </span>
                      </FormLabel>
                      <SelectDropdown
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                        placeholder="Selecciona un rol"
                        className="w-full"
                        items={rolesFilter.map(({ nombre, id }) => ({
                          label: nombre,
                          value: id,
                        }))}
                      />
                      <FormMessage className="" />
                    </FormItem>
                  )}
                />
              )}

              <div className="flex flex-col md:flex-row justify-between items-start gap-3">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="w-full flex flex-col space-y-0 gap-x-4 gap-y-2">
                      <FormLabel className="text-start">
                        Contraseña
                        <span className="text-destructive font-bold -ml-1.5 text-md">
                          *
                        </span>
                      </FormLabel>
                      <FormControl>
                        <PasswordInput
                          placeholder="e.g., S3cur3P@ssw0rd"
                          className=""
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="w-full flex flex-col space-y-0 gap-x-4 gap-y-2">
                      <FormLabel className="text-start">
                        Confirmar contraseña
                        <span className="text-destructive font-bold -ml-1.5 text-md">
                          *
                        </span>
                      </FormLabel>
                      <FormControl>
                        <PasswordInput
                          disabled={!isPasswordTouched}
                          placeholder="e.g., S3cur3P@ssw0rd"
                          className=""
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="" />
                    </FormItem>
                  )}
                />
              </div>

              {isEdit && (
                <FormField
                  control={form.control}
                  name="activo"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-y-0 gap-x-4 gap-y-1">
                      <FormLabel className="">Estado usuario</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage className="col-span-4 col-start-3" />
                    </FormItem>
                  )}
                />
              )}
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            form="user-form"
            disabled={isLoading}
            className="disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <Save />}
            {isEdit
              ? isLoading
                ? `Actualizando ${isSuperAdmin ? "CEO..." : "usuario..."}`
                : `Actualizar ${isSuperAdmin ? "CEO" : "usuario"}`
              : isLoading
                ? `Guardando ${isSuperAdmin ? "CEO..." : "usuario..."}`
                : `Guardar ${isSuperAdmin ? "CEO" : "usuario"}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
