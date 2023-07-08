import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TasksRepository } from './task.repository';
import { GetTasksFilterDto } from './dto/get-task-filter.dto';
import { TaskStatus } from './task-status.enum';
import { NotFoundException } from '@nestjs/common';

const mockTaskRepository = () => ({
  getTasks: jest.fn(),
  findOneByIdAndUser: jest.fn(),
});

describe('TasksService', () => {
  let tasksService;
  let tasksRepository;

  const mockUser = { id: 12, username: 'test user' };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TasksRepository, useFactory: mockTaskRepository },
      ],
    }).compile();

    tasksService = await module.get<TasksService>(TasksService);
    tasksRepository = await module.get<TasksRepository>(TasksRepository);
  });

  describe('getTasks', () => {
    it('gets all tasks from the repository', async () => {
      tasksRepository.getTasks.mockResolvedValue('somevalue');

      expect(tasksRepository.getTasks).not.toHaveBeenCalled();

      const filters: GetTasksFilterDto = {
        status: TaskStatus.IN_PROGRESS,
        search: 'some search',
      };
      const result = await tasksService.getTasks(filters, mockUser);
      expect(tasksRepository.getTasks).toHaveBeenCalled();
      expect(result).toEqual('somevalue');
    });
  });

  describe('getTaskById', () => {
    it('calls tasksRepository.findOneByIdAndUser() and return the task', async () => {
      const mockTask = { title: 'Test Task', description: 'Test Desc' };
      tasksRepository.findOneByIdAndUser.mockResolvedValue(mockTask);

      const result = await tasksService.getTaskById(1, mockUser);
      expect(result).toEqual(mockTask);
      expect(tasksRepository.findOneByIdAndUser).toHaveBeenCalledWith(
        1,
        mockUser,
      );
    });

    it('throws an error as task is not found', () => {
      tasksRepository.findOneByIdAndUser.mockResolvedValue(null);
      expect(tasksService.getTaskById(1, mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
