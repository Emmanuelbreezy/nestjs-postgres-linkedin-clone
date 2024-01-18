import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { FeedPostEntity } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FeedPost } from './types/post.type';
import { Observable, from } from 'rxjs';

@Injectable()
export class FeedService {
  constructor(
    @InjectRepository(FeedPostEntity)
    private readonly feedpostRepository: Repository<FeedPostEntity>,
  ) {}

  // Using rxjs Observable asynchronously
  createPost(feedPost: FeedPost): Observable<FeedPost> {
    return from(this.feedpostRepository.save(feedPost));
  }

  // Using async/await asynchronously
  async findAllPost(): Promise<FeedPost[]> {
    return await this.feedpostRepository.find();
  }

  async updatePost(
    id: number,
    feedPost: FeedPost,
  ): Promise<{ message: string; status: string; data: FeedPost }> {
    const updatedPost = await this.feedpostRepository
      .createQueryBuilder()
      .update(FeedPostEntity)
      .set(feedPost)
      .where('id = :id', { id })
      .returning('*') // Use '*' to return all columns; adjust as needed
      .execute();

    if (!updatedPost.raw.length) {
      throw new NotFoundException(`Post not found`);
    }

    const updatedData: FeedPost = updatedPost.raw[0];

    return {
      message: 'Post updated successfully',
      status: 'success',
      data: updatedData,
    };
  }

  async deletePost(id: number) {
    try {
      const result = await this.feedpostRepository.delete(id);

      if (result.affected === 0) {
        throw new NotFoundException('Post not found');
      }

      return {
        message: 'Post deleted successfully',
        status: 'success',
      };
    } catch (error) {
      if (error.code === '23503') {
        // Foreign key violation, post not found
        throw new NotFoundException('Post not found');
      }

      throw error;
    }
  }
}
