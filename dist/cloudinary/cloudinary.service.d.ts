/// <reference types="node" />
import { v2 as Cloudinary, UploadApiOptions, UploadApiResponse } from 'cloudinary';
export declare class CloudinaryService {
    private cld;
    constructor(cld: typeof Cloudinary);
    uploadBuffer(buffer: Buffer, filename: string, options?: UploadApiOptions): Promise<UploadApiResponse>;
    destroy(publicId: string): Promise<any>;
}
