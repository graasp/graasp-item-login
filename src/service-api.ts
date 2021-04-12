// global
import { FastifyPluginAsync } from 'fastify';
import { Actor } from 'graasp';
// local
import common, { login, getLoginSchema } from './schemas';
import { ItemLoginService } from './db-service';
import { ItemLoginMemberCredentials } from './interfaces/item-login';
import { ValidMemberSession } from './util/graasp-item-login-error';
import { ItemLoginWithMemberIdTask } from './tasks/item-login-with-member-id-task';
import { ItemLoginWithUsernameTask } from './tasks/item-login-with-username-task';
import { GetLoginSchemaTask } from './tasks/get-item-login-schema';

export interface GraaspItemLoginOptions {
  /** id of the tag to look for in the item to allow the "log in" to item */
  tagId: string,
  graaspActor: Actor
}

const plugin: FastifyPluginAsync<GraaspItemLoginOptions> = async (fastify, options) => {
  const { tagId, graaspActor } = options;
  const {
    items: { dbService: iS },
    itemMemberships: {
      dbService: iMS,
      taskManager: itemMembershipTaskManager
    },
    members: { dbService: mS },
    taskRunner: runner
  } = fastify;

  const ilS = new ItemLoginService(tagId);

  // schemas
  fastify.addSchema(common);

  fastify.get<{ Params: { id: string } }>(
    '/:id/login', { schema: getLoginSchema },
    async ({ log, member, params: { id: itemId } }) => {
      const task = new GetLoginSchemaTask(member || graaspActor, itemId, iS);
      return runner.runSingle(task, log);
    });

  // "log in" to the item
  fastify.post<{ Params: { id: string }; Body: ItemLoginMemberCredentials }>(
    '/:id/login', { schema: login },
    async (request) => {
      const { log, session, member, params: { id: itemId }, body: credentials } = request;

      // if there's already a valid session, fail immediately
      if (member) throw new ValidMemberSession(member.id);

      const { username, memberId, password } = credentials; // TODO: allow for "empty" username and generate one (anonymous, anonymous+password)
      const task = username ?
        new ItemLoginWithUsernameTask(graaspActor, itemId, { username, password }, ilS, iS, mS, iMS) :
        new ItemLoginWithMemberIdTask(graaspActor, itemId, { memberId, password }, ilS, iS, mS, iMS);
      const { id, name, hasMembership } = await runner.runSingle(task, log);

      // if member has no access/membership, create one
      if (!hasMembership) {
        // TODO: because these 2 actions are not run in the same transaction, it's theoratically possible
        // that this same membership is created before this next task runs, making the task fail because
        // an existing one already exist. Even if it happens there's no real "inconsistent" outcome.
        const membership = { memberId: id }; // `permission` defaults to 'viewer' if not passed here
        const task = itemMembershipTaskManager.createCreateTask(graaspActor, membership, itemId);
        task.skipActorChecks = true;
        await runner.runSingle(task, log);
      }

      // set session
      session.set('member', id);
      return { id, name };
    }
  );

  // TODO: endpoint to change login schema (...language)?
  // fastify.patch('')
};

export default plugin;
