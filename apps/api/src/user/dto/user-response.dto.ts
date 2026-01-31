import { ApiProperty } from "@nestjs/swagger";

import { UserEntity } from "../entities/user.entity";

export class UserResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

  static fromEntity(entity: UserEntity): UserResponseDto {
    const dto = new UserResponseDto();
    dto.id = entity.id;
    dto.email = entity.email;
    dto.name = `${entity.firstName} ${entity.lastName}`;
    return dto;
  }
}
