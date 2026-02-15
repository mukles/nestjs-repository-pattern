import { promises as fs } from "fs";
import { join } from "path";

import { StorageProvider } from "../interfaces/storage-provider.interface";

export class LocalStorage implements StorageProvider {
  private readonly basePath: string;
  private readonly publicUrl: string;

  /**
   * @param basePath - where to save files on disk
   * @param publicUrl - URL prefix for accessing files, e.g., http://localhost:3000/uploads
   */
  constructor(basePath: string, publicUrl: string) {
    this.basePath = basePath;
    this.publicUrl = publicUrl;
  }

  async upload(key: string, buffer: Buffer): Promise<string> {
    const filePath = join(this.basePath, key);

    await fs.mkdir(join(this.basePath, key.split("/").slice(0, -1).join("/")), {
      recursive: true,
    });

    await fs.writeFile(filePath, buffer);

    return this.getUrl(key);
  }

  async delete(key: string): Promise<void> {
    const filePath = join(this.basePath, key);
    try {
      await fs.unlink(filePath);
    } catch (err) {
      // File may not exist, ignore
    }
  }

  getUrl(key: string): string {
    // For local, we assume you serve the folder via a static route
    return `${this.publicUrl}/${key}`;
  }
}
