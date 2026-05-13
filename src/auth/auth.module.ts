import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { AuthService } from './auth.service';
import { ResendProvider } from 'src/common/resend.provider';


@Module({
  imports : [HttpModule,
        MongooseModule.forFeature([
          {name : User.name, schema :UserSchema},
        ]),
      ],
  controllers: [AuthController],
  providers : [AuthService,ResendProvider]
})
export class AuthModule {}
