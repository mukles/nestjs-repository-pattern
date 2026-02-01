import { ApiProperty } from "@nestjs/swagger";
import { Role, User } from "@repo/shared-types";

export class UserResponseDto implements User {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  avatar: string;

  @ApiProperty()
  roles: Role[];
}
