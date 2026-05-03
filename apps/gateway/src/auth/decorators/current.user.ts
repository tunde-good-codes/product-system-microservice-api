import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { UserContext } from "apps/auth/src/auth.types";

export const CurrentUser = createParamDecorator((data: string | undefined, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();

  const user  = req.user as UserContext | undefined;

  return data ? user?.[data] : user
});
