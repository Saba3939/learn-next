import { Badge } from "./ui/badge";

type CategoryProps = {
  name: string
}
export const CategoryBadge = ({ name }: CategoryProps) => {
  return (
    <Badge>{name}</Badge>
  )
}
