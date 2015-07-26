/*!
 * Module Dependencies.
 */

var loopback = require('loopback');
var SALT_WORK_FACTOR = 10;
var bcrypt = require('bcryptjs');
var DEFAULT_TTL = 1209600; // 2 weeks in seconds
var DEFAULT_MAX_TTL = 31556926; // 1 year in seconds
var assert = require('assert');

var RoleMapping = loopback.RoleMapping;
assert(RoleMapping, 'RoleMapping model must be defined before User model');

var Role = loopback.Role;
assert(Role, 'RoleMapping model must be defined before User model');

var debug = require('debug')('loopback:user');


module.exports = function (User) {

  /**
   * Normalize the credentials
   * @param {Object} credentials The credential object
   * @returns {Object} The normalized credential object
   */

  User.normalizeCredentials = function (credentials) {
    var query = {};
    credentials = credentials || {};

    if (credentials.email) {
      query.email = credentials.email;
    } else if (credentials.username) {
      query.username = credentials.username;
    }

    return query;
  };

  /**
   * Create access token for the logged in user. This method can be overridden to
   * customize how access tokens are generated
   *
   * @param {Number} ttl The requested ttl
   * @callack {Function} cb The callback function
   * @param {String|Error} err The error string or object
   * @param {AccessToken} token The generated access token object
   */
  User.prototype.createAccessToken = function (ttl, cb) {
    var userModel = this.constructor;
    ttl = Math.min(ttl || userModel.settings.ttl, userModel.settings.maxTTL);
    this.accessTokens.create({
      ttl: ttl
    }, cb);
  };

  /**
   * Compare the given `password` with the users hashed password.
   *
   * @param {String} password The plain text password
   * @returns {Boolean}
   */

  User.prototype.hasPassword = function (plain, fn) {
    if (this.password && plain) {
      bcrypt.compare(plain, this.password, function (err, isMatch) {
        if (err) return fn(err);
        fn(null, isMatch);
      });
    } else {
      fn(null, false);
    }
  };

  /**
   * Register a user by with the given `registration`.
   *
   * ```js
   *    User.register({username: 'foo', password: 'bar'}, function (err, user) {
   *      console.log(user);
   *    });
   * ```
   *
   * @param {Object} registration username/password or email/password
   * @callback {Function} callback Callback function
   * @param {Error} err Error object
   * @param {user} user information if register is successful
   */

  User.register = function (registration, fn) {
    var self = this;

    if (!registration.username) {
      var err1 = new Error('必须提供用户名！');
      err1.statusCode = 400;
      return fn(err1);
    }

    if (!registration.password) {
      var err2 = new Error('必须提供密码！');
      err2.statusCode = 400;
      return fn(err2);
    }

    var query = self.normalizeCredentials(registration);

    self.findOne({where: query}, function (err, user) {
      var defaultError = new Error('注册失败！');
      defaultError.statusCode = 400;

      if (user) {
        var err = new Error('该用户已存在！');
        err.statusCode = 400;
        return fn(err);
      } else {
        self.create(registration, function (err, user) {
          if (err) {
            debug('An error is reported from User.create: %j', err);
            fn(defaultError);
          }
          else if (user) {
            Role.findOne({
              where: {name: 'user'}
            }, function (err, role) {
              if (err) {
                console.log('err', err);
              }
              role.principals.create({
                principalType: RoleMapping.USER,
                principalId: user.id
              });
            });
            fn(err, user)
          }
        })
      }
    });
  }

  /**
   * Login a user by with the given `credentials`.
   *
   * ```js
   *    User.login({username: 'foo', password: 'bar'}, function (err, token) {
   *      console.log(token.id);
   *    });
   * ```
   *
   * @param {Object} credentials username/password or email/password
   * @param {String[]|String} [include] Optionally set it to "user" to include
   * the user info
   * @callback {Function} callback Callback function
   * @param {Error} err Error object
   * @param {AccessToken} token Access token if login is successful
   */

  User.login = function (credentials, include, fn) {
    var self = this;
    if (typeof include === 'function') {
      fn = include;
      include = undefined;
    }

    include = (include || '');
    if (Array.isArray(include)) {
      include = include.map(function (val) {
        return val.toLowerCase();
      });
    } else {
      include = include.toLowerCase();
    }

    if (!credentials.username) {
      var err1 = new Error('必须提供用户名！');
      err1.statusCode = 400;
      return fn(err1);
    }

    if (!credentials.password) {
      var err2 = new Error('必须提供密码！');
      err2.statusCode = 400;
      return fn(err2);
    }

    var query = self.normalizeCredentials(credentials);

    self.findOne({where: query}, function (err, user) {
      var defaultError = new Error('登录失败！');
      defaultError.statusCode = 401;

      if (err) {
        debug('An error is reported from User.findOne: %j', err);
        fn(defaultError);
      } else if (user) {
        user.hasPassword(credentials.password, function (err, isMatch) {
          if (err) {
            debug('An error is reported from User.hasPassword: %j', err);
            fn(defaultError);
          } else if (isMatch) {
            user.createAccessToken(credentials.ttl, function (err, token) {
              if (err) return fn(err);
              if (Array.isArray(include) ? include.indexOf('user') !== -1 : include === 'user') {
                // NOTE(bajtos) We can't set token.user here:
                //  1. token.user already exists, it's a function injected by
                //     "AccessToken belongsTo User" relation
                //  2. ModelBaseClass.toJSON() ignores own properties, thus
                //     the value won't be included in the HTTP response
                // See also loopback#161 and loopback#162
                token.__data.user = user;
              }
              fn(err, token);
            });
          } else {
            debug('The password is invalid for user %s', query.email || query.username);
            fn(defaultError);
          }
        });
      } else {
        debug('No matching record is found for user %s', query.email || query.username);
        fn(defaultError);
      }
    });
  };

  /**
   * Logout a user with the given accessToken id.
   *
   * ```js
   *    User.logout('asd0a9f8dsj9s0s3223mk', function (err) {
  *      console.log(err || 'Logged out');
  *    });
   * ```
   *
   * @param {String} accessTokenID
   * @callback {Function} callback
   * @param {Error} err
   */

  User.logout = function (tokenId, fn) {
    this.relations.accessTokens.modelTo.findById(tokenId, function (err, accessToken) {
      if (err) {
        fn(err);
      } else if (accessToken) {
        accessToken.destroy(fn);
      } else {
        fn(new Error('找不到访问令牌！'));
      }
    });
  };

  /**
   * Change password for a authenticated user by with the given `credentials`.
   *
   * ```js
   *    User.changePassword({oldPassword: 'oldPass', newPassword: 'newPass'}, function (err) {
   *      console.log(err);
   *    });
   * ```
   *
   * @param {Object} credentials with old password and new password
   * @callback {Function} callback
   * @param {Error} err
   */

  User.changePassword = function (tokenId, credentials, fn) {
    var self = this;

    this.relations.accessTokens.modelTo.findById(tokenId, function(err, accessToken) {
      if (err) {
        fn(err);
        console.log(err)
      } else if (accessToken) {

        if (!credentials.oldPassword) {
          var err1 = new Error('必须提供旧密码！');
          err1.statusCode = 400;
          return fn(err1);
        }

        if (!credentials.newPassword) {
          var err2 = new Error('必须提供新密码！');
          err2.statusCode = 400;
          return fn(err2);
        }

        self.findById(accessToken.userId, function(err, user) {
          var defaultError = new Error('修改密码失败！');
          defaultError.statusCode = 400;
          if (err) {
            debug('An error is reported from User.findOne: %j', err);
            fn(defaultError);
          }

          if (user) {
            user.hasPassword(credentials.oldPassword, function (err, isMatch) {
              if (err) {
                debug('An error is reported from User.hasPassword: %j', err);
                fn(defaultError);
              }

              if (isMatch) {
                user.password = credentials.newPassword;
                user.save(function(err) {
                  if (err) {
                    fn(err);
                  } else {
                    fn();
                  }
                });
              } else {
                debug('The password is invalid for user %s', user.username);
                fn(defaultError);
              }
            });
          } else {
            debug('No matching record is found for user id %s', credentials.id);
            fn(defaultError);
          }
        });
      } else {
        fn(new Error('找不到访问令牌！'));
      }
    });


  }

  /*!
   * Setup an extended user model.
   */

  User.setup = function () {
    // We need to call the base class's setup method
    User.base.setup.call(this);
    var UserModel = this;

    // max ttl
    this.settings.maxTTL = this.settings.maxTTL || DEFAULT_MAX_TTL;
    this.settings.ttl = DEFAULT_TTL;

    UserModel.definition.rawProperties.created.default =
      UserModel.definition.properties.created.default = function() {
        return new Date();
      };
    UserModel.definition.rawProperties.modified.default =
      UserModel.definition.properties.modified.default = function() {
        return new Date();
      };
    UserModel.beforeUpdate = function (next, modelInstance) {
      modelInstance.modified = new Date();
      next();
    };

    UserModel.setter.password = function (plain) {
      var salt = bcrypt.genSaltSync(this.constructor.settings.saltWorkFactor || SALT_WORK_FACTOR);
      this.$password = bcrypt.hashSync(plain, salt);
    };

    loopback.remoteMethod(
      UserModel.login,
      {
        description: 'Login a user with username/email and password',
        accepts: [
          {arg: 'credentials', type: 'object', required: true, http: {source: 'body'}},
          {
            arg: 'include', type: 'string', http: {source: 'query'},
            description: 'Related objects to include in the response. ' +
            'See the description of return value for more details.'
          }
        ],
        returns: {
          arg: 'accessToken', type: 'object', root: true,
          description: 'The response body contains properties of the AccessToken created on login.\n' +
          'Depending on the value of `include` parameter, the body may contain ' +
          'additional properties:\n\n' +
          '  - `user` - `{User}` - Data of the currently logged in user. (`include=user`)\n\n'
        },
        http: {verb: 'post'}
      }
    )

    loopback.remoteMethod(
      UserModel.logout,
      {
        description: 'Logout a user with access token',
        accepts: [
          {
            arg: 'access_token', type: 'string', required: true, http: function (ctx) {
            var req = ctx && ctx.req;
            var accessToken = req && req.accessToken;
            var tokenID = accessToken && accessToken.id;

            return tokenID;
          }, description: 'Do not supply this argument, it is automatically extracted ' +
          'from request headers.'
          }
        ],
        http: {verb: 'all'}
      }
    );

    loopback.remoteMethod(
      UserModel.register,
      {
        description: 'Register a user with username/email and password',
        accepts: [
          {arg: 'registration', type: 'object', required: true, http: {source: 'body'}},
        ],
        returns: {
          arg: 'user', type: 'object', root: true,
          description: 'The response body contains properties of the user that registered'
        },
        http: {verb: 'post'}
      }
    );

    loopback.remoteMethod(
      UserModel.changePassword,
      {
        description: 'Change password for a authenticated user by with the given `credentials`.',
        accepts: [
          {
            arg: 'access_token', type: 'string', required: true, http: function (ctx) {
            var req = ctx && ctx.req;
            var accessToken = req && req.accessToken;
            var tokenID = accessToken && accessToken.id;

            return tokenID;
          }, description: 'Do not supply this argument, it is automatically extracted ' +
          'from request headers.'
          },
          {arg: 'credentials', type: 'object', required: true, http: {source: 'body'}},
        ],
        http: {verb: 'post'}
      }
    );

    if (!(UserModel.settings.username || UserModel.settings.email)) {
      UserModel.validatesUniquenessOf('username', {message: '该用户已存在'});
      UserModel.validatesUniquenessOf('email', {message: '该用户已存在'});
    }

    return UserModel;
  };

  User.setup();
}
