import { Injectable } from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { MediasRepository } from './medias.repository';

@Injectable()
export class MediasService {
  constructor(private readonly repository: MediasRepository) {}
  async createMedia(body: CreateMediaDto) {
    return await this.repository.createMediaDB(body);
  }

  async findAllMedias() {
    return await this.repository.findAllMediasDB();
  }

  async findOneMedia(id: number) {
    return await this.repository.findOneMediaDB(id);
  }

  async updateMedia(id: number, body: UpdateMediaDto) {
    return await this.repository.updateMediaDB(id, body);
  }

  async removeMedia(id: number) {
    return await this.repository.removeMediaDB(id);
  }
}
