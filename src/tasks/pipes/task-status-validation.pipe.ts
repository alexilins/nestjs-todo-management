import { PipeTransform, BadRequestException } from '@nestjs/common';
import { TaskStatus } from '../task.model';

export class TaskStatusValidationPipe implements PipeTransform {
  readonly allowedStatuses = [
    TaskStatus.DONE,
    TaskStatus.IN_PROGRESS,
    TaskStatus.OPEN,
  ];

  transform(value: string) {
    value = value.toUpperCase();
    if (this.isStatusValid(value)) {
      return value;
    } else {
      throw new BadRequestException(`'${value}' is an invalid status`);
    }
  }

  private isStatusValid(status: any): boolean {
    return this.allowedStatuses.includes(status);
  }
}
