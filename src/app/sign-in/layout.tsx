import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Iniciar Sesión | Leviatan POS",
  description: "Inicia sesión en tu cuenta de Leviatan POS",
};

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
