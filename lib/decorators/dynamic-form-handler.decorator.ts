import { SetMetadata } from '@nestjs/common';

export const DYNAMIC_FORM_HANDLER_DECORATOR = 'DYNAMIC_FORM_HANDLER_DECORATOR';

export interface DynamicFormHandlerOptions {
  id: string;
}

export const DynamicFormHandler = (
  id: string,
  options?: Omit<DynamicFormHandlerOptions, 'id'>,
) => SetMetadata(DYNAMIC_FORM_HANDLER_DECORATOR, { id, ...options });
