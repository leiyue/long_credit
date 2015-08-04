module.exports = function(Credit) {

    Credit.setup = function () {
        // We need to call the base class's setup method
        Credit.base.setup.call(this);
        var UserModel = this;

        //UserModel.afterInitialize = function (next, modelInstance) {
        //  console.log("Credit after Initialize");
        //  next();
        //};

        UserModel.beforeValidate = function (next, modelInstance) {
            console.log("Credit before Validate");
            next();
        };

        UserModel.afterValidate = function (next, modelInstance) {
            console.log("Credit after Validate");
            next();
        };

        UserModel.beforeSave = function (next, modelInstance) {
            console.log("Credit before Save");
            next();
        };

        UserModel.afterSave = function (next, modelInstance) {
            console.log("Credit after Save");
            next();
        };

        UserModel.beforeCreate = function (next, modelInstance) {
            console.log("Credit before Create");
            next();
        };

        UserModel.beforeCreate = function (next, modelInstance) {
            console.log("Credit after Create");
            next();
        };

        UserModel.beforeUpdate = function (next, modelInstance) {
            modelInstance.modified = new Date();
            console.log("Credit before Update");
            next();
        };

        UserModel.beforeCreate = function (next, modelInstance) {
            console.log("Credit after Update");
            next();
        };

        UserModel.beforeDestroy = function (next, modelInstance) {
            console.log("Credit before Destroy");
            next();
        };

        UserModel.afterDestroy = function (next, modelInstance) {
            console.log("Credit after Destroy");
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

    Credit.setup();

};
