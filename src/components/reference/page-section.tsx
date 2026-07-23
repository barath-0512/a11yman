export function PageSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="space-y-4">
      <h2 id={id} className="text-2xl font-semibold tracking-tight">
        {title}
      </h2>
      {children}
    </section>
  );
}
