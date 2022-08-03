import fastify, { FastifyInstance, FastifyPluginAsync } from 'fastify';

import {
  Actor,
  ItemMembershipService,
  ItemMembershipTaskManager,
  ItemService,
  ItemTaskManager,
  MemberService,
  TaskRunner,
} from '@graasp/sdk';

import { common, memberSchema } from '../src/schemas/common';
import { GraaspItemLoginOptions } from '../src/service-api';
import { GRAASP_ACTOR } from './fixtures';

type props = {
  taskManager: ItemTaskManager;
  itemMembershipTaskManager: ItemMembershipTaskManager;
  itemMembershipService: ItemMembershipService;
  itemService: ItemService;
  memberService: MemberService;
  runner: TaskRunner<Actor>;
  options?: GraaspItemLoginOptions;
  plugin: FastifyPluginAsync<GraaspItemLoginOptions>;
  // eslint-disable-next-line @typescript-eslint/ban-types
  generateAuthTokensPair?: Function;
};

const build = async ({
  plugin,
  taskManager,
  itemService,
  memberService,
  runner,
  itemMembershipTaskManager,
  itemMembershipService,
  generateAuthTokensPair,
}: props): Promise<FastifyInstance> => {
  const app = fastify();
  app.addSchema(common);
  app.addSchema(memberSchema);
  app.decorate('taskRunner', runner);
  app.decorate('items', {
    taskManager,
    dbService: itemService,
  });
  app.decorate('members', {
    dbService: memberService,
  });
  app.decorate('itemMemberships', {
    taskManager: itemMembershipTaskManager,
    dbService: itemMembershipService,
  });
  app.decorate('attemptVerifyAuthentication', jest.fn().mockResolvedValue(true));
  app.decorate('verifyAuthentication', jest.fn().mockResolvedValue(true));
  app.decorate('generateAuthTokensPair', generateAuthTokensPair ?? jest.fn());
  app.decorateRequest('session', { set: jest.fn() });

  await app.register(plugin, { tagId: 'tagId', graaspActor: GRAASP_ACTOR });

  return app;
};
export default build;
