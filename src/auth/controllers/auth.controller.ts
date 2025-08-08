// src/auth/controllers/auth.controller.ts
import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {

    @Get('google')
    @ApiOperation({ summary: 'Iniciar login con Google' })
    @UseGuards(AuthGuard('google'))
    async googleAuth() {
        // Guard redirige automáticamente a Google
    }

    @Get('google/callback')
    @ApiOperation({ summary: 'Callback de Google OAuth' })
    @ApiResponse({
        status: 200,
        description: 'Login exitoso - devuelve token JWT',
        example: {
            message: "Login successful",
            user: {
                id: "uuid-123",
                email: "usuario@gmail.com",
                name: "Juan Pérez"
            },
            accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
        }
    })
    @UseGuards(AuthGuard('google'))
    async googleCallback(@Req() req, @Res() res: Response) {
        const { user, accessToken } = req.user;

        // ✅ En lugar de redirigir, devolver JSON con el token
        return res.json({
            message: 'Login successful',
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                picture: user.picture
            },
            accessToken,
            instructions: 'Copy the accessToken and use it as: Bearer <token> in Swagger Authorization'
        });
    }

    @Get('logout')
    @ApiOperation({ summary: 'Cerrar sesión' })
    async logout(@Res() res: Response) {
        res.json({ message: 'Logged out successfully' });
    }
}