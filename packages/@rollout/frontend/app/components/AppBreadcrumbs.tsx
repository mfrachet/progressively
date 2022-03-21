import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Icon,
} from "@chakra-ui/react";
import { FiChevronRight } from "react-icons/fi";
import { Link } from "remix";

export interface Crumb {
  link: string;
  label: string;
}

export type Crumbs = Array<Crumb>;

export interface BreadCrumbsProps {
  crumbs: Crumbs;
}

export const BreadCrumbs = ({ crumbs }: BreadCrumbsProps) => {
  const lastItemIndex = crumbs.length - 1;

  return (
    <Breadcrumb
      pb={2}
      separator={
        <Icon display="flex" alignItems="center" as={FiChevronRight} />
      }
    >
      {crumbs.map((crumb, index) => (
        <BreadcrumbItem
          isCurrentPage={index === lastItemIndex}
          key={crumb.link}
        >
          <BreadcrumbLink
            fontWeight={index === lastItemIndex ? "semibold" : undefined}
            textDecoration="underline"
            as={Link}
            to={crumb.link}
            fontSize="lg"
          >
            {crumb.label}
          </BreadcrumbLink>
        </BreadcrumbItem>
      ))}
    </Breadcrumb>
  );
};
