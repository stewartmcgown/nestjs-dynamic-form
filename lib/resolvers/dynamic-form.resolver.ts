import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import GraphQLJSON from 'graphql-type-json';
import { DynamicFormRegistry } from '../dynamic-form.registry';
import { DynamicFormResult } from '../form-objects/dynamic-form-result';
import { DynamicForm } from '../form-objects/generic-setting';
import { DynamicHandlerParameter } from '../interfaces/handler-loader.interface';

/**
 * The dynamic form resolver is responsible for routing client requests for forms
 * to the correct provider of that form. You can register a form handler and loader
 * using these two decorators:
 *
 * ----------------
 *
 * @DynamicFormHandler(name: string)
 *
 *  Expects the called handler to accept one generic parameter, DynamicHandlerParameter<T>,
 *  where T is the data type that the client form that was posted back to us. It is not
 *  expected to return anything.
 *
 *  e.g
 *
 *  async handle(input: DynamicHandlerParameter<OrderAssignmentSettingsInput>) {
 *   await this.entityManager.getRepository(OrderAssignmentSettings).update(
 *     {
 *       zoneId: input.entityId,
 *     },
 *     {
 *       ...input.data,
 *     },
 *   );
 * }
 *
 * ----------------
 *
 * @DynamicFormLoader(() => Class, name: string)
 *
 *  Expect a loader method which accepts a formId and a zoneId.
 *
 *  e.g
 *
 *  async load(formId: string, zoneId: string): Promise<DynamicForm> { ... }
 */
@Resolver()
export class DynamicFormResolver {
  constructor(private registry: DynamicFormRegistry) {}

  @Query(() => DynamicForm)
  async DynamicForm(
    @Args('id') id: string,
    @Args('entityId', { nullable: true }) entityId?: string,
  ): Promise<DynamicForm> {
    const entry = await this.registry.getEntry(id);

    if (!entry) throw new Error(`No Form found with id='${id}'`);

    const { loader, schema } = entry;

    const form = await loader(id, entityId);

    form.schema = schema;

    return form;
  }

  @Mutation(() => DynamicFormResult)
  async submitDynamicForm(
    @Args('id') id: string,
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    @Args('data', { type: () => GraphQLJSON }) data: any,
    @Args('entityId', { nullable: true }) entityId?: string,
  ): Promise<DynamicFormResult> {
    const { entity, handler } = await this.registry.getEntry(id);

    const parsed = plainToClass(entity(), data, {
      excludeExtraneousValues: true,
    });
    const validated = await validate(parsed);

    if (validated.length) throw validated;

    if (!handler) throw new Error(`No Handler found with id='${id}'`);

    const param: DynamicHandlerParameter<any> = {
      data: parsed,
      id,
      entityId,
    };

    await handler(param);

    return {
      success: !validated.length,
      form: await this.DynamicForm(id, entityId),
    };
  }
}
