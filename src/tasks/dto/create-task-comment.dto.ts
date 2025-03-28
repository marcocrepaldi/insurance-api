import { IsString, IsUUID } from 'class-validator';

export class CreateTaskCommentDto {
  @IsString()
  comment: string;

  @IsUUID()
  userId: string;
}
