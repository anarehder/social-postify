import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { PublicationsService } from './publications.service';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';

@Controller('publications')
export class PublicationsController {
  constructor(private readonly publicationsService: PublicationsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() body: CreatePublicationDto) {
    return this.publicationsService.createPublication(body);
  }

  isValidBooleanString(value) {
    return value === 'true' || value === 'false';
  }

  @Get()
  findAll(
    @Query('published') published: string | null,
    @Query('after') after: string | null,
  ) {
    if (published && published !== 'true') {
      if (published !== 'false') {
        throw new BadRequestException('Invalid value for published');
      }
    }
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    const testAfter = regex.test(after);
    if (after && !testAfter) {
      throw new BadRequestException('Invalid value for after');
    }
    return this.publicationsService.findAllPublications(published, after);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.publicationsService.findOnePublication(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdatePublicationDto) {
    return this.publicationsService.updatePublication(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.publicationsService.removePublication(+id);
  }
}
