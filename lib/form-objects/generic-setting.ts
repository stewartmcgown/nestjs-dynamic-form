/**
 * Base for a generic type of form.
 *
 * A generic form needs to have all the attributes we'd expect along with
 * structural context that lets the renderer organise the data.
 */

import { Field, ObjectType } from '@nestjs/graphql';
import { ClassType } from 'class-transformer/ClassTransformer';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import GraphQLJSON from 'graphql-type-json';
import { SchemaObject } from 'openapi3-ts';

const schemas = validationMetadatasToSchemas();

/**
 * A container for a form
 */
@ObjectType()
export class DynamicForm {
  @Field()
  id: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => GraphQLJSON, { nullable: true })
  initialValues?: any;

  @Field(() => GraphQLJSON)
  schema?: SchemaObject;
}

export function getDynamicForm(
  clazz: ClassType<any>,
  options: {
    id: string;
    title: string;
    description?: string;
  },
): DynamicForm {
  const schema = schemas[clazz.name];

  if (!schema) throw new Error('No such schema for ' + clazz.name);

  return {
    ...options,
    schema,
  };
}
