module.exports = function(Asset) {

    Asset.setup = function () {
        // We need to call the base class's setup method
        Asset.base.setup.call(this);
        var UserModel = this;

        //UserModel.afterInitialize = function (next, modelInstance) {
        //  console.log("Asset after Initialize");
        //  next();
        //};

        UserModel.beforeValidate = function (next, modelInstance) {
            console.log("Asset before Validate");
            next();
        };

        UserModel.afterValidate = function (next, modelInstance) {
            console.log("Asset after Validate");
            next();
        };

        UserModel.beforeSave = function (next, modelInstance) {
            console.log("Asset before Save");
            next();
        };

        UserModel.afterSave = function (next, modelInstance) {
            console.log("Asset after Save");
            next();
        };

        UserModel.beforeCreate = function (next, modelInstance) {
            console.log("Asset before Create");
            next();
        };

        UserModel.beforeCreate = function (next, modelInstance) {
            console.log("Asset after Create");
            next();
        };

        UserModel.beforeUpdate = function (next, modelInstance) {
            modelInstance.modified = new Date();
            console.log("Asset before Update");
            next();
        };

        UserModel.beforeCreate = function (next, modelInstance) {
            console.log("Asset after Update");
            next();
        };

        UserModel.beforeDestroy = function (next, modelInstance) {
            console.log("Asset before Destroy");
            next();
        };

        UserModel.afterDestroy = function (next, modelInstance) {
            console.log("Asset after Destroy");
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
            UserModel.validatesUniquenessOf('name', {message: '该已存在'});
        }

        return UserModel;
    };

    Asset.setup();

};
