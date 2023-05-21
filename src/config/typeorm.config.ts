import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'taskmanagement',
  autoLoadEntities: true,
  entities: [__dirname + '../**/*.entity.ts'],
  synchronize: true, // don't make it true on production servers,
};
