import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Users, UsersDocument } from 'src/schemas/users.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name) private usersModal: Model<UsersDocument>,
  ) {}

  createMongoUser(userData) {
    const createdUser = new this.usersModal(userData);
    return createdUser.save();
  }

  async getAllMongoUsers(
    limit: number,
    pageNo: number,
    filter: any = {},
    sort: any = { _id: 1 },
  ) {
    const skip = pageNo * limit - limit;
    const [data, count] = await Promise.all([
      this.usersModal.find(filter).sort(sort).skip(skip).limit(limit),
      this.usersModal.count(),
    ]);
    return {
      data,
      count,
    };
  }

  findUserByEmail(email: string) {
    return this.usersModal.findOne({ email }).exec();
  }
}
