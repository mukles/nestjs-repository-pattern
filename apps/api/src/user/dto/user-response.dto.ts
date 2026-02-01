import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../role/enums/role.enum';
export class UserResponseDto {
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
