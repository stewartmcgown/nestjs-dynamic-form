import { Field, ObjectType } from '@nestjs/graphql';
import { DynamicForm } from './generic-setting';

@ObjectType()
export class DynamicFormResult {
  @Field()
  success: boolean;

  @Field({ nullable: true })
  successMessage?: string;

  @Field(() => DynamicForm)
  form: DynamicForm;
}
