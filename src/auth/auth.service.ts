import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminsService } from 'src/admin/admin.service';

@Injectable()
export class AuthService {
  constructor(private jwt: JwtService, private admins: AdminsService) {}

  async login(email: string, password: string) {
    const admin = await this.admins.validateAdmin(email, password);
    const payload = {
      sub: String(admin._id),
      email: admin.email,
      isAdmin: true,
    };
    const access_token = await this.jwt.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });
    return { access_token };
  }
}
