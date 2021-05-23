import { Module, HttpModule } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule],
  controllers: [StudentsController],
  providers: [StudentsService],
})
export class StudentsModule {}
