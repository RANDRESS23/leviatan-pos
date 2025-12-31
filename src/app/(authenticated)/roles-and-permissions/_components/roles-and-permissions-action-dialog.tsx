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
import { Permission, type Role } from "../_data/schema";
import { createRole, updateRole } from "../_actions/rolesAndPermissions";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export const formSchema = z.object({
  id: z.string().optional(),
  empresaId: z
    .string("La empresa no puede estar vacia.")
    .min(1, "La empresa es requerida"),
  nombre: z
    .string("El nombre del rol no puede estar vacío")
    .min(1, "El nombre del rol es requerido"),
  descripcion: z.string().nullable().optional(),
  permisos: z.array(z.string()).min(1, "Al menos un permiso es requerido"),
  isEdit: z.boolean(),
});
export type RoleForm = z.infer<typeof formSchema>;

type RoleActionDialogProps = {
  currentRow?: Role;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  permisos: Permission[];
  onShoot: () => void;
};

export function RolesAndPermissionsActionDialog({
  currentRow,
  open,
  onOpenChange,
  permisos,
  onShoot,
}: RoleActionDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const isEdit = !!currentRow;

  const form = useForm<RoleForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          id: currentRow.id,
          empresaId: currentRow.empresaId,
          nombre: currentRow.nombre,
          descripcion: currentRow.descripcion,
          permisos: currentRow.permisos.map((p: any) => p.permisoId),
          isEdit,
        }
      : {
          id: undefined,
          empresaId: user?.empresaId,
          nombre: "",
          descripcion: undefined,
          permisos: [],
          isEdit,
        },
  });

  useEffect(() => {
    if (user) {
      form.resetField("empresaId", { defaultValue: user.empresaId });
    }
  }, [user]);

  const onSubmit = async (values: RoleForm) => {
    setIsLoading(true);

    try {
      let role = null;

      if (isEdit) {
        const isInvalideToUpdate =
          currentRow.nombre === values.nombre &&
          currentRow.descripcion === values.descripcion &&
          currentRow.permisos.map((p: any) => p.permisoId).join(",") ===
            values.permisos.join(",");

        if (isInvalideToUpdate)
          return toast.error("¡No hay cambios para actualizar!");

        role = await updateRole(values);
      } else {
        role = await createRole(values);
      }

      if (role.statusCode === 201 || role.statusCode === 200) {
        toast.success(role.message);
        onShoot();

        form.reset();
        onOpenChange(false);
      } else {
        toast.error(role.message);
      }
    } catch (error) {
      console.log(error);

      toast.error(
        isEdit ? "¡Error al actualizar el rol!" : "¡Error al crear el rol!"
      );
    } finally {
      setIsLoading(false);
    }
  };

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
            {isEdit ? "Editar rol" : "Registrar nuevo rol"}
          </DialogTitle>
          <DialogDescription>
            {isEdit ? "Edita el rol aquí. " : "Registra un nuevo rol aquí. "}
            Haga clic en {isEdit ? "'Actualizar rol'" : "'Guardar rol'"} cuando
            haya terminado.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-105 w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3">
          <Form {...form}>
            <form
              id="role-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 px-0.5"
            >
              <div className="flex flex-col justify-between items-start gap-3">
                <FormField
                  control={form.control}
                  name="nombre"
                  render={({ field }) => (
                    <FormItem className="w-full flex flex-col space-y-0 gap-x-4 gap-y-2">
                      <FormLabel className="text-start">
                        Nombre
                        <span className="text-destructive font-bold -ml-1.5 text-md">
                          *
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ej: Cajero"
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
                  name="descripcion"
                  render={({ field }) => (
                    <FormItem className="w-full flex flex-col space-y-0 gap-x-4 gap-y-2">
                      <FormLabel className="text-start">Descripción</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Digite la descripción del rol aquí"
                          className="resize-none"
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
              <FormField
                control={form.control}
                name="permisos"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-start space-y-0 gap-x-4 gap-y-3">
                    <FormLabel className="pt-2">
                      Permisos
                      <span className="text-destructive font-bold -ml-1.5 text-md">
                        *
                      </span>
                    </FormLabel>
                    <FormControl className="">
                      <div className="grid grid-cols-2 gap-x-2 space-y-4">
                        {permisos.map((permiso) => (
                          <div
                            key={permiso.id}
                            className="flex items-start space-x-2"
                          >
                            <Checkbox
                              id={permiso.id}
                              checked={field.value?.includes(permiso.id)}
                              onCheckedChange={(checked) => {
                                const currentValue = field.value || [];
                                if (checked) {
                                  field.onChange([...currentValue, permiso.id]);
                                } else {
                                  field.onChange(
                                    currentValue.filter(
                                      (id: string) => id !== permiso.id
                                    )
                                  );
                                }
                              }}
                            />
                            <div className="flex flex-col">
                              <Label
                                htmlFor={permiso.id}
                                className="text-sm font-normal cursor-pointer"
                              >
                                {permiso.codigo}
                              </Label>
                              <p className="text-muted-foreground text-xs">
                                {permiso.descripcion}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage className="" />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            form="role-form"
            disabled={isLoading}
            className="disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <Save />}
            {isEdit
              ? isLoading
                ? "Actualizando rol..."
                : "Actualizar rol"
              : isLoading
                ? "Guardando rol..."
                : "Guardar rol"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
