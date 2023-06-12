import { User } from 'src/auth/user.entity';

declare module 'express' {
  interface Request {
    user: User;
  }
}
