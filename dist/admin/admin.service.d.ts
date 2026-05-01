import { Repository } from 'typeorm';
import { Admin } from './schemas/admin.schema';
export declare class AdminsService {
    private readonly adminRepository;
    constructor(adminRepository: Repository<Admin>);
    createAdmin(email: string, password: string): Promise<Admin>;
    validateAdmin(email: string, password: string): Promise<Admin>;
    findById(id: string): Promise<Admin>;
}
