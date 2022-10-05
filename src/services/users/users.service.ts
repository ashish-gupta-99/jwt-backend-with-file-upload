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

  getAllMongoUsers() {
    return this.usersModal.find().exec();
  }
}
