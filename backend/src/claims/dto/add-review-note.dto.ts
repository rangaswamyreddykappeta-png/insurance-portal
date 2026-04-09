import { IsNotEmpty, IsString } from 'class-validator';

export class AddReviewNoteDto {
  @IsString()
  @IsNotEmpty()
  note: string;
}