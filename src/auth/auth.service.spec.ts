import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './schema/user.schema';

describe('AuthService', () => {
  let service: AuthService;
  const mockModelUser = {
    find : jest.fn().mockResolvedValue([])
  }
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService,
        {
          provide : getModelToken(User.name),
          useValue : mockModelUser
        }
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', async () => {
    const result = await service.checkEmail("Boi")
    console.log(result)
    expect(result).toBeDefined();
  });
});
