import {
  DiscoveredMethodWithMeta,
  DiscoveryService,
} from '@nestjs-plus/discovery';
import { Injectable } from '@nestjs/common';
import { ClassType } from 'class-transformer/ClassTransformer';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { SchemaObject } from 'openapi3-ts';
import {
  DynamicFormHandlerOptions,
  DYNAMIC_FORM_HANDLER_DECORATOR,
} from './decorators/dynamic-form-handler.decorator';
import {
  DynamicFormLoaderOptions,
  DYNAMIC_FORM_LOADER_DECORATOR,
} from './decorators/dynamic-form-loader.decorator';
import {
  DynamicFormHandlerFunctionType,
  DynamicFormLoaderFunctionType,
} from './interfaces/handler-loader.interface';

/**
 * Registry of all dynamic forms.
 */

/**
 * Registry of all the dynamic forms we've gto
 */
@Injectable()
export class DynamicFormRegistry {
  private registry: {
    [formId: string]: {
      formId: string;
      entity: () => ClassType<any>;
      handler: DynamicFormHandlerFunctionType<any>;
      loader: DynamicFormLoaderFunctionType;
      schema: SchemaObject;
    };
  } = {};

  constructor(private discovery: DiscoveryService) {}

  getEntry(id: string) {
    return this.registry[id];
  }

  async refreshDynamicFormSchemas() {
    const schemas = validationMetadatasToSchemas();

    const handlers = await this.discovery.providerMethodsWithMetaAtKey(
      DYNAMIC_FORM_HANDLER_DECORATOR,
    );

    const loaders = await this.discovery.providerMethodsWithMetaAtKey(
      DYNAMIC_FORM_LOADER_DECORATOR,
    );

    const idsToMethods: {
      [id: string]: {
        handler?: DiscoveredMethodWithMeta<unknown>;
        loader?: DiscoveredMethodWithMeta<unknown>;
      };
    } = {};

    for (const handler of handlers) {
      const meta = handler.meta as DynamicFormHandlerOptions;
      idsToMethods[meta.id] = { handler };
    }

    for (const loader of loaders) {
      const meta = loader.meta as DynamicFormLoaderOptions;
      const cached = idsToMethods[meta.id];
      if (cached) {
        cached.loader = loader;
      } else {
        // Refusing to install missing loader.
      }
    }

    for (const [formId, { handler, loader }] of Object.entries(idsToMethods)) {
      if (!loader || !handler) continue;
      const loaderMeta = loader.meta as DynamicFormLoaderOptions;

      this.registry[formId] = {
        entity: loaderMeta.entity,
        formId,
        handler: handler.discoveredMethod.parentClass.instance[
          handler.discoveredMethod.methodName
        ].bind(handler.discoveredMethod.parentClass.instance),
        loader: loader.discoveredMethod.parentClass.instance[
          loader.discoveredMethod.methodName
        ].bind(loader.discoveredMethod.parentClass.instance),
        schema: schemas[loaderMeta.entity().name],
      };
    }
  }
}
