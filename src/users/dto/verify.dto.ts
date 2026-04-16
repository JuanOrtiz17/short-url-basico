import { IsEmail, IsString, Length } from 'class-validator';

export class VerifyDto {
  @IsEmail()
  email: string;

  // El código de verificación tiene exactamente 6 caracteres
  @IsString()
  @Length(6, 6)
  code: string;
}
