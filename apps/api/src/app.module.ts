import { Module } from "@nestjs/common";
import { SocketModule } from "./modules/socket/socket.module";
import { ConfigModule } from '@nestjs/config';
import { MongoModule } from './modules/database/mongo.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    SocketModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongoModule,
    AuthModule,
  ],
})
export class AppModule { }
