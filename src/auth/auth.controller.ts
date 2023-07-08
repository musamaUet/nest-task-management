import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signUp(
    @Body(ValidationPipe) authCredentials: AuthCredentialsDto,
  ): Promise<void> {
    return await this.authService.signUp(authCredentials);
  }

  @Post('/signin')
  async signIn(@Body(ValidationPipe) authCredentials: AuthCredentialsDto) {
    return await this.authService.signIn(authCredentials);
  }
}
