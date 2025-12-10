import { Injectable } from "@nestjs/common";
import { greet } from "@repo/utils";

@Injectable()
export class AppService {
  getRoot() {
    return { message: greet("NestJS") };
  }
}
