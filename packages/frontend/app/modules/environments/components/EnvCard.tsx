import { useRef } from "react";
import { Typography } from "~/components/Typography";
import { VisuallyHidden } from "~/components/VisuallyHidden";
import { Tag } from "~/components/Tag";
import { Link } from "~/components/Link";
import { Card, CardFooter, CardHeader } from "~/components/CardGroup";
import { TagLine } from "~/components/Tagline";
import { Spacer } from "~/components/Spacer";

export interface EnvCardProps {
  id: string;
  linkTo: string;
  title: string;
  clientKey: string;
}

export const EnvCard = ({ id, linkTo, title, clientKey }: EnvCardProps) => {
  const linkRef = useRef<HTMLAnchorElement>(null);

  return (
    <Card onClick={() => linkRef?.current?.click()}>
      <CardHeader as="h3" id={`article-${id}`}>
        <Link ref={linkRef} to={linkTo}>
          {title} <VisuallyHidden>environment</VisuallyHidden>
        </Link>
      </CardHeader>

      <CardFooter>
        <TagLine small>Sdk Key</TagLine>
        <Spacer size={4} />

        <Tag>{clientKey}</Tag>
      </CardFooter>
    </Card>
  );
};
