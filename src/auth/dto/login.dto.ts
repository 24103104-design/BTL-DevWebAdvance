import { IsString, MinLength, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'Username không được trống' })
  @IsString()
  @MinLength(3, { message: 'Username phải có ít nhất 3 ký tự' })
  username!: string;

  @IsNotEmpty({ message: 'Password không được trống' })
  @IsString()
  @MinLength(6, { message: 'Password phải có ít nhất 6 ký tự' })
  password!: string;
}