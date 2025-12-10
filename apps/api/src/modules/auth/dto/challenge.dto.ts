import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class ChallengeDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+?\d{10,15}$/)
  phone!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  lastName!: string;
}

