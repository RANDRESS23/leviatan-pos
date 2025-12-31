"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
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
  FormMessage,
} from "@/components/ui/form";
import { ArrowDownToLine, Download, Loader2 } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { downloadExcelTemplate } from "../_utils/excel-template";
import { extractExcelData } from "../_utils/excel-reader";
import { importClients } from "../_actions/client";
import { useAuth } from "@/hooks/use-auth";

const formSchema = z.object({
  file: z
    .instanceof(FileList, {
      message: "Por favor seleccione un archivo CSV o Excel",
    })
    .refine((files) => files.length > 0, {
      message: "Por favor seleccione un archivo CSV o Excel",
    })
    .refine(
      (files) =>
        [
          "text/csv",
          "application/vnd.ms-excel",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ].includes(files?.[0]?.type),
      "Por favor seleccione un archivo CSV o Excel"
    ),
});

type ClientImportDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onShoot: () => void;
};

export function ClientsImportDialog({
  open,
  onOpenChange,
  onShoot,
}: ClientImportDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);
  const { authUser } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { file: undefined },
  });

  const fileRef = form.register("file");

  const onSubmit = async () => {
    const file = form.getValues("file");

    if (file && file[0]) {
      setImportError(null); // Limpiar error anterior
      setImportSuccess(null); // Limpiar éxito anterior

      try {
        setIsLoading(true);

        // Extraer datos del Excel
        const clients = await extractExcelData(file[0]);

        // Importar clientes
        if (authUser) {
          const result = await importClients(authUser.id, clients);

          if (result.status === "success") {
            setImportSuccess(result.message);
            // Lanzar confetti
            onShoot();
            form.reset();
            // Cerrar diálogo después de un tiempo

            // onOpenChange(false);
          } else {
            setImportError(result.message);
          }
        } else {
          setImportError(
            "No se pudo identificar al usuario. Por favor, inicie sesión nuevamente."
          );
        }
      } catch (error) {
        console.error("Error procesando el archivo:", error);
        // Mostrar error de validación
        setImportError(
          error instanceof Error ? error.message : "Error desconocido"
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        onOpenChange(val);
        form.reset();
        setImportError(null);
        setImportSuccess(null);
      }}
    >
      <DialogContent className="gap-2 sm:max-w-sm">
        <DialogHeader className="text-start">
          <DialogTitle>Importar Clientes</DialogTitle>
          <DialogDescription>
            Importar clientes rápidamente desde un archivo de Excel.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-105 w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3">
          <Form {...form}>
            <form
              id="client-import-form"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="file"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div
                        className={`relative rounded-lg border-2 border-dashed transition-colors ${
                          dragActive
                            ? "border-primary"
                            : "border-muted-foreground/30"
                        } p-8 text-center cursor-pointer hover:border-muted-foreground/50`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={(e) => {
                          handleDrop(e);
                          const files = e.dataTransfer.files;
                          if (files.length > 0) {
                            const fileList = new DataTransfer();
                            fileList.items.add(files[0]);
                            field.onChange(fileList.files);
                          }
                        }}
                        onClick={() => {
                          const input = document.querySelector(
                            'input[type="file"]'
                          ) as HTMLInputElement;
                          input?.click();
                        }}
                      >
                        <input
                          type="file"
                          className="hidden"
                          accept=".csv,.xlsx,.xls"
                          onChange={(e) => {
                            const files = e.target.files;
                            if (files && files.length > 0) {
                              field.onChange(files);
                            }
                          }}
                        />
                        <div className="flex flex-col items-center gap-3">
                          {field.value && field.value.length > 0 ? (
                            <Image
                              src="/microsoft-excel.svg"
                              alt="Microsoft Excel"
                              width={50}
                              height={50}
                              className="opacity-80"
                            />
                          ) : (
                            <ArrowDownToLine className="h-10 w-10 text-muted-foreground" />
                          )}
                          <div className="text-center">
                            <span className="text-sm font-medium text-foreground block">
                              Arrastre y suelte su archivo de Excel aquí
                            </span>
                            <span className="text-xs text-muted-foreground">
                              o haga clic para seleccionar el archivo
                            </span>
                          </div>
                          {field.value && field.value.length > 0 && (
                            <div className="mt-2 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                              {field.value[0].name}
                            </div>
                          )}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>

          {/* Mostrar errores de importación */}
          {importError && (
            <div className="w-full my-2">
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-950">
                <div className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-red-500 mt-2"></div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-red-800 dark:text-red-200 mb-1">
                      Error de validación
                    </h4>
                    <pre className="text-xs text-red-700 dark:text-red-300 whitespace-pre-wrap">
                      {importError}
                    </pre>
                  </div>
                  <button
                    onClick={() => setImportError(null)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Mostrar mensaje de éxito */}
          {importSuccess && (
            <div className="w-full my-2">
              <div className="rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-950">
                <div className="flex items-start gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500 mt-2"></div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-green-800 dark:text-green-200 mb-1">
                      ¡Importación Exitosa!
                    </h4>
                    <pre className="text-xs text-green-700 dark:text-green-300 whitespace-pre-wrap">
                      {importSuccess}
                    </pre>
                  </div>
                  <button
                    onClick={() => setImportSuccess(null)}
                    className="text-green-500 hover:text-green-700 text-sm"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="w-full my-2">
            <Collapsible open={showWarning} onOpenChange={setShowWarning}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-between h-8 px-3 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 animate-pulse-bg dark:animate-pulse-bg-dark"
                >
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-red-500"></div>
                    <span className="text-sm font-medium">
                      Notas importantes de importación
                    </span>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform animate-bounce-chevron ${showWarning ? "rotate-180" : ""}`}
                  />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2">
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-950 mt-2">
                  <ul className="text-xs text-red-700 dark:text-red-300 space-y-1 list-disc list-inside">
                    <li>Una vez importados los clientes no hay vuelta atrás</li>
                    <li>
                      Los clientes sin ventas registradas en la app serán
                      eliminados al momento de la importación
                    </li>
                    <li>
                      Si un cliente existe en la app y en el Excel (mismo número
                      de documento), solo se actualizarán los datos
                    </li>
                    <li>
                      Los clientes nuevos del Excel se añadirán automáticamente
                    </li>
                  </ul>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
          <div className="w-full">
            <div className="rounded-lg border border-muted bg-muted/30 p-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ArrowDownToLine className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    ¿No tienes la plantilla de Excel?
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs hover:bg-muted-foreground/10"
                  onClick={downloadExcelTemplate}
                >
                  <Download size={12} className="mr-1" />
                  Descargar
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full"></div>
        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="outline">Cerrar</Button>
          </DialogClose>
          <Button disabled={isLoading} type="submit" form="client-import-form">
            {isLoading ? <Loader2 className="animate-spin" /> : <Download />}
            {isLoading ? "Importando clientes..." : "Importar clientes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
