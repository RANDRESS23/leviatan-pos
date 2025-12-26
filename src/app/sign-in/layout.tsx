import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Iniciar Sesión | Leviatán POS",
  description: "Inicia sesión en tu cuenta de Leviatán POS",
};

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
