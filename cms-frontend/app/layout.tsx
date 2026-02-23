import "./globals.css";
import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body style={{ margin: 0, fontFamily: "Arial" }}>
        <div style={{ display: "flex", height: "100vh" }}>
          
          {/* Sidebar */}
          <aside
            style={{
              width: 220,
              background: "#1e293b",
              color: "white",
              padding: 20,
            }}
          >
            <h2>CMS Admin</h2>
            <nav style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Link href="/dashboard" style={{ color: "white" }}>Dashboard</Link>
              <Link href="/articles" style={{ color: "white" }}>Articles</Link>
              <Link href="/categories" style={{ color: "white" }}>Categories</Link>
              <Link href="/notifications" style={{ color: "white" }}>Notifications</Link>
              <Link href="/import" style={{ color: "white" }}>Import</Link>
            </nav>
          </aside>

          {/* Main */}
          <main style={{ flex: 1, padding: 30, overflow: "auto" }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}