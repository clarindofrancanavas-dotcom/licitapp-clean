export const metadata = {
  title: "Licitapp",
  description: "Busca de oportunidades PNCP"
};

import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
