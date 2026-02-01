import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

import { ApiResponse } from "../common/response";
import { UserResponseDto } from "./dto/user-response.dto";
import { UserService } from "./user.service";

@ApiBearerAuth("JWT-auth")
@ApiTags("User")
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(":userId/profile")
  @HttpCode(HttpStatus.OK)
  @ApiResponse(UserResponseDto)
  async findOne(
    @Param("userId", ParseIntPipe) userId: number,
  ): Promise<UserResponseDto> {
    const user = await this.userService.findById(userId);
    return UserResponseDto.fromEntity(user);
  }
}
