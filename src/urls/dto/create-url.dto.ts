import { IsEmail, IsUrl } from 'class-validator';

export class CreateUrlDto {
  @IsEmail()
  email: string;

  @IsUrl()
  originalUrl: string;
}
