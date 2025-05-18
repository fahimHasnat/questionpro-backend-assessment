import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('EmployeeController', () => {
  let controller: EmployeeController;
  let employeeService: EmployeeService;

  const mockEmployeeService = {
    employees: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeeController],
      providers: [
        {
          provide: EmployeeService,
          useValue: mockEmployeeService,
        },
      ],
    }).compile();

    controller = module.get<EmployeeController>(EmployeeController);
    employeeService = module.get<EmployeeService>(EmployeeService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return employees successfully', async () => {
    const mockResult = [{ id: 1, name: 'John Doe' }];
    mockEmployeeService.employees.mockResolvedValue(mockResult);

    const response = await controller.getEmployees('1');

    expect(response).toEqual({
      status: HttpStatus.OK,
      message: 'Successful',
      data: mockResult,
    });

    expect(mockEmployeeService.employees).toHaveBeenCalledWith('1');
  });

  it('should throw internal server error on generic error', async () => {
    mockEmployeeService.employees.mockRejectedValue(
      new Error('Something failed'),
    );

    await expect(controller.getEmployees('1')).rejects.toThrow(HttpException);

    await expect(controller.getEmployees('1')).rejects.toMatchObject({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      response: {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed To Get Result!',
        error: 'Something failed',
      },
    });
  });

  it('should re-throw HttpException if thrown by service', async () => {
    const httpError = new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    mockEmployeeService.employees.mockRejectedValue(httpError);

    await expect(controller.getEmployees('1')).rejects.toThrow(HttpException);
    await expect(controller.getEmployees('1')).rejects.toBe(httpError);
  });
});
