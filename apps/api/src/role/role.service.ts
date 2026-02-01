import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Role as RoleEnum } from "@repo/shared-types";
import { Repository } from "typeorm";

import { RoleEntity } from "./entities/role.entity";

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
  ) {}

  async findById(id: number): Promise<RoleEntity | null> {
    return this.roleRepository.findOne({ where: { id } });
  }

  async findByName(name: RoleEnum): Promise<RoleEntity | null> {
    return this.roleRepository.findOne({ where: { name } });
  }

  async findAll(): Promise<RoleEntity[]> {
    return this.roleRepository.find();
  }
}
