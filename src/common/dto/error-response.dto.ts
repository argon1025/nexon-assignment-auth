import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ErrorDetail {
  @Expose()
  @ApiProperty({
    example: 'ERROR_CODE',
    description: '에러 메시지(코드)',
  })
  name: string;

  @Expose()
  @ApiProperty({
    example: 'ERROR_MESSAGE',
    description: '에러 메시지',
  })
  message: string;
}

@Exclude()
export class ErrorResponse {
  @Expose()
  error: ErrorDetail;
}
