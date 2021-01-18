import { DynamicForm } from '../form-objects/generic-setting';

export interface DynamicHandlerLoader {
  handle(input: any): Promise<any>;
  load(id: string, entityId?: string): Promise<any>;
}

export interface DynamicHandlerParameter<T> {
  id: string;

  entityId?: string;

  data: T;
}

export type DynamicFormLoaderFunctionType = (
  formId: string,
  entityId?: string,
) => Promise<DynamicForm>;

export type DynamicFormHandlerFunctionType<T> = (
  input: DynamicHandlerParameter<T>,
) => Promise<any>;
