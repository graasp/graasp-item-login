import { GraaspErrorDetails, GraaspError } from 'graasp';

export class GraaspItemLoginError implements GraaspError {
  name: string;
  code: string
  message: string;
  statusCode?: number;
  data?: unknown;
  origin: 'plugin' | string;

  constructor({ code, statusCode, message }: GraaspErrorDetails, data?: unknown) {
    this.name = code;
    this.code = code;
    this.message = message;
    this.statusCode = statusCode;
    this.data = data;
    this.origin = 'plugin';
  }
}

export class ItemNotFound extends GraaspItemLoginError {
  constructor(data?: unknown) {
    super({ code: 'GILERR001', statusCode: 404, message: 'Item not found' }, data);
  }
}

export class MemberIdentifierNotFound extends GraaspItemLoginError {
  constructor(data?: unknown) {
    super({ code: 'GILERR002', statusCode: 404, message: 'Member identifier not found' }, data);
  }
}

export class InvalidMember extends GraaspItemLoginError {
  constructor(data?: unknown) {
    super({ code: 'GILERR003', statusCode: 404, message: 'This member cannot be used to login to an item' }, data);
  }
}

export class MissingItemLoginSchema extends GraaspItemLoginError {
  constructor(data?: unknown) {
    super({ code: 'GILERR004', statusCode: 500, message: 'Missing login schema' }, data);
  }
}

export class MissingItemLoginTag extends GraaspItemLoginError {
  constructor(data?: unknown) {
    super({ code: 'GILERR005', statusCode: 400, message: 'Item does not possess the required tag' }, data);
  }
}

export class ValidMemberSession extends GraaspItemLoginError {
  constructor(data?: unknown) {
    super({ code: 'GILERR006', statusCode: 400, message: 'Member with valid session trying to (re)login' }, data);
  }
}

export class InvalidCredentials extends GraaspItemLoginError {
  constructor(data?: unknown) {
    super({ code: 'GILERR007', statusCode: 401, message: 'Provided credentials don\'t match member\'s' }, data);
  }
}

export class MissingCredentialsForLoginSchema extends GraaspItemLoginError {
  constructor(data?: unknown) {
    super({ code: 'GILERR008', statusCode: 400, message: 'Missing credentials for set login schema' }, data);
  }
}

export class UnnecessaryCredentialsForLoginSchema extends GraaspItemLoginError {
  constructor(data?: unknown) {
    super({ code: 'GILERR008', statusCode: 400, message: 'Unnecessary credentials for set login schema' }, data);
  }
}

export class MemberCannotAdminItem extends GraaspItemLoginError {
  constructor(data?: unknown) {
    super({ code: 'GILERR009', statusCode: 403, message: 'Member cannot admin item' }, data);
  }
}
