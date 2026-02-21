import type { ReactNode } from "react";
interface LayoutProps {
  children: ReactNode;
}
const Layout = ({ children,}: LayoutProps) => {
  return (
    <div className="h-dvh flex flex-col ">
      <main className="bg-[#eaeaea] flex-1 flex justify-center gap-4 p-4 overflow-hidden">
          {children}
      </main>
    </div>
  );
};

export default Layout;