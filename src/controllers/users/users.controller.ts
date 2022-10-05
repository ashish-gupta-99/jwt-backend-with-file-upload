import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBody, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { sign as jwtSign } from 'jsonwebtoken';
import { env } from 'process';
import { compareSync, hashSync } from 'bcrypt';

import {
  FindUsersDTO,
  LoginUserDTO,
  RegisterUserDTO,
} from '../../dtos/users.dto';
import { UsersService } from '../../services/users/users.service';
import { AuthGuard } from '../../guards/auth.gaurd';

@Controller('users')
@ApiTags('Users Endpoints')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('list-users')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Get all users list api' })
  @ApiBody({
    type: FindUsersDTO,
    description: '',
  })
  listUsers(@Body() body: FindUsersDTO) {
    try {
      return this.usersService.getAllMongoUsers(
        body.limit,
        body.pageNo,
        body.filter,
        body.sort,
      );
    } catch (error) {
      console.log('listUsers error:', error);

      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Registration failed!',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put('register')
  @ApiOperation({ summary: 'User Register api' })
  @ApiBody({
    type: RegisterUserDTO,
    description: '',
  })
  async registerUser(@Body() body: RegisterUserDTO) {
    try {
      const hashedPassword = hashSync(body.password, 10);
      // const accessToken = jwtSign(body, env.JWT_SECRET_KEY);

      await this.usersService.createMongoUser({
        ...body,
        password: hashedPassword,
      });

      return this.loginUser({ email: body.email, password: body.password });
    } catch (error) {
      console.log('registerUser error:', error);

      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Registration failed!',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('login')
  @ApiOperation({ summary: 'User Login api' })
  @ApiBody({
    type: LoginUserDTO,
    description: '',
  })
  async loginUser(@Body() body: LoginUserDTO) {
    try {
      // console.log(body);

      const userData = await this.usersService.findUserByEmail(body.email);

      if (!userData?.email) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'User with provide email not found!',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      const isCorrectPassword = compareSync(body.password, userData.password);

      if (!isCorrectPassword) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Password not match!',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      return {
        token: jwtSign(
          { ...userData, _id: userData._id.toString() },
          env.JWT_SECRET_KEY,
        ),
        message: 'Login success!',
      };
    } catch (error) {
      console.log('loginUser error:', error);

      throw new HttpException(
        {
          status: error?.status || HttpStatus.BAD_REQUEST,
          error: error?.response?.error || 'Login failed!',
        },
        error?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}
