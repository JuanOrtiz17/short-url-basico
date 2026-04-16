import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  // @IsEmail() → valida que sea un email real, ej: "user@example.com"
  @IsEmail()
  email: string;

  // @MinLength(6) → la contraseña debe tener al menos 6 caracteres
  @IsString()
  @MinLength(6)
  password: string;
}
