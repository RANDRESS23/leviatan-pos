import { ThemeSwitch } from "@/components/theme-switch";
import { Card, CardContent } from "@/components/ui/card";
import { UserAuthForm } from "@/components/user-auth-form";

export default function Page() {
  return (
    <div className="relative flex min-h-screen py-20 w-full items-center justify-center overflow-hidden bg-linear-to-br from-background via-muted/30 to-background">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 animate-pulse rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 animate-pulse rounded-full bg-accent/10 blur-3xl delay-1000" />
      </div>

      {/* Main content container */}
      <div className="relative w-full max-w-md px-4">
        {/* Logo/Brand section */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold">Leviatán POS</h1>
          <p className="text-sm text-muted-foreground">
            Bienvenido de nuevo, inicia sesión para continuar
          </p>
        </div>

        <Card className="gap-4">
          <CardContent>
            <UserAuthForm />
          </CardContent>
        </Card>

        {/* Footer text */}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Al iniciar sesión, aceptas nuestros{" "}
          <a href="#" className="text-primary hover:underline">
            Términos de Servicio
          </a>{" "}
          y{" "}
          <a href="#" className="text-primary hover:underline">
            Política de Privacidad
          </a>
        </p>
      </div>

      <div className="fixed top-4 right-4">
        <ThemeSwitch />
      </div>
    </div>
  );
}
