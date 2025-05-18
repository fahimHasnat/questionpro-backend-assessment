import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { LoggingInterceptor } from '../loggin.interceptor';

@UseInterceptors(LoggingInterceptor)
@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Get(':id')
  async getEmployees(@Param('id') roleId: string) {
    try {
      const message = await this.employeeService.employees(roleId);
      return { status: HttpStatus.OK, message: 'Successful', data: message };
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed To Get Result!',
          error: err.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
