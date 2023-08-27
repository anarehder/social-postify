import { PartialType } from '@nestjs/mapped-types';
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { CreatePublicationDto } from './create-publication.dto';

@ValidatorConstraint({ name: 'customDateFormat', async: false })
export class CustomDateFormatValidator implements ValidatorConstraintInterface {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validate(value: string, args: ValidationArguments) {
    // Use uma expressão regular para verificar o formato da data
    const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
    return regex.test(value);
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} deve estar no formato "YYYY-MM-DDTHH:mm:ss.SSSZ"`;
  }
}

export class UpdatePublicationDto extends PartialType(CreatePublicationDto) {
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

  @IsString()
  @Validate(CustomDateFormatValidator)
  @IsNotEmpty({
    message: 'All fields are required!',
  })
  date: string;
}
