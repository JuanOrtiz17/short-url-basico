import { IsString, IsNumber, IsBoolean, IsOptional, Min } from 'class-validator';
export class CreatePlanDto {
  @IsString()
  name: string;
  @IsOptional()
  @IsString()
  description?: string;
  @IsNumber()
  @Min(0)
  price: number;
  @IsOptional()
  @IsString()
  currency?: string;
  @IsNumber()
  @Min(1)
  urlLimit: number;
  @IsOptional()
  @IsBoolean()
  analyticsEnabled?: boolean;
}
