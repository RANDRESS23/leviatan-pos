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
import { type Company } from "../_data/schema";
import { Switch } from "@/components/ui/switch";
import { createCompany, updateCompany } from "../_actions/company";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2, Save } from "lucide-react";

export const formSchema = z.object({
  id: z.string().optional(),
  nombre: z.string().min(1, "El nombre es requerido."),
  emailContacto: z
    .string()
    .nullable()
    .optional()
    .refine(
      (email) =>
        !email ||
        email.trim() === "" ||
        z.string().email().safeParse(email).success,
      { message: "El correo electrónico no es válido" }
    ),
  telefono: z.string().nullable().optional(),
  moduloRestaurante: z.boolean(),
  estado: z.boolean(),
  isEdit: z.boolean(),
});
export type CompanyForm = z.infer<typeof formSchema>;

type CompanyActionDialogProps = {
  currentRow?: Company;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onShoot: () => void;
};

export function CompaniesActionDialog({
  currentRow,
  open,
  onOpenChange,
  onShoot,
}: CompanyActionDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const isEdit = !!currentRow;
  const form = useForm<CompanyForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          id: currentRow.id,
          nombre: currentRow.nombre,
          emailContacto: currentRow.emailContacto,
          telefono: currentRow.telefono,
          moduloRestaurante: currentRow.moduloRestaurante,
          estado: currentRow.estado.codigo === "ACTIVO",
          isEdit,
        }
      : {
          id: undefined,
          nombre: "",
          emailContacto: undefined,
          telefono: undefined,
          moduloRestaurante: false,
          estado: true,
          isEdit,
        },
  });

  const onSubmit = async (values: CompanyForm) => {
    setIsLoading(true);

    try {
      let company = null;

      if (isEdit) {
        const isInvalideToUpdate =
          currentRow.nombre === values.nombre &&
          currentRow.emailContacto === values.emailContacto &&
          currentRow.telefono === values.telefono &&
          currentRow.moduloRestaurante === values.moduloRestaurante &&
          currentRow.estado.codigo === (values.estado ? "ACTIVO" : "INACTIVO");

        if (isInvalideToUpdate)
          return toast.error("¡No hay cambios para actualizar!");

        company = await updateCompany(values);
      } else {
        company = await createCompany(values);
      }

      if (company.statusCode === 201 || company.statusCode === 200) {
        toast.success(company.message);
        onShoot();

        form.reset();
        onOpenChange(false);
      } else toast.error(company.message);
    } catch (error) {
      console.log(error);

      toast.error(
        isEdit
          ? "¡Error al actualizar la empresa!"
          : "¡Error al crear la empresa!"
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
            {isEdit ? "Editar empresa" : "Registrar nueva empresa"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Edita la empresa aquí. "
              : "Registra una nueva empresa aquí. "}
            Haga clic en {isEdit ? "'Actualizar empresa'" : "'Guardar empresa'"}{" "}
            cuando haya terminado.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-105 w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3">
          <Form {...form}>
            <form
              id="company-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 px-0.5"
            >
              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="col-span-2 text-end">
                      Nombre
                      <span className="text-destructive font-bold -ml-1.5 text-md">
                        *
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John"
                        className="col-span-4"
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="col-span-4 col-start-3" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="emailContacto"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="col-span-2 text-end">
                      Correo electrónico
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="john.doe@gmail.com"
                        className="col-span-4"
                        value={field.value || ""}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormMessage className="col-span-4 col-start-3" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="telefono"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="col-span-2 text-end">
                      Teléfono
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="+123456789"
                        className="col-span-4"
                        value={field.value || ""}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormMessage className="col-span-4 col-start-3" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="moduloRestaurante"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="col-span-2 text-end">
                      Módulo restaurante
                      <span className="text-destructive font-bold -ml-1.5 text-md">
                        *
                      </span>
                    </FormLabel>
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

              {isEdit && (
                <FormField
                  control={form.control}
                  name="estado"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                      <FormLabel className="col-span-2 text-end">
                        Estado restaurante
                      </FormLabel>
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
            form="company-form"
            disabled={isLoading}
            className="disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <Save />}
            {isEdit
              ? isLoading
                ? "Actualizando empresa..."
                : "Actualizar empresa"
              : isLoading
                ? "Guardando empresa..."
                : "Guardar empresa"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
