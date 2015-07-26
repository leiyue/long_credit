module.exports = function(Profession) {

    Profession.setup = function () {
        // We need to call the base class's setup method
        Profession.base.setup.call(this);
        var UserModel = this;

        //UserModel.afterInitialize = function (next, modelInstance) {
        //  console.log("Profession after Initialize");
        //  next();
        //};

        UserModel.beforeValidate = function (next, modelInstance) {
            console.log("Profession before Validate");
            next();
        };

        UserModel.afterValidate = function (next, modelInstance) {
            console.log("Profession after Validate");
            next();
        };

        UserModel.beforeSave = function (next, modelInstance) {
            console.log("Profession before Save");
            next();
        };

        UserModel.afterSave = function (next, modelInstance) {
            console.log("Profession after Save");
            next();
        };

        UserModel.beforeCreate = function (next, modelInstance) {
            console.log("Profession before Create");
            next();
        };

        UserModel.beforeCreate = function (next, modelInstance) {
            console.log("Profession after Create");
            next();
        };

        UserModel.beforeUpdate = function (next, modelInstance) {
            modelInstance.modified = new Date();
            console.log("Profession before Update");
            next();
        };

        UserModel.beforeCreate = function (next, modelInstance) {
            console.log("Profession after Update");
            next();
        };

        UserModel.beforeDestroy = function (next, modelInstance) {
            console.log("Profession before Destroy");
            next();
        };

        UserModel.afterDestroy = function (next, modelInstance) {
            console.log("Profession after Destroy");
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

    Profession.setup();

};
