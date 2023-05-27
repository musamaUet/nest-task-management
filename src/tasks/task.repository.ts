import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';

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

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = new Task();
    task.title = createTaskDto.title;
    task.status = TaskStatus.OPEN;
    task.description = createTaskDto.description;

    task.save();
    return task;
  }

  async deleteTaskById(taskId: number): Promise<any> {
    const deletedTask = await this.delete({ id: taskId });
    return deletedTask;
  }
}
