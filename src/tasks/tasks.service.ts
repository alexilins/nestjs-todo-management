import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import * as uuid from 'uuid/v1';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  public getAllTasks(): Task[] {
    return this.tasks;
  }

  public getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
    const { status, search } = filterDto;
    let tasks = this.getAllTasks();

    if (status) {
      tasks = tasks.filter(t => t.status === status);
    }

    if (search) {
      tasks = tasks.filter(
        t =>
          t.title.toLowerCase().includes(search.toLowerCase()) ||
          t.description.toLowerCase().includes(search.toLowerCase()),
      );
    }

    return tasks;
  }

  public getTaskById(id: string): Task {
    const found = this.tasks.find(t => t.id === id);

    if (!found) {
      throw new NotFoundException(`Task with id ${id} not found!`);
    }

    return found;
  }

  public createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;

    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);
    return task;
  }

  public deleteTaskById(id: string): Task[] {
    const found = this.getTaskById(id);
    this.tasks = this.tasks.filter(t => t.id !== found.id);
    return this.tasks;
  }

  public updateTaskStatus(id: string, status: TaskStatus): Task {
    const task = this.getTaskById(id);
    task.status = status;
    return task;
  }
}
