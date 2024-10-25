import type { PropsWithChildren } from "react";
import Menu from "../menu";

export const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div>
      <Menu />
      {children}
    </div>
  );
};
