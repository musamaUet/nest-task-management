import { Injectable, NotFoundException, ParseIntPipe } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-task-filter.dto';
import { TasksRepository } from './task.repository';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository) private tasksRepository: TasksRepository,
  ) {}

  async getTaskById(taskId: number): Promise<Task> {
    const found = await this.tasksRepository.findOneById(taskId);
    if (found == null) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }
    return found;
  }
}
