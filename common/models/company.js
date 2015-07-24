module.exports = function(Company) {

  Company.setup = function () {
    // We need to call the base class's setup method
    Company.base.setup.call(this);
    var UserModel = this;

    //UserModel.afterInitialize = function (next, modelInstance) {
    //  console.log("Company after Initialize");
    //  next();
    //};

    UserModel.beforeValidate = function (next, modelInstance) {
      console.log("Company before Validate");
      next();
    };

    UserModel.afterValidate = function (next, modelInstance) {
      console.log("Company after Validate");
      next();
    };

    UserModel.beforeSave = function (next, modelInstance) {
      console.log("Company before Save");
      next();
    };

    UserModel.afterSave = function (next, modelInstance) {
      console.log("Company after Save");
      next();
    };

    UserModel.beforeCreate = function (next, modelInstance) {
      console.log("Company before Create");
      next();
    };

    UserModel.beforeCreate = function (next, modelInstance) {
      console.log("Company after Create");
      next();
    };

    UserModel.beforeUpdate = function (next, modelInstance) {
      modelInstance.modified = new Date();
      console.log("Company before Update");
      next();
    };

    UserModel.beforeCreate = function (next, modelInstance) {
      console.log("Company after Update");
      next();
    };

    UserModel.beforeDestroy = function (next, modelInstance) {
      console.log("Company before Destroy");
      next();
    };

    UserModel.afterDestroy = function (next, modelInstance) {
      console.log("Company after Destroy");
      next();
    };

    UserModel.definition.rawProperties.created.default =
      UserModel.definition.properties.created.default = function() {
        return new Date();
      };
    UserModel.definition.rawProperties.modified.default =
      UserModel.definition.properties.modified.default = function() {
        return new Date();
      };

    if (!(UserModel.settings.name)) {
      UserModel.validatesUniquenessOf('name', {message: '该公司已存在'});
    }

    return UserModel;
  };

  Company.setup();

};
