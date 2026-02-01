import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { RoleEntity } from "./entities/role.entity";
import { Role as RoleEnum } from "./enums/role.enum";

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
