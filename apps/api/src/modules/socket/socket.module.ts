import { Module } from "@nestjs/common";
import { SocketGateway } from "./socket.gateway";
import { SocketService } from "./socket.service";
import { AuthModule } from "../auth/auth.module";
import { MessagesModule } from "../messages/messages.module";

@Module({
  imports: [AuthModule, MessagesModule],
  providers: [SocketGateway, SocketService],
  exports: [SocketGateway],
})
export class SocketModule {}
