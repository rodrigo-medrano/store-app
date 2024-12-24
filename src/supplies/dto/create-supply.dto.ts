import { IsDate, IsMongoId, IsNotEmpty, IsNumber, IsOptional, ValidateIf } from "class-validator"
import { Types } from "mongoose";

export class CreateSupplyDto {
  @IsDate()
  @IsNotEmpty()
  date: Date
  @IsNumber()
  @IsNotEmpty()
  amount: number

  @IsOptional()
  @ValidateIf((obj,value)=> typeof value === 'string' || value instanceof Types.ObjectId)
  @IsMongoId()
  product_id?: string | Types.ObjectId;

  @IsOptional()
  @ValidateIf((obj,value)=> typeof value === 'string' || value instanceof Types.ObjectId)
  @IsMongoId()
  provider_id?: string | Types.ObjectId;
}