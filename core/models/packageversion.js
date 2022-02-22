"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class PackageVersion extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            PackageVersion.belongsTo(models.Package, {
                foreignKey: "packageID",
                onDelete: "CASCADE",
            });
        }
    }

    PackageVersion.init(
        {
            packageID: { allowNull: false, type: DataTypes.INTEGER },
            major: { allowNull: false, type: DataTypes.INTEGER },
            minor: { allowNull: false, type: DataTypes.INTEGER },
            patch: { allowNull: false, type: DataTypes.INTEGER },
            digest: { type: DataTypes.STRING },
        },
        {
            sequelize,
            modelName: "PackageVersion",
        }
    );

    return PackageVersion;
};
