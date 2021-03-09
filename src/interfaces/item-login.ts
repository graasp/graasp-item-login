import { UnknownExtra } from 'graasp';

export interface ItemMemberLogin {
  itemId: string;
  memberId: string;
  createdAt: string;
}

// Members
export interface ItemLoginMemberCredentials {
  memberId?: string;
  username?: string;
  password?: string;
}

export interface ItemLoginMemberExtra extends UnknownExtra {
  itemLogin: { password: string; }
}

// Items
export enum ItemLoginSchema {
  Username = 'username',
  UsernameAndPassword = 'username+password',
  Anonymous = 'anonymous',
  AnonymousAndPassword = 'anonymous+password'
}

export interface ItemLoginExtra extends UnknownExtra {
  itemLogin: { loginSchema: ItemLoginSchema }
}
