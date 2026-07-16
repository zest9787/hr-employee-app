import { AuthProvider as CommonAuthProvider } from "@company/hr-common-auth";
import type { PropsWithChildren } from "react";

export function AuthProvider({ children }: PropsWithChildren) {
  return <CommonAuthProvider>{children}</CommonAuthProvider>;
}
