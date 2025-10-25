import { Inject, Injectable } from '@nestjs/common';
import { Readable } from 'stream';
import {
  v2 as Cloudinary,
  UploadApiOptions,
  UploadApiResponse,
  UploadApiErrorResponse,
} from 'cloudinary';
import { CLOUDINARY } from './cloudinary.constants';

@Injectable()
export class CloudinaryService {
  constructor(@Inject(CLOUDINARY) private cld: typeof Cloudinary) {}

  uploadBuffer(
    buffer: Buffer,
    filename: string,
    options: UploadApiOptions = {},
  ): Promise<UploadApiResponse> {
    const opts: UploadApiOptions = {
      folder: 'products',
      resource_type: 'image',
      use_filename: true,
      unique_filename: true,
      overwrite: false,
      filename_override: filename,
      ...options,
    };

    return new Promise((resolve, reject) => {
      const stream = this.cld.uploader.upload_stream(
        opts,
        (err: UploadApiErrorResponse, res: UploadApiResponse) => {
          if (err) return reject(err);
          resolve(res);
        },
      );
      Readable.from(buffer).pipe(stream);
    });
  }

  destroy(publicId: string) {
    return this.cld.uploader.destroy(publicId);
  }
}
