import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Admin } from './schemas/admin.schema';

@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(Admin) private readonly adminRepository: Repository<Admin>,
  ) {}

  async createAdmin(email: string, password: string): Promise<Admin> {
    const exists = await this.adminRepository.findOne({ where: { email } });
    if (exists)
      throw new BadRequestException('Admin already exists with this email');
    const passwordHash = await bcrypt.hash(password, 10);
    return this.adminRepository.save({ email, passwordHash, isAdmin: true });
  }

  async validateAdmin(email: string, password: string): Promise<Admin> {
    const admin = await this.adminRepository.findOne({
      where: { email, isAdmin: true },
    });
    if (!admin) throw new UnauthorizedException('Invalid credentials');
    const ok = await bcrypt.compare(password, admin.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    return admin;
  }

  async findById(id: string) {
    return this.adminRepository.findOne({ where: { id } });
  }
}
