import { Injectable, NotFoundException } from '@nestjs/common';
import { Tasks, TaskStatus } from './tasks.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { uuid } from 'uuidv4';
import { GetTasksFilterDto } from './dto/get-task-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Tasks[] = [];

  getTasksWithFilters(filterDto: GetTasksFilterDto): Tasks[] {
    const { search, status } = filterDto;
    let tasks = this.tasks;
    if (status) {
      tasks = tasks.filter(
        (task) => task.status.toLowerCase() === status.toLowerCase(),
      );
    }
    if (search) {
      tasks = tasks.filter(
        (task) =>
          task.title.includes(search) || task.description.includes(search),
      );
    }
    return tasks;
  }

  getAllTasks(): Tasks[] {
    return this.tasks;
  }

  getTaskById(taskId: string): Tasks {
    const found = this.tasks.find((task) => task.id === taskId);
    if (!found) throw new NotFoundException(`Task with ID ${taskId} not found`);
    return found;
  }

  createTask(createTaskDto: CreateTaskDto): Tasks {
    const { title, description } = createTaskDto;
    const task: Tasks = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };
    this.tasks.push(task);
    return task;
  }

  deleteTaskById(taskId: string) {
    const found = this.getTaskById(taskId);
    const taskIndex = this.tasks.findIndex((task) => task.id === found.id);
    const deletedTask = this.tasks.splice(taskIndex, 1);
    return { msg: 'task deleted successfully', deletedTask };
  }

  updateTaskStatus(taskId: string, taskStatus: any): Tasks {
    const task = this.getTaskById(taskId);
    task.status = taskStatus;
    return task;
  }
}
