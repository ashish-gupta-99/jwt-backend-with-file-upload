import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { ApiTags, ApiBody, ApiOperation } from '@nestjs/swagger';
import { sign as jwtSign } from 'jsonwebtoken';
import { env } from 'process';

import { RegisterUserDTO } from '../../dtos/user.dto';

@Controller('users')
@ApiTags('Users Endpoints')
export class UsersController {
  @Get()
  getUsers() {
    return 'Users';
  }

  @Put('register')
  @ApiOperation({ summary: 'User Register api' })
  @ApiBody({
    type: RegisterUserDTO,
    examples: {
      eg1: {
        summary: 'Example Body',
        description: 'example request body for user registeration api',
        value: {
          fullname: 'Ashish',
          password: 'Hello@123world',
          email: 'xyz@gmail.com',
          gender: 'male',
        },
      },
    },
    description: '',
  })
  registerUser(@Body() body: RegisterUserDTO) {
    console.log(body);

    const accessToken = jwtSign(body, env.JWT_SECRET_KEY);

    return accessToken;
  }

  @Post('login')
  @ApiOperation({ summary: 'User Login api' })
  @ApiBody({
    // type: PostHelloBodyDTO,
    description: '',
    examples: {
      eg1: {
        summary: 'Example Body',
        description: 'example request body for user login api',
        value: {
          password: 'Hello@123world',
          email: 'xyz@gmail.com',
        },
      },
    },
  })
  loginUser(@Body() body) {
    console.log(body);
    return jwtSign(body, env.JWT_SECRET_KEY);
  }
}
