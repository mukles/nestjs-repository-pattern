import { Injectable, Logger } from "@nestjs/common";
import { promises as fs } from "fs";
import * as path from "path";

@Injectable()
export class UtilsService {
  private readonly logger = new Logger(UtilsService.name);
  private readonly uploadDir = path.join(__dirname, "..", "..", "..", "..");

  public async doesImageExist(imagePath: string): Promise<boolean> {
    if (!imagePath) return false;

    const fullPath = path.join(this.uploadDir, imagePath);
    try {
      await fs.access(fullPath);
      return true;
    } catch {
      return false;
    }
  }

  public async removeFileFromLocal(filePathStr: string): Promise<boolean> {
    const filePath = path.join(process.cwd(), filePathStr);

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        await fs.unlink(filePath);
        this.logger.log(
          `File deleted successfully (attempt ${attempt}): ${filePathStr}`,
        );
        return true;
      } catch (err) {
        if (err.code === "ENOENT") {
          this.logger.warn(`File not found: ${filePathStr}`);
          return false;
        }
        this.logger.warn(
          `Attempt ${attempt} failed to delete file: ${filePathStr}`,
        );
        if (attempt === 3) {
          this.logger.error(
            `File deletion failed after 3 attempts: ${filePathStr}`,
          );
          return false;
        }
      }
    }

    return false;
  }
}
