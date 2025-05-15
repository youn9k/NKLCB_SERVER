import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SocialLoginEntity } from './entity/social-login.entity';
import { UserEntity } from './entity/user.entity';
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UserTokenEntity } from "./entity/user-token.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            SocialLoginEntity,
            UserEntity,
            UserTokenEntity
        ])
    ],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}