export const metadata = {
  title: 'Aplikasi Saya',
  description: 'Dibuat dengan Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
 return (
    <div className="auth-container">
      {children}
    </div>
  );
}

