import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDto } from './dto/get-task-filter.dto';
import { User } from '../auth/user.entity';

@Injectable()
export class TasksRepository extends Repository<Task> {
  constructor(private dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('task');
    console.log('userId', typeof user.id, user.id);
    query.where('task.userId = :userId', { userId: user.id });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }
    if (search) {
      query.andWhere(
        'LOWER(task.title) LIKE (:search) OR LOWER(task.description) LIKE LOWER(:search)',
        { search: `%${search.toLowerCase()}%` },
      );
    }

    const tasks = await query.getMany();

    console.log('tasks', user);

    return tasks;
  }
  async findOneById(id: number): Promise<Task | null> {
    const task = await this.findOne({
      where: { id: id },
    });
    return task || null;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const task = new Task();
    task.title = createTaskDto.title;
    task.status = TaskStatus.OPEN;
    task.description = createTaskDto.description;
    task.user = user;

    await task.save();

    const taskResponse = JSON.parse(JSON.stringify(task));
    delete taskResponse.user;

    return taskResponse;
  }

  async deleteTaskById(taskId: number): Promise<any> {
    const deletedTask = await this.delete({ id: taskId });
    return deletedTask;
  }
}
