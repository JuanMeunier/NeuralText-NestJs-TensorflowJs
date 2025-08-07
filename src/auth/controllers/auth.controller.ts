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
        status: 302,
        description: 'Redirige al frontend con token'
    })
    @UseGuards(AuthGuard('google'))
    async googleCallback(@Req() req, @Res() res: Response) {
        const { user, accessToken } = req.user;

        const frontendUrl = `http://localhost:4200/auth/success?token=${accessToken}`;
        return res.redirect(frontendUrl);
    }

    @Get('logout')
    @ApiOperation({ summary: 'Cerrar sesión' })
    async logout(@Res() res: Response) {
        res.json({ message: 'Logged out successfully' });
    }
}