import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('auth')
@Controller('auth')
export class AuthController {

    // PASO 1: Usuario hace clic aquí para iniciar Google OAuth
    @Get('google')
    @ApiOperation({ summary: 'Iniciar login con Google' })
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req) {
        // Este endpoint redirige automáticamente a Google
        // El usuario ve la pantalla de login de Google
    }

    // PASO 2: Google redirige aquí después del login exitoso
    @Get('google/callback')
    @ApiOperation({ summary: 'Callback de Google OAuth' })
    @UseGuards(AuthGuard('google'))
    async googleCallback(@Req() req, @Res() res: Response) {
        // Aquí ya tenemos el usuario autenticado
        const { user, accessToken } = req.user;

        // Redirigir al frontend con el token
        res.redirect(`http://localhost:3000/dashboard?token=${accessToken}`);

        // O devolver JSON si es una SPA
        // return { user, accessToken };
    }

    @Get('logout')
    @ApiOperation({ summary: 'Cerrar sesión' })
    async logout(@Res() res: Response) {
        // Simplemente eliminar el token del cliente
        res.json({ message: 'Logged out successfully' });
    }
}