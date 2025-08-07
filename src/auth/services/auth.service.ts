import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/services/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async validateGoogleUser(userData: CreateUserDto) {
        // AQUÍ llamamos al findOrCreate del UsersService
        const user = await this.usersService.findOrCreate(userData);

        // Generar JWT token
        const payload = { sub: user.id, email: user.email };
        const accessToken = this.jwtService.sign(payload);

        return {
            user,
            accessToken,
        };
    }

    async generateJwt(user: any) {
        const payload = { sub: user.id, email: user.email };
        return this.jwtService.sign(payload);
    }
}
