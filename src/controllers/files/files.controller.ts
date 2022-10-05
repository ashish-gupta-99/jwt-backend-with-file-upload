import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
@Controller('files')
@ApiTags('Files Endpoints')
export class FilesController {}
