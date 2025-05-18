import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeService } from './employee.service';
import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { of } from 'rxjs';
import { Repository } from 'typeorm';

const mockEmployeeRepo = () => ({
  createQueryBuilder: jest.fn(() => ({
    innerJoin: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    getRawMany: jest.fn().mockResolvedValue([
      {
        e_id: 1,
        e_name: 'John Doe',
        e_joined_at: '2022-01-01',
        er_roleId: 100,
      },
    ]),
  })),
});

describe('EmployeeService', () => {
  let service: EmployeeService;
  let jwtService: JwtService;
  let httpService: HttpService;
  let employeeRepo: Repository<Employee>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeeService,
        {
          provide: getRepositoryToken(Employee),
          useFactory: mockEmployeeRepo,
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mockToken'),
          },
        },
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(() =>
              of({
                data: {
                  data: [{ id: 100, name: 'Manager', parentId: null }],
                },
              }),
            ),
          },
        },
      ],
    }).compile();

    service = module.get<EmployeeService>(EmployeeService);
    jwtService = module.get<JwtService>(JwtService);
    httpService = module.get<HttpService>(HttpService);
    employeeRepo = module.get<Repository<Employee>>(
      getRepositoryToken(Employee),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a tree of employees grouped by roles', async () => {
    const result = await service.employees(1);
    expect(result).toEqual([
      {
        id: 100,
        name: 'Manager',
        parentId: null,
        employees: [
          {
            id: 1,
            name: 'John Doe',
            joined_at: '2022-01-01',
          },
        ],
        children: [],
      },
    ]);
  });
});
