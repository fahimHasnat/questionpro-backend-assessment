import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../../role/entities/role.entity';
import { Employee } from '../../employee/entities/employee.entity';
import { EmployeeRole } from '../../employee/entities/employee-role.entity';

@Injectable()
export class Seeder {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(EmployeeRole)
    private readonly employeeRoleRepository: Repository<EmployeeRole>,
  ) {}

  //   async onModuleInit() {
  //     await this.run();
  //   }

  async run() {
    const employeeCount = await this.employeeRepository.count();
    if (employeeCount > 0) {
      Logger.log('Seeder: Data already exists, skipping.');
      return;
    }

    const rolesData = [
      {
        id: 'f7361c70-cb16-4ded-935a-be55ba1e31ed',
        name: 'CTO',
      },
      {
        id: '6c781257-07d2-4dce-afdf-af2614388b4a',
        name: 'Project Manager',
        parentId: 'f7361c70-cb16-4ded-935a-be55ba1e31ed',
      },
      {
        id: '163ecc86-c1c2-40bc-b70b-b9b37054575e',
        name: 'Senior Software Engineer',
        parentId: '6c781257-07d2-4dce-afdf-af2614388b4a',
      },
      {
        id: '330788c6-f4eb-442b-9d13-4a0c57583d39',
        name: 'Software Engineer',
        parentId: '163ecc86-c1c2-40bc-b70b-b9b37054575e',
      },
      {
        id: '7ac804c8-9303-4f74-aa19-57ec79bd5dba',
        name: 'Junior Software Engineer',
        parentId: '330788c6-f4eb-442b-9d13-4a0c57583d39',
      },
      {
        id: '8b84587f-fa80-4e70-b5ca-3fd05996d278',
        name: 'Software Engineer (Intern)',
        parentId: '7ac804c8-9303-4f74-aa19-57ec79bd5dba',
      },
    ];

    const employeesData = [
      {
        email: 'dummy@email.com',
        joined_at: '2024-01-01 00:00:00',
        id: 'b7fd249d-28a2-4830-8a1f-acce065d4d2c',
        name: 'CTO',
      },
      {
        email: 'Employee_1@gmail.com',
        joined_at: '2024-04-24 00:00:00',
        id: '2a7e160d-0c45-4609-ad5f-b9afb1d5cfaa',
        name: 'Employee_1',
      },
      {
        email: 'Employee_2@gmail.com',
        joined_at: '2025-05-19 00:00:00',
        id: 'fbc6a9d1-746d-4c1e-b724-fa3f7b553ed0',
        name: 'Employee_2',
      },
      {
        email: 'Employee_3@gmail.com',
        joined_at: '2022-11-22 00:00:00',
        id: '517d1e84-5a4b-46fc-89f7-ad7dbee4c32b',
        name: 'Employee_3',
      },
      {
        email: 'Employee_4@gmail.com',
        joined_at: '2021-06-17 00:00:00',
        id: '021c4a07-48a2-4924-b6fa-cf8c8e0cf3bf',
        name: 'Employee_4',
      },
      {
        email: 'Employee_5@gmail.com',
        joined_at: '2022-12-10 00:00:00',
        id: '4111d700-6ef5-4d8b-881b-c33fcbffc1f8',
        name: 'Employee_5',
      },
      {
        email: 'Employee_6@gmail.com',
        joined_at: '2021-04-10 00:00:00',
        id: 'df0762b5-6585-4c43-82f5-bf67e0a1cb93',
        name: 'Employee_6',
      },
      {
        email: 'Employee_7@gmail.com',
        joined_at: '2024-12-27 00:00:00',
        id: 'b376342b-a81a-47dd-9136-61a9ad0d746f',
        name: 'Employee_7',
      },
      {
        email: 'Employee_8@gmail.com',
        joined_at: '2021-05-23 00:00:00',
        id: '23f11920-2d44-42c4-9bdc-83b9a8917fcf',
        name: 'Employee_8',
      },
      {
        email: 'Employee_9@gmail.com',
        joined_at: '2023-04-26 00:00:00',
        id: '2e96a8a7-3f1e-4676-908e-7dcb20836fca',
        name: 'Employee_9',
      },
      {
        email: 'Employee_10@gmail.com',
        joined_at: '2025-04-02 00:00:00',
        id: 'acd4c049-8da5-46f4-bfa2-79c864d6c4e4',
        name: 'Employee_10',
      },
      {
        email: 'Employee_11@gmail.com',
        joined_at: '2021-01-19 00:00:00',
        id: '9ad3c28c-a3d8-48e7-b569-b222818740d6',
        name: 'Employee_11',
      },
      {
        email: 'Employee_12@gmail.com',
        joined_at: '2021-08-13 00:00:00',
        id: '7a6d8aed-5e78-4c97-a587-6038d7d41dcf',
        name: 'Employee_12',
      },
      {
        email: 'Employee_13@gmail.com',
        joined_at: '2021-02-28 00:00:00',
        id: 'ae30168e-4729-4bf5-bdba-4f657e530f7e',
        name: 'Employee_13',
      },
      {
        email: 'Employee_14@gmail.com',
        joined_at: '2020-03-02 00:00:00',
        id: 'e1eaf4d6-d91b-41e9-be40-98dea6c76eff',
        name: 'Employee_14',
      },
      {
        email: 'Employee_15@gmail.com',
        joined_at: '2020-08-03 00:00:00',
        id: '785310f4-db1a-4731-a7e7-c8c06d0249cc',
        name: 'Employee_15',
      },
    ];

    const employeeRolesData = [
      {
        from_date: '2025-05-17',
        employeeId: 'b7fd249d-28a2-4830-8a1f-acce065d4d2c',
        roleId: 'f7361c70-cb16-4ded-935a-be55ba1e31ed',
      },
      {
        from_date: '2025-05-17',
        employeeId: '2a7e160d-0c45-4609-ad5f-b9afb1d5cfaa',
        roleId: '8b84587f-fa80-4e70-b5ca-3fd05996d278',
      },
      {
        from_date: '2025-05-17',
        employeeId: 'fbc6a9d1-746d-4c1e-b724-fa3f7b553ed0',
        roleId: '6c781257-07d2-4dce-afdf-af2614388b4a',
      },
      {
        from_date: '2025-05-17',
        employeeId: '517d1e84-5a4b-46fc-89f7-ad7dbee4c32b',
        roleId: '7ac804c8-9303-4f74-aa19-57ec79bd5dba',
      },
      {
        from_date: '2025-05-17',
        employeeId: '021c4a07-48a2-4924-b6fa-cf8c8e0cf3bf',
        roleId: '8b84587f-fa80-4e70-b5ca-3fd05996d278',
      },
      {
        from_date: '2025-05-17',
        employeeId: 'df0762b5-6585-4c43-82f5-bf67e0a1cb93',
        roleId: '330788c6-f4eb-442b-9d13-4a0c57583d39',
      },
      {
        from_date: '2025-05-17',
        employeeId: 'b376342b-a81a-47dd-9136-61a9ad0d746f',
        roleId: '6c781257-07d2-4dce-afdf-af2614388b4a',
      },
      {
        from_date: '2025-05-17',
        employeeId: '23f11920-2d44-42c4-9bdc-83b9a8917fcf',
        roleId: '330788c6-f4eb-442b-9d13-4a0c57583d39',
      },
      {
        from_date: '2025-05-17',
        employeeId: 'acd4c049-8da5-46f4-bfa2-79c864d6c4e4',
        roleId: '7ac804c8-9303-4f74-aa19-57ec79bd5dba',
      },
      {
        from_date: '2025-05-17',
        employeeId: '9ad3c28c-a3d8-48e7-b569-b222818740d6',
        roleId: '330788c6-f4eb-442b-9d13-4a0c57583d39',
      },
      {
        from_date: '2025-05-17',
        employeeId: '7a6d8aed-5e78-4c97-a587-6038d7d41dcf',
        roleId: '330788c6-f4eb-442b-9d13-4a0c57583d39',
      },
      {
        from_date: '2025-05-17',
        employeeId: 'ae30168e-4729-4bf5-bdba-4f657e530f7e',
        roleId: '6c781257-07d2-4dce-afdf-af2614388b4a',
      },
      {
        from_date: '2025-05-17',
        employeeId: 'e1eaf4d6-d91b-41e9-be40-98dea6c76eff',
        roleId: '7ac804c8-9303-4f74-aa19-57ec79bd5dba',
      },
      {
        from_date: '2025-05-17',
        employeeId: '785310f4-db1a-4731-a7e7-c8c06d0249cc',
        roleId: '8b84587f-fa80-4e70-b5ca-3fd05996d278',
      },
      {
        from_date: '2025-05-17',
        employeeId: '4111d700-6ef5-4d8b-881b-c33fcbffc1f8',
        roleId: '163ecc86-c1c2-40bc-b70b-b9b37054575e',
      },
      {
        from_date: '2025-05-17',
        employeeId: '2e96a8a7-3f1e-4676-908e-7dcb20836fca',
        roleId: '163ecc86-c1c2-40bc-b70b-b9b37054575e',
      },
    ];

    const roles = await this.roleRepository.save(rolesData);
    const employees = await this.employeeRepository.save(employeesData);
    const employeeRoles =
      await this.employeeRoleRepository.save(employeeRolesData);

    Logger.log('Seeding complete!');
  }
}
