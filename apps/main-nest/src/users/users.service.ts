import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class UsersService {

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) { }

  create(createUserDto: CreateUserDto) {
    const key = 'users-find-all';
    this.cacheManager.del(key);
    return 'This action adds a new user';
  }

  async findAll() {
    const key = 'users-find-all';
    const usersCached = await this.cacheManager.get(key);

    if (usersCached) return usersCached;

    const users = [
      { id: 1, name: 'John' },
      { id: 2, name: 'Doe' },
    ];
    await this.sleep(5000);

    await this.cacheManager.set(key, users, 1000 * 10);
    return users;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
}
