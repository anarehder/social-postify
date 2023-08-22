import { IsDate, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CreatePublicationDto {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty({
    message: 'All fields are required!',
  })
  mediaId: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty({
    message: 'All fields are required!',
  })
  postId: number;

  @IsDate()
  @IsNotEmpty({
    message: 'All fields are required!',
  })
  date: Date;
}
