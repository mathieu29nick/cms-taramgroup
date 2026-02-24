import MuiProvider from "@/components/MuiProvider";
import Link from "next/link";
import RoleToggle from "@/components/RoleToogle";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body style={{ margin: 0 }}>
        <MuiProvider>
          <div
            style={{
              display: "flex",
              minHeight: "100vh",
            }}
          >
            <aside
              style={{
                width: 240,
                background: "#0f172a",
                color: "white",
                padding: 20,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <h2>CMS Dashboard</h2>

              <nav
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  marginTop: 20,
                }}
              >
                <Link style={{ textDecoration: "none", color: "white"}} href="/dashboard">Dashboard</Link>
                <Link style={{ textDecoration: "none", color: "white"}} href="/articles">Articles</Link>
                <Link style={{ textDecoration: "none", color: "white"}} href="/categories">Categories</Link>
                <Link style={{ textDecoration: "none", color: "white"}} href="/networks">Networks</Link>
                <Link style={{ textDecoration: "none", color: "white"}} href="/notifications">Notifications</Link>
                <Link style={{ textDecoration: "none", color: "white"}} href="/import">Import</Link>
              </nav>
              <RoleToggle />
            </aside>

            <main
              style={{
                flex: 1,
                padding: 30,
                background: "#f8fafc",
              }}
            >
              {children}
            </main>
          </div>
        </MuiProvider>
      </body>
    </html>
  );
}