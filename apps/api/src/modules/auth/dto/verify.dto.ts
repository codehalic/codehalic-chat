import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class VerifyDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+?\d{10,15}$/)
  phone!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4,6}$/)
  code!: string;
}
