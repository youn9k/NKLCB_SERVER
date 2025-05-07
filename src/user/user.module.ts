import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SocialLoginEntity } from './entity/social-login.entity';
import { UserEntity } from './entity/user.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            SocialLoginEntity,
            UserEntity,
        ])
    ],
    controllers: [],
    providers: []
})
export class UserModule {}