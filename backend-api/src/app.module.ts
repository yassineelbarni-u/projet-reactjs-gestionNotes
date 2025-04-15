import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './user/user.entity';
import { Note } from './notes/note.entity';
import { NotesModule } from './notes/notes.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DATABASE_HOST') ?? 'localhost',
        port: +(config.get<string>('DATABASE_PORT') ?? 3306),
        username: config.get<string>('DATABASE_USER') ?? 'root',
        password: config.get<string>('DATABASE_PASSWORD') ?? '',
        database: config.get<string>('DATABASE_NAME') ?? 'note_db',
        entities: [User, Note],
        synchronize: true,
        logging: true,
      }),
    }),

    NotesModule,
    AuthModule,
  ],
})
export class AppModule {}
