"use client";

import {
  Download,
  UserPlus,
  FileDown,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useClients } from "./clients-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getClients } from "../_actions/client";
import { useAuth } from "@/hooks/use-auth";
import { exportClientsToExcel } from "../_utils/excel-export";
import { exportClientsToPdf } from "../_utils/pdf-export";
import { useConfetti } from "@/hooks/use-confetti";
import Realistic from "react-canvas-confetti/dist/presets/realistic";
import { useState } from "react";

export function ClientsPrimaryButtons() {
  const [isLoading, setIsLoading] = useState(false);
  const { setOpen } = useClients();
  const { authUser } = useAuth();
  const { onInitHandler, onShoot } = useConfetti();

  const handleExportExcel = async () => {
    try {
      setIsLoading(true);

      const { clientes, tiposDocumento } = await getClients(authUser?.id || "");

      const result = exportClientsToExcel({ clientes, tiposDocumento });

      // // Verificar si hay error
      if (!result.success) {
        toast.error(result.message);
        return;
      }

      // // Verificar si es una respuesta exitosa con datos para descargar
      if (result.success) {
        // Crear un Blob
        const blob = new Blob([result.buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        // Crear URL para descargar
        const url = window.URL.createObjectURL(blob);

        // Crear enlace temporal
        const link = document.createElement("a");
        link.href = url;
        link.download = result.fileName || "clientes_exportados.xlsx";

        // Simular click
        document.body.appendChild(link);
        link.click();

        // Limpiar
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        toast.success(
          "¡Clientes exportados exitosamente en formato Excel (.xlsx)!"
        );
        onShoot();
      }
    } catch (error) {
      toast.error("¡Error al exportar clientes en formato Excel (.xlsx)!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportPdf = async () => {
    try {
      setIsLoading(true);

      const { clientes } = await getClients(authUser?.id || "");

      const result = exportClientsToPdf({ clientes });

      // Verificar si hay error
      if (!result.success) {
        toast.error(result.message);
        return;
      }

      // Verificar si es una respuesta exitosa con datos para descargar
      if (result.success && result.buffer) {
        // Crear un Blob directamente desde el Uint8Array
        const blob = new Blob([new Uint8Array(result.buffer)], {
          type: "application/pdf",
        });

        // Crear URL para descargar
        const url = window.URL.createObjectURL(blob);

        // Crear enlace temporal
        const link = document.createElement("a");
        link.href = url;
        link.download = result.fileName || "reporte_clientes.pdf";

        // Simular click
        document.body.appendChild(link);
        link.click();

        // Limpiar
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        toast.success(
          "¡Clientes exportados exitosamente en formato PDF (.pdf)!"
        );
        onShoot();
      }
    } catch (error) {
      toast.error("¡Error al exportar clientes en formato PDF (.pdf)!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="w-full flex flex-col md:flex-row gap-2">
        <div className="w-full flex flex-col md:flex-row justify-center md:justify-end gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                disabled={isLoading}
                variant="outline"
                className="space-x-2"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <FileDown size={18} />
                )}
                <span>
                  {isLoading ? "Exportando clientes..." : "Exportar clientes"}
                </span>
                <ChevronDown
                  size={16}
                  className="transition-transform group-data-[state=open]:rotate-180"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem
                className="flex items-center gap-3 cursor-pointer"
                onClick={handleExportExcel}
              >
                <div className="flex items-center justify-center w-6 h-6">
                  <Image
                    src="/microsoft-excel.svg"
                    alt="Microsoft Excel"
                    width={24}
                    height={24}
                    className="w-full h-full"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium">Exportar a Excel</span>
                  <span className="text-xs text-muted-foreground">
                    Formato .xlsx
                  </span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="flex items-center gap-3 cursor-pointer"
                onClick={handleExportPdf}
              >
                <div className="flex items-center justify-center w-6 h-6">
                  <Image
                    src="/pdf.svg"
                    alt="PDF"
                    width={24}
                    height={24}
                    className="w-full h-full"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium">Exportar a PDF</span>
                  <span className="text-xs text-muted-foreground">
                    Formato .pdf
                  </span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            disabled={isLoading}
            variant="outline"
            className="space-x-1"
            onClick={() => setOpen("import")}
          >
            <span>Importar clientes</span> <Download size={18} />
          </Button>
        </div>
        <Button className="space-x-1" onClick={() => setOpen("add")}>
          <span>Registrar cliente</span> <UserPlus size={18} />
        </Button>
      </div>
      <Realistic
        onInit={onInitHandler}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 9999,
        }}
      />
    </>
  );
}
