import { StatusCodes } from 'http-status-codes';
import { createMock } from 'ts-auto-mock';
import { v4 } from 'uuid';

import {
  Actor,
  HttpMethod,
  ItemMembershipService,
  ItemMembershipTaskManager,
  ItemService,
  ItemTaskManager,
  MemberService,
  TaskRunner,
} from '@graasp/sdk';

import { ItemLoginSchema } from '../src/interfaces/item-login';
import plugin from '../src/service-api';
import build from './app';
import { MEMBER_ID_LOGIN, MOCK_LOGIN_SCHEMA, USERNAME_LOGIN } from './fixtures';

const taskManager = createMock<ItemTaskManager>();
const runner = createMock<TaskRunner<Actor>>();
const itemMembershipTaskManager = createMock<ItemMembershipTaskManager>();
const itemMembershipService = createMock<ItemMembershipService>();
const itemService = createMock<ItemService>();
const memberService = createMock<MemberService>();
const generateAuthTokensPair = jest.fn();

describe('Item Login Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    jest.spyOn(runner, 'runSingle').mockImplementation(async () => true);
    jest.spyOn(runner, 'runSingleSequence').mockImplementation(async () => true);
  });

  describe('GET /:id/login-schema', () => {
    beforeEach(() => {
      jest.spyOn(runner, 'runSingle').mockImplementation(async () => MOCK_LOGIN_SCHEMA);
    });

    it('Successfully get item login', async () => {
      const id = v4();

      const app = await build({
        plugin,
        taskManager,
        runner,
        itemMembershipTaskManager,
        itemMembershipService,
        itemService,
        memberService,
      });

      const res = await app.inject({
        method: HttpMethod.GET,
        url: `/${id}/login-schema`,
      });

      expect(res.body).toEqual(MOCK_LOGIN_SCHEMA);
      expect(res.statusCode).toBe(StatusCodes.OK);
    });

    it('Throws if id is not valid', async () => {
      const id = 'invalid-id';

      const app = await build({
        plugin,
        taskManager,
        runner,
        itemMembershipTaskManager,
        itemMembershipService,
        itemService,
        memberService,
      });

      const res = await app.inject({
        method: HttpMethod.GET,
        url: `/${id}/login-schema`,
      });

      expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    });
  });

  describe('POST /:id/login', () => {
    it('Successfully login in item with username', async () => {
      const id = v4();
      const payload = USERNAME_LOGIN;
      const result = { id: v4(), name: payload.username };

      jest.spyOn(runner, 'runSingleSequence').mockImplementation(async ([t1]) => {
        t1['_result'] = result;
      });

      const app = await build({
        plugin,
        taskManager,
        runner,
        itemMembershipTaskManager,
        itemMembershipService,
        itemService,
        memberService,
      });

      const res = await app.inject({
        method: HttpMethod.POST,
        url: `/${id}/login`,
        payload,
      });

      expect(res.json()).toEqual(result);
      expect(res.statusCode).toBe(StatusCodes.OK);
    });

    it('Successfully login in item with member id', async () => {
      const id = v4();
      const payload = MEMBER_ID_LOGIN;
      const result = { id: v4(), name: 'myname' };

      jest.spyOn(runner, 'runSingleSequence').mockImplementation(async ([t1]) => {
        t1['_result'] = result;
      });

      const app = await build({
        plugin,
        taskManager,
        runner,
        itemMembershipTaskManager,
        itemMembershipService,
        itemService,
        memberService,
      });

      const res = await app.inject({
        method: HttpMethod.POST,
        url: `/${id}/login`,
        payload,
      });

      expect(res.json()).toEqual(result);
      expect(res.statusCode).toBe(StatusCodes.OK);
    });

    it('Throws if member id is invalid', async () => {
      const id = v4();
      const payload = { memberId: 'memberId' };

      const app = await build({
        plugin,
        taskManager,
        runner,
        itemMembershipTaskManager,
        itemMembershipService,
        itemService,
        memberService,
      });

      const res = await app.inject({
        method: HttpMethod.POST,
        url: `/${id}/login`,
        payload,
      });

      expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    });

    it('Generate tokens for mobile', async () => {
      const id = v4();
      const payload = MEMBER_ID_LOGIN;
      const result = { id: v4(), name: 'myname' };

      jest.spyOn(runner, 'runSingleSequence').mockImplementation(async ([t1]) => {
        t1['_result'] = result;
      });

      const app = await build({
        plugin,
        taskManager,
        runner,
        itemMembershipTaskManager,
        itemMembershipService,
        itemService,
        memberService,
        generateAuthTokensPair,
      });

      const res = await app.inject({
        method: HttpMethod.POST,
        url: `/${id}/login?m=true`,
        payload,
      });

      expect(generateAuthTokensPair).toHaveBeenCalled();
      expect(res.json()).toEqual(result);
      expect(res.statusCode).toBe(StatusCodes.OK);
    });

    it('Throws if id is not valid', async () => {
      const id = 'invalid-id';

      const app = await build({
        plugin,
        taskManager,
        runner,
        itemMembershipTaskManager,
        itemMembershipService,
        itemService,
        memberService,
      });

      const res = await app.inject({
        method: HttpMethod.POST,
        url: `/${id}/login`,
      });

      expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    });
  });

  describe('PUT /:id/login-schema', () => {
    it('Successfully chage item login schema', async () => {
      const id = v4();
      const payload = {
        loginSchema: ItemLoginSchema.UsernameAndPassword,
      };
      jest.spyOn(runner, 'runSingle').mockImplementation(async () => payload);

      const app = await build({
        plugin,
        taskManager,
        runner,
        itemMembershipTaskManager,
        itemMembershipService,
        itemService,
        memberService,
      });

      const res = await app.inject({
        method: 'PUT',
        url: `/${id}/login-schema`,
        payload,
      });

      expect(res.statusCode).toBe(StatusCodes.OK);
    });

    it('Throws if id is invalid', async () => {
      const id = 'valid-id';
      const payload = {
        loginSchema: ItemLoginSchema.UsernameAndPassword,
      };

      const app = await build({
        plugin,
        taskManager,
        runner,
        itemMembershipTaskManager,
        itemMembershipService,
        itemService,
        memberService,
      });

      const res = await app.inject({
        method: 'PUT',
        url: `/${id}/login-schema`,
        payload,
      });

      expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    });

    it('Throws if login schema is invalid', async () => {
      const id = 'valid-id';
      const payload = {
        loginSchema: 'login-schema',
      };

      const app = await build({
        plugin,
        taskManager,
        runner,
        itemMembershipTaskManager,
        itemMembershipService,
        itemService,
        memberService,
      });

      const res = await app.inject({
        method: 'PUT',
        url: `/${id}/login-schema`,
        payload,
      });

      expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    });
  });
});
