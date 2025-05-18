import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Employee } from './employee.entity';
import { Role } from '../../role/entities/role.entity';

@Entity('employee_roles')
export class EmployeeRole {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  employeeId: string;

  @ManyToOne(() => Employee, (employee) => employee.roles)
  @JoinColumn({ name: 'employeeId' })
  employee: Employee;

  @Column()
  roleId: string;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @Column({ type: 'date' })
  from_date: Date;

  @Column({ type: 'date', nullable: true })
  to_date: Date;

  @Column({ default: true })
  is_current: boolean;

  @Column({ default: false })
  is_deleted: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
