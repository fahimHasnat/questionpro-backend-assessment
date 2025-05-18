import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { RoleSubtreeDto } from './dto/role-subtree.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
  ) {}

  async getSubRoles(roleId: string): Promise<RoleSubtreeDto[]> {
    const result = await this.roleRepo.query(
      `
    WITH RECURSIVE role_hierarchy AS (
        SELECT id, name, "parentId" FROM roles WHERE id = $1
        UNION ALL
        SELECT r.id, r.name, r."parentId"
        FROM roles r
        INNER JOIN role_hierarchy rh ON rh.id = r."parentId"
    )
    SELECT * FROM role_hierarchy
    WHERE id != $1
  `,
      [roleId],
    );

    if (!roleId) {
      throw new Error('Role not found');
    }
    return result;
  }

  async getAllRoles(): Promise<any[]> {
    const roles = await this.roleRepo.find({
      select: ['id', 'name'],
    });

    return roles;
  }
}
