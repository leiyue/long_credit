module.exports = function(Product) {

  Product.setup = function () {
    // We need to call the base class's setup method
    Product.base.setup.call(this);
    var UserModel = this;

    //UserModel.afterInitialize = function (next, modelInstance) {
    //  console.log("Product after Initialize");
    //  next();
    //};

    UserModel.beforeValidate = function (next, modelInstance) {
      console.log("Product before Validate");
      next();
    };

    UserModel.afterValidate = function (next, modelInstance) {
      console.log("Product after Validate");
      next();
    };

    UserModel.beforeSave = function (next, modelInstance) {
      console.log("Product before Save");
      next();
    };

    UserModel.afterSave = function (next, modelInstance) {
      console.log("Product after Save");
      next();
    };

    UserModel.beforeCreate = function (next, modelInstance) {
      console.log("Product before Create");
      next();
    };

    UserModel.beforeCreate = function (next, modelInstance) {
      console.log("Product after Create");
      next();
    };

    UserModel.beforeUpdate = function (next, modelInstance) {
      modelInstance.modified = new Date();
      console.log("Product before Update");
      next();
    };

    UserModel.beforeCreate = function (next, modelInstance) {
      console.log("Product after Update");
      next();
    };

    UserModel.beforeDestroy = function (next, modelInstance) {
      console.log("Product before Destroy");
      next();
    };

    UserModel.afterDestroy = function (next, modelInstance) {
      console.log("Product after Destroy");
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
      UserModel.validatesUniquenessOf('name', {message: '该产品已存在'});
    }

    return UserModel;
  };

  Product.setup();
};
