import MuiProvider from "@/components/MuiProvider";
import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <MuiProvider>
          <div style={{ display: "flex", height: "100vh" }}>
            <aside
              style={{
                width: 240,
                background: "#0f172a",
                color: "white",
                padding: 20,
              }}
            >
              <h2>CMS Admin</h2>
              <nav style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <Link href="/dashboard">Dashboard</Link>
                <Link href="/articles">Articles</Link>
                <Link href="/categories">Categories</Link>
                <Link href="/notifications">Notifications</Link>
                <Link href="/import">Import</Link>
              </nav>
            </aside>

            <main style={{ flex: 1, padding: 30 }}>{children}</main>
          </div>
        </MuiProvider>
      </body>
    </html>
  );
}