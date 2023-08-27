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
} from '@nestjs/common';
import { MediasService } from './medias.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';

@Controller('medias')
export class MediasController {
  constructor(private readonly mediasService: MediasService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: CreateMediaDto) {
    return await this.mediasService.createMedia(body);
  }

  @Get()
  async findAll() {
    return await this.mediasService.findAllMedias();
  }

  @Get('/:id')
  async findOne(@Param('id') id: string) {
    return await this.mediasService.findOneMedia(+id);
  }

  @Patch('/:id')
  async update(@Param('id') id: string, @Body() body: UpdateMediaDto) {
    return await this.mediasService.updateMedia(+id, body);
  }

  @Delete('/:id')
  async remove(@Param('id') id: string) {
    return await this.mediasService.removeMedia(+id);
  }
}
