import { Controller, Get, Patch, Delete, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from '../services/users.service';
import { UpdateProfileDto } from '../dto/update-user.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard) // ← APLICAR EL GUARD
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get('profile')
  @ApiOperation({
    summary: 'Obtener mi perfil',
    description: 'Obtiene la información del usuario autenticado'
  })
  @ApiResponse({
    status: 200,
    description: 'Perfil obtenido exitosamente',
    example: {
      id: 'uuid-123',
      email: 'usuario@gmail.com',
      name: 'Juan Pérez',
      picture: 'https://lh3.googleusercontent.com/...',
      createdAt: '2024-01-15T10:30:00.000Z'
    }
  })
  async getProfile(@Request() req) {
    return this.usersService.getProfile(req.user.id);
  }

  @Patch('profile')
  @ApiOperation({
    summary: 'Actualizar mi perfil',
    description: 'Actualiza el nombre y/o foto del usuario autenticado'
  })
  @ApiResponse({ status: 200, description: 'Perfil actualizado' })
  async updateProfile(@Request() req, @Body() updateProfileDto: UpdateProfileDto) {
    return this.usersService.updateProfile(req.user.id, updateProfileDto);
  }

  @Delete('account')
  @ApiOperation({
    summary: 'Eliminar mi cuenta',
    description: 'Elimina permanentemente la cuenta del usuario (GDPR)'
  })
  @ApiResponse({ status: 200, description: 'Cuenta eliminada exitosamente' })
  async deleteAccount(@Request() req) {
    const deleted = await this.usersService.deleteAccount(req.user.id);
    return {
      success: !!deleted,
      message: deleted ? 'Account deleted successfully' : 'Account not found'
    };
  }
}

