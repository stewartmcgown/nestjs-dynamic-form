import { DiscoveryModule } from '@nestjs-plus/discovery';
import { Module, OnModuleInit } from '@nestjs/common';
import { DynamicFormRegistry } from './dynamic-form.registry';
import { DynamicFormResolver } from './resolvers/dynamic-form.resolver';

/**
 * A module to faciliate dynamic API toggleable configuration
 *
 * The goal here is to have other modules declare their dynamic configuration
 * files and DynamicConfig will detect these and build the GraphQL routes
 * with validation.
 *
 * This is not to be used for explicit and publicly accessible settings keys,
 * like 'Toggle the zone on or off'. This is to be used for sensitive internal
 * configuration parameters that anyone who gets a hold of our schema
 * shouldn't be able to find out about.
 *
 * The DynamicForm implementation is based on class-validator, so that the
 * same package can be used on the client and server side to validate
 * generic objects.
 */
@Module({
  imports: [DiscoveryModule],
  providers: [DynamicFormResolver, DynamicFormRegistry],
})
export class DynamicFormModule implements OnModuleInit {
  constructor(private readonly registry: DynamicFormRegistry) {}

  /**
   * When the Nest application is compeltely initialised, we can run through
   * all the registered forms and sync them with the generated metaschema.
   */
  async onModuleInit() {
    await this.registry.refreshDynamicFormSchemas();
  }
}
