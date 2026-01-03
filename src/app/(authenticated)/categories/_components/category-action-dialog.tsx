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
import { type Category } from "../_data/schema";
import { createCategory, updateCategory } from "../_actions/category";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Switch } from "@/components/ui/switch";

export const formSchema = z.object({
  id: z.string().optional(),
  empresaId: z
    .string("La empresa no puede estar vacia.")
    .min(1, "La empresa es requerida"),
  nombre: z
    .string("El nombre de la categoría no puede estar vacía")
    .min(1, "El nombre de la categoría es requerida"),
  activa: z.boolean(),
  isEdit: z.boolean(),
});
export type CategoryForm = z.infer<typeof formSchema>;

type CategoryActionDialogProps = {
  currentRow?: Category;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onShoot: () => void;
};

export function CategoryActionDialog({
  currentRow,
  open,
  onOpenChange,
  onShoot,
}: CategoryActionDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const isEdit = !!currentRow;

  const form = useForm<CategoryForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          id: currentRow.id,
          empresaId: currentRow.empresaId,
          nombre: currentRow.nombre,
          activa: currentRow.activa,
          isEdit,
        }
      : {
          id: undefined,
          empresaId: user?.empresaId,
          nombre: "",
          activa: true,
          isEdit,
        },
  });

  useEffect(() => {
    if (user) {
      form.setValue("empresaId", user.empresaId);
    }
  }, [user]);

  const onSubmit = async (values: CategoryForm) => {
    setIsLoading(true);

    try {
      let category = null;

      if (isEdit) {
        const isInvalideToUpdate =
          currentRow.nombre === values.nombre &&
          currentRow.activa === values.activa;

        if (isInvalideToUpdate)
          return toast.error("¡No hay cambios para actualizar!");

        category = await updateCategory(values);
      } else {
        category = await createCategory(values);
      }

      if (category.statusCode === 201 || category.statusCode === 200) {
        toast.success(category.message);
        onShoot();

        form.reset();
        onOpenChange(false);
      } else {
        toast.error(category.message);
      }
    } catch (error) {
      console.log(error);

      toast.error(
        isEdit
          ? "¡Error al actualizar la categoría!"
          : "¡Error al crear la categoría!"
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
            {isEdit ? "Editar categoría" : "Registrar nueva categoría"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Edita la categoría aquí. "
              : "Registra una nueva categoría aquí. "}
            Haga clic en{" "}
            {isEdit ? "'Actualizar categoría'" : "'Guardar categoría'"} cuando
            haya terminado.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-105 w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3">
          <Form {...form}>
            <form
              id="category-form"
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
                          placeholder="Nueva categoría"
                          className=""
                          autoComplete="off"
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
                  name="activa"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-y-0 gap-x-4 gap-y-1">
                      <FormLabel className="">Estado categoría</FormLabel>
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
            form="category-form"
            disabled={isLoading}
            className="disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <Save />}
            {isEdit
              ? isLoading
                ? "Actualizando categoría..."
                : "Actualizar categoría"
              : isLoading
                ? "Guardando categoría..."
                : "Guardar categoría"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
