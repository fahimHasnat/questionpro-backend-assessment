import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { EmployeeModule } from './employee/employee.module';
import { RoleModule } from './role/role.module';
import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    DatabaseModule,
    EmployeeModule,
    RoleModule,
    AuthModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
