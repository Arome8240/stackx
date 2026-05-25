import { applyDecorators, Type } from '@nestjs/common';
import { ApiOkResponse, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';

export function ApiPaginatedResponse<T extends Type<unknown>>(model: T) {
  return applyDecorators(
    ApiExtraModels(model),
    ApiOkResponse({
      schema: {
        allOf: [
          {
            properties: {
              success: { type: 'boolean', example: true },
              data: {
                type: 'object',
                properties: {
                  items: {
                    type: 'array',
                    items: { $ref: getSchemaPath(model) },
                  },
                  total: { type: 'number' },
                  page: { type: 'number' },
                  limit: { type: 'number' },
                  hasNext: { type: 'boolean' },
                },
              },
              timestamp: { type: 'string' },
            },
          },
        ],
      },
    }),
  );
}
