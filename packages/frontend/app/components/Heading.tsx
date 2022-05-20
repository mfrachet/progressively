export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  size?: "lg" | "3xl" | "xl" | "md";
  as?: any;
}

export const Heading: React.FC<HeadingProps> = (props) => {
  return <h2 {...props} />;
};
