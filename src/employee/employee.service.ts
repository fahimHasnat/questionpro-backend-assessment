import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './entities/employee.entity';
import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { OrgTreeDto } from './dto/org-tree.dto';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepo: Repository<Employee>,

    private readonly jwtService: JwtService,

    private readonly httpService: HttpService,
  ) {}

  async employees(roleId): Promise<OrgTreeDto[]> {
    let subRoles = [];
    let roles = [];
    try {
      const payload = {
        role_id: roleId,
      };

      const token = this.jwtService.sign(payload);

      const response = await firstValueFrom(
        this.httpService.get('http://localhost:8001/role/subroles', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      );

      roles = response.data.data;
      subRoles = subRoles.concat(response.data.data.map((role) => role.id));
    } catch (error) {
      console.error('Error calling external API:', error);
      throw error;
    }

    const employeeList = await this.employeeRepo
      .createQueryBuilder('e')
      .innerJoin(
        'e.roles',
        'er',
        'er.is_current = :isCurrent AND er.is_deleted = :isDeleted',
        {
          isCurrent: true,
          isDeleted: false,
        },
      )
      .where('er.roleId IN (:...roleIds)', { roleIds: subRoles })
      .select(['e.id', 'e.name', 'e.joined_at', 'er.roleId'])
      .getRawMany();

    const tree = this.buildOrgTree(roles, employeeList, roleId);

    return tree;
  }

  buildOrgTree(roles, employees, rootRoleId = null) {
    const roleMap = new Map();
    roles.forEach((role) => {
      roleMap.set(role.id, { ...role, employees: [], children: [] });
    });

    employees.forEach((emp) => {
      const roleNode = roleMap.get(emp.er_roleId);
      if (roleNode) {
        roleNode.employees.push({
          id: emp.e_id,
          name: emp.e_name,
          joined_at: emp.e_joined_at,
        });
      }
    });

    const tree: OrgTreeDto[] = [];
    roleMap.forEach((role) => {
      if (role.parentId && roleMap.has(role.parentId)) {
        roleMap.get(role.parentId).children.push(role);
      } else if (role.parentId === rootRoleId || role.parentId === null) {
        tree.push(role);
      }
    });

    return tree;
  }
}
