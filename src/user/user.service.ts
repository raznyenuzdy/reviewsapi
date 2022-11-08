import { InjectModel } from '@nestjs/sequelize';
import { UserDto, GetUserDto, TestUserDto } from './dto/user.dto';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { User } from './user.model';
import { IUserCreationAttributes } from 'src/all.interface';

@Injectable()
export class UserService {

    private GUEST = 'guest';

    constructor(@InjectModel(User) private userRepository: typeof User,
        private configService: ConfigService,
    ) {

    }

    async getMemberByUserId(getMemberDto: GetUserDto): Promise<User> {
        try {
            const obj = await this.userRepository.findOne({ where: { user_id: getMemberDto.user_id } });
            return obj ? obj.get({ plain: true }) : null;
        } catch (error) {
            throw error;
        }
    }

    async getUserById(id: number | string): Promise<User> {
        try {
            if (!id) return null;
            const obj = await this.userRepository.findOne({ where: { id } });
            return obj ? obj.get({ plain: true }) : null;
        } catch (error) {
            throw error;
        }
    }

    async testMember(testMemberDto: TestUserDto): Promise<User> {
        try {
            const obj = await this.userRepository.findOne({ where: { user_id: testMemberDto.user_id } }); //, last_ip: testMemberDto.ip //на дев период //, md5: testMemberDto.md5
            return obj ? obj.get({ plain: true }) : null;
        } catch (error) {
            throw error;
        }
    }

    checkActualityAuth(Member: IUserCreationAttributes): boolean {
        if (!(Member?.email_verified)) return false;
        return (new Date().getTime() - new Date(Member.last_login).getTime()) < 1000 * 60 * 60 * 24 * 7;
    }

    async createGuest(dto: UserDto): Promise<User> {
        try {
            dto.role = this.GUEST;
            const obj = await this.userRepository.create(dto);
            return obj ? obj.get({ plain: true }) : null;
        } catch (error) {
            throw error;
        }
    }

    async updateUser(dto: IUserCreationAttributes) {
        const data = new UserDto(dto);
        const aaa = await this.userRepository.update({...data}, {where: {id: dto.id}});
    }

    private async createUser() {

    }

    async createOrg() {

    }

    async createModerator() {

    }

    async createAdmin() {

    }

    private async checkMemberExistsByEmail(dto: UserDto) {
        try {
            const obj = await this.userRepository.findOne({ where: { email: dto.email } });
            return obj ? obj.get({ plain: true }) : null;
        } catch (error) {
            throw error;
        }
    }

    private async checkGuestExists(dto: UserDto) {
        try {
            const obj = await this.userRepository.findOne({ where: { email: dto.email, role: 'guest' } });
            return obj ? obj.get({ plain: true }) : null;
        } catch (error) {
            throw error;
        }
    }

}
