import { v4 } from 'uuid';

import { ItemLoginSchema } from '../src/interfaces/item-login';

export const GRAASP_ACTOR = {
  id: 'mock-id',
};

export const MOCK_LOGIN_SCHEMA = ItemLoginSchema.Username;

export const USERNAME_LOGIN = {
  username: 'my-username',
};

export const MEMBER_ID_LOGIN = {
  memberId: v4(),
};
