import { Response } from 'express';
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { File } from '../../types/interfaces';
import { AuthGuard } from '../../guards/auth.gaurd';
import { FilesService } from '../../services/files/files.service';
import { ListFilesDTO } from '../../dtos/files.dto';

@Controller('files')
@ApiTags('Files Endpoints')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiBearerAuth('JWT')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile('file') file: File) {
    try {
      //   console.log(file);

      await this.filesService.saveToDb(file);

      return { message: 'file uploaded' };
    } catch (error) {
      console.log(error);

      throw new HttpException(
        {
          status: error?.status || HttpStatus.BAD_REQUEST,
          error: error?.response?.error || 'File upload failed!',
        },
        error?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('list-files')
  @ApiBearerAuth('JWT')
  @UseGuards(AuthGuard)
  getFiles(@Body() body: ListFilesDTO) {
    try {
      return this.filesService.getFiles(
        body.limit,
        body.pageNo,
        body.filter,
        body.sort,
      );
    } catch (error) {
      throw new HttpException(
        {
          status: error?.status || HttpStatus.BAD_REQUEST,
          error: error?.response?.error || 'File upload failed!',
        },
        error?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('download-file/:id')
  @ApiParam({
    name: 'id',
    type: 'string',
    example: '633da305853a61bf5e1fda36',
  })
  async downloadFile(@Res() res: Response, @Param() { id }) {
    try {
      const [objId, link] = id.split('-');

      const [fileData] = await this.filesService.getFileById(objId);

      if (!link) {
        res.setHeader(
          'content-disposition',
          'attachment; filename="' + fileData.filename + '";',
        );
        res.setHeader('content-type', 'multipart/form-data');
        res.setHeader('filename', fileData.filename);
        res.setHeader('content-length', fileData.length);
      }

      this.filesService.downloadFiles(res, objId);
    } catch (error) {
      throw new HttpException(
        {
          status: error?.status || HttpStatus.BAD_REQUEST,
          error: error?.response?.error || 'File upload failed!',
        },
        error?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}
