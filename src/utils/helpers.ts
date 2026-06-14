export const getInitials = (name?: string) =>
  `${name?.at(0)}${name?.split(" ").at(1)?.at(0)}`;
