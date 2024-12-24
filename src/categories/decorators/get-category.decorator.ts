import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";

export const GetCategory = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest()
    const category = req.category

    if (!category)
      throw new InternalServerErrorException('Category not found (request)')

    return (!data)
      ? category
      : category[data]
  }
)