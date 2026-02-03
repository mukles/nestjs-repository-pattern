import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

import { StorageProvider } from "../interfaces/storage-provider.interface";

export class R2Storage implements StorageProvider {
  private client: S3Client;

  constructor(
    private readonly bucket: string,
    private readonly accessKeyId: string,
    private readonly secretAccessKey: string,
    private readonly region: string,
    private readonly cdnUrl?: string,
  ) {
    this.client = new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      forcePathStyle: false,
    });
  }

  async upload(key: string, buffer: Buffer, contentType: string) {
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      }),
    );
    return this.getUrl(key);
  }

  async delete(key: string) {
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );
  }

  getUrl(key: string) {
    if (this.cdnUrl) return `${this.cdnUrl}/${key}`;
    return `https://${this.bucket}.r2.cloudflarestorage.com/${key}`;
  }
}
