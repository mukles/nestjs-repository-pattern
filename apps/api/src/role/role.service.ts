import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Role } from './entities/role.entity';
import { Role as RoleEnum } from './enums/role.enum';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async findById(id: number): Promise<Role | null> {
    return this.roleRepository.findOne({ where: { id } });
  }

  async findByName(name: RoleEnum): Promise<Role | null> {
    return this.roleRepository.findOne({ where: { name } });
  }

  async findAll(): Promise<Role[]> {
    return this.roleRepository.find();
  }
}
