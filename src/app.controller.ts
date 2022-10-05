import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AppService } from './app.service';

@Controller()
@ApiTags('Root Endpoints')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    // description: 'Health Check api',
    summary: 'Health check api',
  })
  healthCheck() {
    return this.appService.healthCheck();
  }
}
