import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";

export const GetProduct = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest()
    const product = req.product

    if (!product)
      throw new InternalServerErrorException('Product not found (request)')

    return (!data)
      ? product
      : product[data]
  }
)