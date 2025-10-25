import { Global, Module } from '@nestjs/common';
import { PostgresDataServiceModule } from './postgres-dataservice.module';

@Global()
@Module({
  imports: [PostgresDataServiceModule],
  exports: [PostgresDataServiceModule],
})
export class DataServiceModule {}
