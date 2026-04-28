export const metadata = {
  title: 'Matchmaker - 找到你的缘分',
  description: '免费相亲平台',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-gray-100">
        {children}
      </body>
    </html>
  );
}
