import { ObjectLiteral, Repository } from 'typeorm';

export abstract class IGenericRepository<
  T extends ObjectLiteral,
> extends Repository<T> {}
