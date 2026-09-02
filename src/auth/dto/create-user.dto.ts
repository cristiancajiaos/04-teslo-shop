import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    default: 'test1@google.com"',
    description: 'User Email'
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    default: 'hokum1880S',
    description: 'User Password'
  })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string;

  @ApiProperty({
    default: 'Test One',
    description: 'User Full Name'
  })
  @IsString()
  @MinLength(1)
  fullName: string;
}
