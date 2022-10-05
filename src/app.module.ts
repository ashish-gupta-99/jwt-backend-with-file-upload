import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsersService } from './services/users/users.service';
import { FilesService } from './services/files/files.service';
import { FilesController } from './controllers/files/files.controller';
import { UsersController } from './controllers/users/users.controller';
import { Users, UsersSchema } from './schemas/users.schema';
import { FileUploads, FileUploadsSchema } from './schemas/files.schema';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URL),
    MongooseModule.forFeature([{ name: Users.name, schema: UsersSchema }]),
    MongooseModule.forFeature([
      { name: FileUploads.name, schema: FileUploadsSchema },
    ]),
  ],
  controllers: [AppController, FilesController, UsersController],
  providers: [AppService, UsersService, FilesService],
})
export class AppModule {}
