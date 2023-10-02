import Sidebar from "@/components/Sidebar";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main id="sidebar">
      <Sidebar />
      <>{children}</>
    </main>
  );
}
