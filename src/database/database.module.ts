import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { Employee } from '../employee/entities/employee.entity';
import { Role } from '../role/entities/role.entity';
import { EmployeeRole } from '../employee/entities/employee-role.entity';
import { Seeder } from './seeders/seeder';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [Employee, Role, EmployeeRole],
        synchronize: false,
        logging: false,
      }),
      dataSourceFactory: async (options) => {
        const dataSource = new DataSource(options as DataSourceOptions);
        return dataSource.initialize().then((ds) => {
          console.log('Database successfully connected');
          return ds;
        });
      },
    }),
    TypeOrmModule.forFeature([Employee, EmployeeRole, Role]),
  ],
  providers: [Seeder],
  exports: [TypeOrmModule, Seeder],
})
export class DatabaseModule {}
