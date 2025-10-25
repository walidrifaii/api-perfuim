import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AdminsService } from 'src/admin/admin.service';
import { RegisterAdminDto } from 'src/admin/dto/register-admin.dto';
import { LoginDto } from 'src/admin/dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private admins: AdminsService, private auth: AuthService) {}

  @ApiOperation({ summary: 'Register admin' })
  @Post('register-admin')
  async registerAdmin(@Body() dto: RegisterAdminDto) {
    const admin = await this.admins.createAdmin(dto.email, dto.password);
    return {
      id: String(admin._id),
      email: admin.email,
      isAdmin: admin.isAdmin,
    };
  }

  @ApiOperation({ summary: 'Login (JWT)' })
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.auth.login(dto.email, dto.password);
  }
}
