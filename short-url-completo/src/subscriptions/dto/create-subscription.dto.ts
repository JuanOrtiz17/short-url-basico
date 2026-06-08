import { IsInt, IsOptional, IsString } from 'class-validator';
export class CreateSubscriptionDto {
  @IsInt()
  planId: number;
  @IsOptional()
  @IsString()
  paymentMethod?: string;
}
