import { JwtService } from '@nestjs/jwt';
import { AdminsService } from 'src/admin/admin.service';
export declare class AuthService {
    private jwt;
    private admins;
    constructor(jwt: JwtService, admins: AdminsService);
    login(email: string, password: string): Promise<{
        access_token: string;
    }>;
}
