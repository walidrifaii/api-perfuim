import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './schemas/admin.schema';
import { AdminsService } from './admin.service';

@Module({
  imports: [TypeOrmModule.forFeature([Admin])],
  providers: [AdminsService],
  exports: [AdminsService],
})
export class AdminsModule {}
