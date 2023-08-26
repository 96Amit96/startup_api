import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class UserDto {
  @ApiProperty()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsOptional()
  phoneNumber: string;

  @ApiProperty()
  @IsOptional()
  dateOfBirth: Date;

  @ApiProperty()
  @IsOptional()
  isEligibleDate: Date;

  @ApiProperty()
  @IsOptional()
  otp: string;

  @ApiProperty()
  @IsOptional()
  isActive: boolean;
}