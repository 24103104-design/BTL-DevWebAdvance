import { IsEmail, IsString, MinLength, IsNotEmpty, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty({ message: 'Username không được trống' })
  @IsString()
  @MinLength(3, { message: 'Username phải có ít nhất 3 ký tự' })
  username!: string;

  @IsOptional()
  @IsString()
  fullName?: string;

  @IsNotEmpty({ message: 'Email không được trống' })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email!: string;

  @IsNotEmpty({ message: 'Password không được trống' })
  @IsString()
  @MinLength(6, { message: 'Password phải có ít nhất 6 ký tự' })
  password!: string;
}
