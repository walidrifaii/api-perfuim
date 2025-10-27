import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { Admin, AdminDocument } from './schemas/admin.schema';

@Injectable()
export class AdminsService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
  ) {}

  async createAdmin(email: string, password: string): Promise<AdminDocument> {
    const exists = await this.adminModel.findOne({ email });
    if (exists)
      throw new BadRequestException('Admin already exists with this email');
    const passwordHash = await bcrypt.hash(password, 10);
    return this.adminModel.create({ email, passwordHash, isAdmin: true });
  }

  async validateAdmin(email: string, password: string): Promise<AdminDocument> {
    const admin = await this.adminModel.findOne({ email, isAdmin: true });
    if (!admin) throw new UnauthorizedException('Invalid credentials');
    const ok = await bcrypt.compare(password, admin.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    return admin;
  }

  async findById(id: string) {
    return this.adminModel.findById(id);
  }
}
