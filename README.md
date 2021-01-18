<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[travis-image]: https://api.travis-ci.org/nestjs/nest.svg?branch=master
[travis-url]: https://travis-ci.org/nestjs/nest
[linux-image]: https://img.shields.io/travis/nestjs/nest/master.svg?label=linux
[linux-url]: https://travis-ci.org/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/dm/@nestjs/core.svg" alt="NPM Downloads" /></a>
<a href="https://travis-ci.org/nestjs/nest"><img src="https://api.travis-ci.org/nestjs/nest.svg?branch=master" alt="Travis" /></a>
<a href="https://travis-ci.org/nestjs/nest"><img src="https://img.shields.io/travis/nestjs/nest/master.svg?label=linux" alt="Linux" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#5" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

Dynamic form module for [Nest](https://github.com/nestjs/nest). Allows you to create forms with populated data compeltely dynamicaly.

## Installation

```bash
$ yarn add @stewartmcgown/nestjs-dynamic-form
```

## Quick Start

The dynamic form resolver is responsible for routing client requests for forms
to the correct provider of that form. You can register a form handler and loader
using these two decorators:

```ts
 @DynamicFormHandler(name: string)
```

Expects the called handler to accept one generic parameter, DynamicHandlerParameter<T>,
where T is the data type that the client form that was posted back to us. It is not
expected to return anything.

e.g

```ts
  async handle(input: DynamicHandlerParameter<OrderAssignmentSettingsInput>) {
   await this.entityManager.getRepository(OrderAssignmentSettings).update(
     {
       zoneId: input.entityId,
     },
     {
       ...input.data,
     },
   );
 }
```

```ts
 @DynamicFormLoader(() => Class, name: string)
```

Expects a loader method which accepts a formId and a zoneId.

e.g

```ts
  async load(formId: string, zoneId: string): Promise<DynamicForm> { ... }
```
