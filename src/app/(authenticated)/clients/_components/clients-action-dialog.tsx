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
import { Client, type TypeDocument } from "../_data/schema";
import { Switch } from "@/components/ui/switch";
import { createNewClient, updateClient } from "../_actions/client";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { SelectDropdown } from "@/components/select-dropdown";
import { useAuth } from "@/hooks/use-auth";

export const formSchema = z.object({
  id: z.string().optional(),
  empresaId: z
    .string("La empresa no puede estar vacía.")
    .min(1, "La empresa es requerida"),
  tipoDocumentoId: z
    .string("El tipo de documento no puede estar vacío.")
    .min(1, "El tipo de documento es requerido"),
  primer_nombre: z
    .string("El nombre no puede estar vacío")
    .min(1, "El nombre es requerido"),
  segundo_nombre: z.string().nullable().optional(),
  primer_apellido: z
    .string("El apellido no puede estar vacío")
    .min(1, "El apellido es requerido"),
  segundo_apellido: z.string().nullable().optional(),
  numeroDocumento: z
    .string("El número de documento no puede estar vacío")
    .min(8, "El número de documento debe tener al menos 8 caracteres"),
  direccion: z
    .string("La dirección no puede estar vacía")
    .min(1, "La dirección es requerida"),
  email: z.email("El correo electrónico no es válido"),
  telefono: z
    .string("El teléfono es requerido")
    .min(8, "El teléfono debe tener al menos 8 caracteres"),
  activo: z.boolean(),
  isEdit: z.boolean(),
});
export type ClientForm = z.infer<typeof formSchema>;

type ClientActionDialogProps = {
  currentRow?: Client;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tiposDocumento: TypeDocument[];
  onShoot: () => void;
};

export function ClientsActionDialog({
  currentRow,
  open,
  onOpenChange,
  tiposDocumento,
  onShoot,
}: ClientActionDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const isEdit = !!currentRow;
  const form = useForm<ClientForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          id: currentRow.id,
          empresaId: currentRow.empresaId,
          tipoDocumentoId: currentRow.tipoDocumentoId,
          primer_nombre: currentRow.primer_nombre,
          segundo_nombre: currentRow.segundo_nombre,
          primer_apellido: currentRow.primer_apellido,
          segundo_apellido: currentRow.segundo_apellido,
          numeroDocumento: currentRow.numeroDocumento,
          direccion: currentRow.direccion,
          email: currentRow.email,
          telefono: currentRow.telefono,
          activo: currentRow.activo,
          isEdit,
        }
      : {
          id: undefined,
          empresaId: user?.empresaId,
          tipoDocumentoId: "",
          primer_nombre: "",
          segundo_nombre: undefined,
          primer_apellido: "",
          segundo_apellido: undefined,
          numeroDocumento: "",
          direccion: "",
          email: "",
          telefono: "",
          activo: true,
          isEdit,
        },
  });

  useEffect(() => {
    if (user) {
      form.resetField("empresaId", { defaultValue: user.empresaId });
    }
  }, [user]);

  const onSubmit = async (values: ClientForm) => {
    setIsLoading(true);

    try {
      let user = null;

      if (isEdit) {
        const isInvalideToUpdate =
          currentRow.primer_nombre === values.primer_nombre &&
          currentRow.segundo_nombre === values.segundo_nombre &&
          currentRow.primer_apellido === values.primer_apellido &&
          currentRow.segundo_apellido === values.segundo_apellido &&
          currentRow.numeroDocumento === values.numeroDocumento &&
          currentRow.direccion === values.direccion &&
          currentRow.email === values.email &&
          currentRow.telefono === values.telefono &&
          currentRow.activo === values.activo &&
          currentRow.tipoDocumentoId === values.tipoDocumentoId;

        if (isInvalideToUpdate)
          return toast.error("¡No hay cambios para actualizar!");

        user = await updateClient(values);
      } else {
        user = await createNewClient(values);
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
          ? "¡Error al actualizar el cliente!"
          : "¡Error al crear el cliente!"
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
            {isEdit ? "Editar cliente" : "Registrar nuevo cliente"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Edita el cliente aquí. "
              : "Registra un nuevo cliente aquí. "}
            Haga clic en {isEdit ? "'Actualizar cliente'" : "'Guardar cliente'"}{" "}
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
              <div className="flex justify-between items-start gap-x-3">
                <FormField
                  control={form.control}
                  name="tipoDocumentoId"
                  render={({ field }) => (
                    <FormItem className="w-full flex flex-col space-y-0 gap-x-4 gap-y-2">
                      <FormLabel className="text-start">
                        Tipo de documento{" "}
                        <span className="text-destructive font-bold -ml-1.5 text-md">
                          *
                        </span>
                      </FormLabel>
                      <SelectDropdown
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                        placeholder="Selecciona un tipo"
                        className="w-full"
                        items={tiposDocumento.map(({ tipoDocumento, id }) => ({
                          label: tipoDocumento,
                          value: id,
                        }))}
                      />
                      <FormMessage className="" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="numeroDocumento"
                  render={({ field }) => (
                    <FormItem className="w-full flex flex-col space-y-0 gap-x-4 gap-y-2">
                      <FormLabel className="text-start">
                        Número de documento
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

              <div className="flex justify-between items-start gap-x-3">
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

              <div className="flex justify-between items-start gap-x-3">
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

              <div className="flex justify-between items-start gap-x-3">
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

              <FormField
                control={form.control}
                name="direccion"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-start space-y-0 gap-x-4 gap-y-2">
                    <FormLabel className="text-end">
                      Dirección
                      <span className="text-destructive font-bold -ml-1.5 text-md">
                        *
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej: Manzana G Casa 32 Barrio Arkabal"
                        className="w-full"
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

              {isEdit && (
                <FormField
                  control={form.control}
                  name="activo"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-y-0 gap-x-4 gap-y-1">
                      <FormLabel className="">Estado cliente</FormLabel>
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
                ? "Actualizando cliente..."
                : "Actualizar cliente"
              : isLoading
                ? "Guardando cliente..."
                : "Guardar cliente"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
