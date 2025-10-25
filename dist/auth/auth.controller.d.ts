import { AuthService } from './auth.service';
import { AdminsService } from 'src/admin/admin.service';
import { RegisterAdminDto } from 'src/admin/dto/register-admin.dto';
import { LoginDto } from 'src/admin/dto/login.dto';
export declare class AuthController {
    private admins;
    private auth;
    constructor(admins: AdminsService, auth: AuthService);
    registerAdmin(dto: RegisterAdminDto): Promise<{
        id: string;
        email: string;
        isAdmin: boolean;
    }>;
    login(dto: LoginDto): Promise<{
        access_token: string;
    }>;
}
