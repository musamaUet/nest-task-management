import { DataSource, Repository } from 'typeorm';
import { User } from './user.entity';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async signUp(authCredentials: AuthCredentialsDto) {
    const { username, password } = authCredentials;

    try {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await this.hashPassword(password, salt);

      const user = new User();
      user.username = username;
      user.password = hashedPassword;
      user.salt = salt;
      await user.save();
    } catch (err) {
      console.log('err', err);
      if (err.code == 23505)
        throw new ConflictException('Username already exists');

      throw new InternalServerErrorException();
    }
  }

  async validateUserPassword(
    authCredentials: AuthCredentialsDto,
  ): Promise<string | null> {
    const { username, password } = authCredentials;

    const user = await this.findOne({ where: { username } });

    if (user && (await user.validatePassword(password))) {
      return user.username;
    } else return null;
  }

  private async hashPassword(password, salt): Promise<string> {
    return await bcrypt.hash(password, salt);
  }
}
