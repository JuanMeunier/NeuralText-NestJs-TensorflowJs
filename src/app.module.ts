import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { TextAnalysisModule } from './text-analysis/text-analysis.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // ConfigService disponible globalmente
      envFilePath: '.env', // opcional si usás otro archivo
    }),
    DatabaseModule,
    UsersModule,
    TextAnalysisModule,
    AuthModule

  ],

})
export class AppModule { }
