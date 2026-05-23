interface PageHeaderProps {
  title: string;
  subtitle: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <header className="mb-4">
      <p className="text-sm font-semibold text-aqua">{subtitle}</p>
      <h1 className="mt-1 text-[26px] font-extrabold leading-tight text-white">{title}</h1>
    </header>
  );
}
