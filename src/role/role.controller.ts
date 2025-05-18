import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { LoggingInterceptor } from '../loggin.interceptor';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseInterceptors(LoggingInterceptor)
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @UseGuards(JwtAuthGuard)
  @Get('subroles')
  async getSubRoles(@Req() req: Request) {
    const roleId = (req as any).user.role_id;

    try {
      const subRoles = await this.roleService.getSubRoles(roleId);
      return { status: HttpStatus.OK, message: 'Successful', data: subRoles };
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

  @Get('all')
  async getRoles() {
    try {
      const allRoles = await this.roleService.getAllRoles();
      return { status: HttpStatus.OK, message: 'Successful', data: allRoles };
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
