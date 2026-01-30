import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { RoleEntity } from "../role/entities/role.entity";
import { UserEntity } from "./entities/user.entity";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findById(id: number): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async create(
    userData: Partial<UserEntity>,
    role: RoleEntity,
  ): Promise<UserEntity> {
    const user = this.userRepository.create({ ...userData, role });
    return this.userRepository.save(user);
  }
}
