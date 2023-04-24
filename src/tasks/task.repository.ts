import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Task } from './task.entity';

@Injectable()
export class TasksRepository extends Repository<Task> {
  constructor(private dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }
  async findOneById(id: number): Promise<Task | null> {
    const task = await this.findOne({
      where: { id: id },
    });
    return task || null;
  }
}
