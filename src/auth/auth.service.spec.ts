import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { ConflictException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  const mockUser = { email: "Boi@gmail.com", username: "boidz", isVerify: false }
  const mockModelUser = {
    updateOne: jest.fn().mockResolvedValue("Da cap nhat thanh cong")
  }
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService,
        {
          provide: getModelToken(User.name),
          useValue: mockModelUser
        }
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });
  it("Ham updateUserToDB co tra ve otp ko ", async () => {
    const email = "Boi1234"
    const spy = jest.spyOn(service, 'createOTP' as any).mockReturnValue("12345")
    const result = await service['updateUserToDB'](email, 'user', "1234")
    console.log(result)
    expect(spy).toHaveBeenCalled()
    expect(result).toBe("12345")
  })
  it('chua ton tai email', async () => {
    const spy = jest.spyOn(service, 'getUserByEmail' as any).mockResolvedValue(null)
    const updateSpy = jest.spyOn(service, 'updateUserToDB' as any).mockResolvedValue('OTP thanh cong');
    const result = await service.validateEmailForRegistration("Boi@gmail.com", "boidz", "123456");
    expect(result).toBe('OTP thanh cong');
    expect(spy).toHaveBeenCalledWith("Boi@gmail.com");
    expect(updateSpy).toHaveBeenCalled();
  });
  it("Da ton tai email nhung verify la true", async () => {
    const spy = jest.spyOn(service, 'getUserByEmail' as any).mockResolvedValue({ email: "Boi@gmail.com", isVerify: true })
    await expect(service.validateEmailForRegistration("Boi@gmail.com", "boidz", "123456")).rejects.toThrow(ConflictException)
    expect(spy).toHaveBeenCalledWith("Boi@gmail.com")
  })
  it("Da ton tai email nhung verify la false va username trung", async () => {
    const spy = jest.spyOn(service, 'getUserByEmail' as any).mockResolvedValue({ username: "boidz", isVerify: false })
    const updateSpy = jest.spyOn(service, 'updateUserToDB' as any).mockResolvedValue('1231313');
    const result = await service.validateEmailForRegistration("Boi@gmail.com", "boidz", "123456")
    expect (result).toBe('1231313')
    expect(updateSpy).toHaveBeenCalled()
    expect(spy).toHaveBeenCalledWith("Boi@gmail.com")
  })
   it("Da ton tai email nhung verify la false va username ko trung", async () => {
    const mockcheckUsernameUnique = jest.spyOn(service, "checkUsernameUnique" as any).mockResolvedValue([])
    const spy = jest.spyOn(service, 'getUserByEmail' as any).mockResolvedValue({ username: "boi123", isVerify: false })
    const updateSpy = jest.spyOn(service, 'updateUserToDB' as any).mockResolvedValue('1231313');
    const result = await service.validateEmailForRegistration("Boi@gmail.com", "boidz", "123456")
    expect (result).toBe('1231313')
    expect(updateSpy).toHaveBeenCalled()
    expect(spy).toHaveBeenCalledWith("Boi@gmail.com")  
    expect(mockcheckUsernameUnique).toHaveBeenCalledWith("boidz")
  })
});
