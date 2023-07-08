import { Body, Controller, Post, ValidationPipe, Logger } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  private logger = new Logger('AuthController');
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signUp(
    @Body(ValidationPipe) authCredentials: AuthCredentialsDto,
  ): Promise<void> {
    this.logger.log(
      'user is trying to signup with data',
      JSON.stringify(authCredentials),
    );
    return await this.authService.signUp(authCredentials);
  }

  @Post('/signin')
  async signIn(@Body(ValidationPipe) authCredentials: AuthCredentialsDto) {
    this.logger.log(
      'user is trying to login with data',
      JSON.stringify(authCredentials),
    );
    return await this.authService.signIn(authCredentials);
  }
}
