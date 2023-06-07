import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
  ) {}

  async signUp(authCredentials: AuthCredentialsDto) {
    return await this.userRepository.signUp(authCredentials);
  }

  async signIn(authCredentials: AuthCredentialsDto) {
    const user = await this.userRepository.validateUserPassword(
      authCredentials,
    );
    if (user && user) return user;
    else throw new UnauthorizedException('Invalid credentials');
  }
}
