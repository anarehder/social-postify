import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { MediasRepository } from './medias.repository';

@Injectable()
export class MediasService {
  constructor(private readonly repository: MediasRepository) {}

  async checkMedia(title: string, username: string) {
    const checkMedia = await this.repository.findMediaByUserandTitleDB(
      title,
      username,
    );
    return checkMedia;
  }

  async checkId(id: number) {
    const media = await this.repository.findOneMediaDB(id);

    if (!media) {
      throw new NotFoundException('Not found media');
    }
    return media;
  }

  async createMedia(body: CreateMediaDto) {
    const { title, username } = body;
    const checkMedia = await this.checkMedia(title, username);
    if (checkMedia) {
      throw new ConflictException('Already exists');
    }
    return await this.repository.createMediaDB(body);
  }

  async findAllMedias() {
    return await this.repository.findAllMediasDB();
  }

  async findOneMedia(id: number) {
    const media = await this.checkId(id);

    return media;
  }

  async updateMedia(id: number, body: UpdateMediaDto) {
    const { title, username } = body;
    await this.checkId(id);

    const checkMedia = await this.checkMedia(title, username);
    if (checkMedia) {
      throw new ConflictException('Already exists');
    }
    return await this.repository.updateMediaDB(id, body);
  }

  async removeMedia(id: number) {
    await this.checkId(id);
    //conferir no publications se existe algum registro de media com esse id
    return await this.repository.removeMediaDB(id);
  }
}
