"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Package extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Package.hasMany(models.PackageVersion, {
                foreignKey: "packageID",
            });
        }
    }

    Package.init(
        {
            name: { allowNull: false, type: DataTypes.STRING },
            description: { type: DataTypes.STRING },
        },
        {
            sequelize,
            modelName: "Package",
        }
    );

    return Package;
};
