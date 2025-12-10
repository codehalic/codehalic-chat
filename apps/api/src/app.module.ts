import { Module } from "@nestjs/common";
import { SocketModule } from "./modules/socket/socket.module";
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    SocketModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
export class AppModule { }
