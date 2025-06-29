// IN: src/pipes/parse-json.pipe.ts
// ACTION: Create this new file.

import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseJsonPipe implements PipeTransform {
  transform(value: string) {
    if (typeof value !== 'string') {
      throw new BadRequestException('Invalid JSON string');
    }
    try {
      return JSON.parse(value);
    } catch (error) {
      throw new BadRequestException('Validation failed (invalid JSON)');
    }
  }
}
