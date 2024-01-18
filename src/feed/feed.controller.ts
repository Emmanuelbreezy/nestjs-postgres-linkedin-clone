import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { FeedService } from './feed.service';
import { FeedPost } from './types/post.type';
import { Observable } from 'rxjs';

@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Post()
  create(@Body() feedPost: FeedPost): Observable<FeedPost> {
    return this.feedService.createPost(feedPost);
  }

  @Get()
  async findAll(): Promise<FeedPost[]> {
    return await this.feedService.findAllPost();
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() feedPost: FeedPost,
  ): Promise<{ message: string; status: string; data: FeedPost }> {
    return await this.feedService.updatePost(id, feedPost);
  }

  @Delete(':id')
  async delete(
    @Param('id') id: number,
  ): Promise<{ message: string; status: string }> {
    return await this.feedService.deletePost(id);
  }
}
