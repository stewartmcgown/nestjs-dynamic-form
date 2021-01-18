import { SetMetadata } from '@nestjs/common';
import { ClassType } from 'class-transformer/ClassTransformer';

export const DYNAMIC_FORM_LOADER_DECORATOR = 'DYNAMIC_FORM_LOADER_DECORATOR';

export interface DynamicFormLoaderOptions {
  id: string;
  entity: () => ClassType<any>;
}

export const DynamicFormLoader = (
  entity: DynamicFormLoaderOptions['entity'],
  id: string,
) =>
  SetMetadata(DYNAMIC_FORM_LOADER_DECORATOR, {
    id,
    entity,
  });
