"use strict";

const { Model } = require("@sequelize/core");

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
            name: {
                allowNull: false,
                type: DataTypes.STRING,
            },
            platform: {
                allowNull: false,
                type: DataTypes.STRING,
            },
            description: {
                type: DataTypes.STRING,
            },
            source: {
                type: DataTypes.STRING,
            },
            home: {
                type: DataTypes.STRING,
            },
            license: {
                type: DataTypes.STRING,
            },
            createdAt: {
                allowNull: false,
                type: DataTypes.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: DataTypes.DATE,
            },
        },
        {
            sequelize,
            modelName: "Package",
        }
    );

    return Package;
};
