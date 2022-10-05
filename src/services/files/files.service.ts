import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Response } from 'express';
import { GridFSBucket, Db, ObjectId } from 'mongodb';
import { Connection } from 'mongoose';
import { Readable } from 'stream';
// import Grid from 'gridfs-stream';
// eslint-disable-next-line @typescript-eslint/no-var-requires
// const Grid = require('gridfs-stream');
// import { Grid as GridFsType } from 'gridfs-stream';
import { File } from '../../types/interfaces';

@Injectable()
export class FilesService {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  gridfsBucket: GridFSBucket = new GridFSBucket(
    this.connection.useDb('ashish-db').db as Db,
    {
      bucketName: 'files_upload',
    },
  );

  saveToDb(file: File) {
    return new Promise((res, rej) => {
      //   const wStream = this.gridfsBucket.openUploadStream(file.originalname);
      const readStream = Readable.from(file.buffer);

      readStream.on('close', () => {
        console.log('close');
        res(true);
      });

      readStream.on('end', () => {
        console.log('end');
        res(true);
      });

      readStream.on('error', (err) => {
        console.log(err);
        rej(err);
      });

      readStream.pipe(
        this.gridfsBucket.openUploadStream(file.originalname, {
          metadata: { field: 'myField', value: 'myValue' },
        }),
      );

      //   wStream.on('finish', () => {
      //     res(true);
      //   });

      //   wStream.on('pipe', (src) => {
      //     console.log({ src });
      //   });

      //   wStream.on('error', (err) => {
      //     console.log('wStream error', err);
      //     rej(err);
      //   });

      //   wStream.on('close', () => {
      //     console.log('close');
      //     res(true);
      //   });

      //   wStream.write(file.buffer);
    });

    // const stream = this.gridFs.openUploadStream(
    //   file.originalname + new Date().getTime(),
    // );

    // stream.on('finish', () => {
    //   console.log('finish');
    //   Promise.resolve(true);
    // });

    // stream.on('pipe', (src) => {
    //   console.log('src', src);
    // });

    // stream.on('close', () => {
    //   console.log('close');
    //   //   Promise.resolve(true);
    // });

    // stream.write(file.buffer);
    // const writeStream = this.gridFs.createWriteStream({
    //   content_type: file.mimetype,
    //   filename: file.originalname + new Date().getTime(),
    // });
    // writeStream.on('data', (dt) => {
    //   console.log(dt);
    // });
    // writeStream.on('end', () => {
    //   console.log('upload done');
    //   Promise.resolve(true);
    // });
    // writeStream.write(file.buffer);
    // writeStream.end();
  }

  async getFiles(
    limit: number,
    pageNo: number,
    filter: any = {},
    sort: any = { _id: 1 },
  ) {
    const skip = pageNo * limit - limit;
    const [data, count] = await Promise.all([
      this.gridfsBucket
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .toArray(),
      this.connection.collection('files_upload.files').estimatedDocumentCount(),
    ]);

    return {
      data,
      count,
    };
    // return cursor.map((doc) => doc);
  }

  getFileById(id: string, projection = { filename: 1, length: 1, _id: 0 }) {
    return this.gridfsBucket
      .find({ _id: new ObjectId(id) }, { projection: projection })
      .toArray();
  }

  downloadFiles(res: Response, id: string) {
    const dStream = this.gridfsBucket.openDownloadStream(new ObjectId(id));

    dStream.on('end', () => {
      console.log('end');
      /* close the connection once the streaming is done */
      res.end();
    });

    dStream.pipe(res);
  }
}
