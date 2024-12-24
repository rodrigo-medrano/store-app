import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";

export const GetProvider = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest()
    const provider = req.provider

    if (!provider)
      throw new InternalServerErrorException('Provider not found (request)')

    return (!data)
      ? provider
      : provider[data]
  }
)