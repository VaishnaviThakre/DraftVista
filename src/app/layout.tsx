import './globals.css';
import Header from './components/header';
import Footer from './components/Footer';

export const metadata = {
  title: 'DraftVista',
  description: 'AI-driven manuscript review and rejection analysis',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <Header />
        <main className="min-h-screen px-4 pt-4 pb-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
