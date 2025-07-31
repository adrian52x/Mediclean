interface HeadingProps {
  title: string;
  description?: string;
  id?: string;
}

export const SectionHeading: React.FC<HeadingProps> = ({
  title,
  description,
  id
}) => {
  return (
    <div className="my-4 scroll-mt-24" id={id}>
      <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
};
