import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateProfileDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  // Para el sistema de auth (Google OAuth)
  async findOrCreate(userData: CreateUserDto): Promise<User> {
    let user = await this.userRepository.findOne({
      where: { googleId: userData.googleId }
    });

    if (!user) {
      user = this.userRepository.create(userData);
      await this.userRepository.save(user);
    } else {
      // Actualizar datos de Google por si cambiaron
      user.name = userData.name;
      user.picture = userData.picture;
      await this.userRepository.save(user);
    }

    return user;
  }

  // Para el JWT Guard
  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  // Para que el usuario vea su perfil
  async getProfile(userId: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'email', 'name', 'picture', 'createdAt'] // Sin googleId
    });
  }

  // Para actualizar perfil
  async updateProfile(userId: string, updateData: UpdateProfileDto): Promise<User | null> {
    await this.userRepository.update(userId, updateData);
    return this.getProfile(userId);
  }

  // Para eliminar cuenta (GDPR)
  async deleteAccount(userId: string): Promise<User> {
    const result = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'email', 'name', 'picture', 'createdAt'] // Sin googleId
    });
    if (!result) {
      throw new Error('User not found');
    }
    await this.userRepository.delete(userId);
    return result;

  }
}
