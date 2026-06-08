import { IsUrl, IsOptional, IsDateString } from 'class-validator';
export class CreateUrlDto {
  @IsUrl()
  originalUrl: string;
  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}
