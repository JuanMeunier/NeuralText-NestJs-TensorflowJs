import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../services/auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(
        private configService: ConfigService,
        private authService: AuthService,
    ) {
        super({
            clientID: configService.get<string>('auth.googleClientId'),
            clientSecret: configService.get<string>('auth.googleClientSecret'),
            callbackURL: '/auth/google/callback',
            scope: ['email', 'profile'],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback,
    ): Promise<any> {
        // AQUÍ ES DONDE SE CONECTA CON GOOGLE
        // Google ya autenticó al usuario y nos da su perfil

        const userData = {
            email: profile.emails[0].value,
            name: profile.displayName,
            picture: profile.photos[0].value,
            googleId: profile.id,
        };

        // Aquí usamos findOrCreate para registrar/login
        const user = await this.authService.validateGoogleUser(userData);

        done(null, user);
    }
}