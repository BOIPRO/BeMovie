import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./schema/user.schema";
import { UserRepository } from "./repository/user.repository";
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [ MongooseModule.forFeature([
        {name : User.name, schema :UserSchema},
      ]),JwtModule],
  controllers: [UserController], 
  providers: [UserService,UserRepository],
  exports: [UserService,UserRepository]
})
export class UserModule {}