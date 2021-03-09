export default {
  $id: 'http://graasp.org/item-login/',
  definitions: {
    credentials: {
      type: 'object',
      properties: {
        username: { type: 'string', minLength: 3, maxLength: 50, pattern: '^\\S+( \\S+)*$' },
        memberId: { $ref: 'http://graasp.org/#/definitions/uuid' },
        password: { type: 'string', minLength: 3, maxLength: 50, pattern: '^\\S+( \\S+)*$' }
      },
      oneOf: [
        { required: ['username'] },
        { required: ['memberId'] }
      ],
      additionalProperties: false
    },
  }
};

// schema for login
const login = {
  params: { $ref: 'http://graasp.org/#/definitions/idParam' },
  body: { $ref: 'http://graasp.org/item-login/#/definitions/credentials' },
  response: {
    '2xx': { $ref: 'http://graasp.org/members/#/definitions/member' }, // TODO: remove passwordHash. How to "install" changes to the original schema??
    '4xx': { $ref: 'http://graasp.org/#/definitions/error' },
    '5xx': { $ref: 'http://graasp.org/#/definitions/error' },
  }
};

export {
  login
};