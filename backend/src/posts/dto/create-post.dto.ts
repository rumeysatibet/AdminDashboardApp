import { IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';

export class CreatePostDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(5, { message: 'Title must be at least 5 characters long' })
  title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10, { message: 'Body must be at least 10 characters long' })
  body: string;
}
