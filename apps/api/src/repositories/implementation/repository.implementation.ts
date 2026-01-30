import {
  EntityManager,
  EntityTarget,
  ObjectLiteral,
  QueryRunner,
} from "typeorm";

import { IGenericRepository } from "../interfaces/repository.interface";

export class GenericRepository<
  T extends ObjectLiteral,
> extends IGenericRepository<T> {
  constructor(
    target: EntityTarget<T>,
    manager: EntityManager,
    queryRunner: QueryRunner,
  ) {
    super(target, manager, queryRunner);
  }
}
