interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-[#131313] text-white flex justify-center">
      <div className="w-full max-w-7xl">{children}</div>
    </div>
  );
};

export default Layout;
