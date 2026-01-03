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
import { type Supplier } from "../_data/schema";
import { Switch } from "@/components/ui/switch";
import { createNewSupplier, updateSupplier } from "../_actions/supplier";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { SelectDropdown } from "@/components/select-dropdown";
import { useAuth } from "@/hooks/use-auth";
import { Textarea } from "@/components/ui/textarea";

export const formSchema = z.object({
  id: z.string().optional(),
  empresaId: z
    .string("La empresa no puede estar vacía.")
    .min(1, "La empresa es requerida"),
  nit: z.string().nullable().optional(),
  nombre: z
    .string("El nombre no puede estar vacío")
    .min(1, "El nombre es requerido"),
  telefono: z
    .string("El teléfono es requerido")
    .min(8, "El teléfono debe tener al menos 8 caracteres"),
  direccion: z
    .string("La dirección no puede estar vacía")
    .min(1, "La dirección es requerida"),
  tipoProveedor: z
    .string("El tipo de proveedor no puede estar vacío")
    .min(1, "El tipo de proveedor es requerido"),
  descripcion: z.string().nullable().optional(),
  activo: z.boolean(),
  isEdit: z.boolean(),
});
export type SupplierForm = z.infer<typeof formSchema>;

type SupplierActionDialogProps = {
  currentRow?: Supplier;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onShoot: () => void;
};

export function SuppliersActionDialog({
  currentRow,
  open,
  onOpenChange,
  onShoot,
}: SupplierActionDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const isEdit = !!currentRow;
  const form = useForm<SupplierForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          id: currentRow.id,
          empresaId: currentRow.empresaId,
          nit: currentRow.nit,
          nombre: currentRow.nombre,
          telefono: currentRow.telefono,
          direccion: currentRow.direccion,
          tipoProveedor: currentRow.tipoProveedor,
          descripcion: currentRow.descripcion,
          activo: currentRow.activo,
          isEdit,
        }
      : {
          id: undefined,
          empresaId: user?.empresaId,
          nit: undefined,
          nombre: "",
          telefono: "",
          direccion: "",
          tipoProveedor: "",
          descripcion: undefined,
          activo: true,
          isEdit,
        },
  });

  useEffect(() => {
    if (user) {
      form.setValue("empresaId", user.empresaId);
    }
  }, [user]);

  const onSubmit = async (values: SupplierForm) => {
    setIsLoading(true);

    try {
      let user = null;

      if (isEdit) {
        const isInvalideToUpdate =
          currentRow.nit === values.nit &&
          currentRow.nombre === values.nombre &&
          currentRow.telefono === values.telefono &&
          currentRow.direccion === values.direccion &&
          currentRow.tipoProveedor === values.tipoProveedor &&
          currentRow.descripcion === values.descripcion &&
          currentRow.activo === values.activo;

        if (isInvalideToUpdate)
          return toast.error("¡No hay cambios para actualizar!");

        user = await updateSupplier(values);
      } else {
        user = await createNewSupplier(values);
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
          ? "¡Error al actualizar el proveedor!"
          : "¡Error al crear el proveedor!"
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
            {isEdit ? "Editar proveedor" : "Registrar nuevo proveedor"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Edita el proveedor aquí. "
              : "Registra un nuevo proveedor aquí. "}
            Haga clic en{" "}
            {isEdit ? "'Actualizar proveedor'" : "'Guardar proveedor'"} cuando
            haya terminado.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-105 w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3">
          <Form {...form}>
            <form
              id="user-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 px-0.5"
            >
              <div className="flex flex-col md:flex-row justify-between items-start gap-3">
                <FormField
                  control={form.control}
                  name="tipoProveedor"
                  render={({ field }) => (
                    <FormItem className="w-full flex flex-col space-y-0 gap-x-4 gap-y-2">
                      <FormLabel className="text-start">
                        Tipo de proveedor{" "}
                        <span className="text-destructive font-bold -ml-1.5 text-md">
                          *
                        </span>
                      </FormLabel>
                      <SelectDropdown
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                        placeholder="Selecciona un tipo"
                        className="w-full"
                        items={[
                          {
                            label: "Natural",
                            value: "Natural",
                          },
                          {
                            label: "Empresa",
                            value: "Empresa",
                          },
                        ]}
                      />
                      <FormMessage className="" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nit"
                  render={({ field }) => (
                    <FormItem className="w-full flex flex-col space-y-0 gap-x-4 gap-y-2">
                      <FormLabel className="text-start">NIT</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="1234567890"
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
                          placeholder="John Doe"
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
                          placeholder="1234567890"
                          className=""
                          value={field.value || ""}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, "");
                            field.onChange(value);
                          }}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                          inputMode="numeric"
                          pattern="[0-9]*"
                        />
                      </FormControl>
                      <FormMessage className="" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col justify-between items-start gap-3">
                <FormField
                  control={form.control}
                  name="direccion"
                  render={({ field }) => (
                    <FormItem className="w-full flex flex-col space-y-0 gap-x-4 gap-y-2">
                      <FormLabel className="text-start">
                        Dirección
                        <span className="text-destructive font-bold -ml-1.5 text-md">
                          *
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ej: Manzana G Casa 32 Barrio Arkabal"
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
                  name="descripcion"
                  render={({ field }) => (
                    <FormItem className="w-full flex flex-col space-y-0 gap-x-4 gap-y-2">
                      <FormLabel className="text-start">Descripción</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Digite la descripción del proveedor aquí"
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

              {isEdit && (
                <FormField
                  control={form.control}
                  name="activo"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-y-0 gap-x-4 gap-y-1">
                      <FormLabel className="">Estado proveedor</FormLabel>
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
                ? "Actualizando proveedor..."
                : "Actualizar proveedor"
              : isLoading
                ? "Guardando proveedor..."
                : "Guardar proveedor"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
