module.exports = function(Category) {

  Category.setup = function () {
    // We need to call the base class's setup method
    Category.base.setup.call(this);
    var UserModel = this;

    //UserModel.afterInitialize = function (next, modelInstance) {
    //  console.log("Category after Initialize");
    //  next();
    //};

    UserModel.beforeValidate = function (next, modelInstance) {
      console.log("Category before Validate");
      next();
    };

    UserModel.afterValidate = function (next, modelInstance) {
      console.log("Category after Validate");
      next();
    };

    UserModel.beforeSave = function (next, modelInstance) {
      console.log("Category before Save");
      next();
    };

    UserModel.afterSave = function (next, modelInstance) {
      console.log("Category after Save");
      next();
    };

    UserModel.beforeCreate = function (next, modelInstance) {
      console.log("Category before Create");
      next();
    };

    UserModel.beforeCreate = function (next, modelInstance) {
      console.log("Category after Create");
      next();
    };

    UserModel.beforeUpdate = function (next, modelInstance) {
      modelInstance.modified = new Date();
      console.log("Category before Update");
      next();
    };

    UserModel.beforeCreate = function (next, modelInstance) {
      console.log("Category after Update");
      next();
    };

    UserModel.beforeDestroy = function (next, modelInstance) {
      console.log("Category before Destroy");
      next();
    };

    UserModel.afterDestroy = function (next, modelInstance) {
      console.log("Category after Destroy");
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
      UserModel.validatesUniquenessOf('name', {message: '该分类已存在'});
    }

    return UserModel;
  };

  Category.setup();

};
