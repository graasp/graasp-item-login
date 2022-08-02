import bcrypt from 'bcrypt';
import cryptoRandomString from 'crypto-random-string';

import { ItemLoginSchema } from '../interfaces/item-login';

const randomHexOf4 = () => cryptoRandomString({ length: 4, type: 'hex' });
const saltRounds = 10;

export const encryptPassword = async (password: string): Promise<string> =>
  bcrypt.hash(password, saltRounds);

export const validatePassword = async (
  plainTextPassword: string,
  passwordHash: string,
): Promise<boolean> => bcrypt.compare(plainTextPassword, passwordHash);

export const loginSchemaRequiresPassword = (loginSchema: ItemLoginSchema): boolean =>
  loginSchema === ItemLoginSchema.UsernameAndPassword ||
  loginSchema === ItemLoginSchema.AnonymousAndPassword;

export const generateRandomEmail = (): string => `${randomHexOf4()}-${Date.now()}@graasp.org`;
