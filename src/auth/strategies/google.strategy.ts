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
        const clientID = configService.get<string>('GOOGLE_CLIENT_ID');
        const clientSecret = configService.get<string>('GOOGLE_CLIENT_SECRET');

        // Validar que las variables de entorno existen
        if (!clientID) {
            throw new Error('GOOGLE_CLIENT_ID is not defined in environment variables');
        }

        if (!clientSecret) {
            throw new Error('GOOGLE_CLIENT_SECRET is not defined in environment variables');
        }

        super({
            clientID,
            clientSecret,
            callbackURL: 'http://localhost:3000/auth/google/callback',
            scope: ['email', 'profile'],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback,
    ): Promise<any> {
        try {
            const userData = {
                email: profile.emails[0].value,
                name: profile.displayName,
                picture: profile.photos[0].value,
                googleId: profile.id,
            };

            const result = await this.authService.validateGoogleUser(userData);
            done(null, result);
        } catch (error) {
            done(error);
        }
    }
}