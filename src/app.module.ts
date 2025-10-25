import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DataServiceModule } from './repositories/dataservice.module';

@Module({
  imports: [DataServiceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
