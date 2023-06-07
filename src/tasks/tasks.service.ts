import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { TasksRepository } from './task.repository';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDto } from './dto/get-task-filter.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository) private tasksRepository: TasksRepository,
  ) {}

  async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    return await this.tasksRepository.getTasks(filterDto);
  }

  async getTaskById(taskId: number): Promise<Task> {
    const found = await this.tasksRepository.findOneById(taskId);
    if (found == null) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }
    return found;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return await this.tasksRepository.createTask(createTaskDto);
  }

  async deleteTaskById(taskId: number): Promise<void> {
    const result = await this.tasksRepository.deleteTaskById(taskId);
    if (result.affected === 0)
      throw new NotFoundException(`Task with ID ${taskId} not found`);
  }

  async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);
    task.status = status;
    return await task.save();
  }
}
