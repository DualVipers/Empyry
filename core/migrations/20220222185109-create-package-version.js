"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("PackageVersions", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            packageID: {
                allowNull: false,
                type: Sequelize.INTEGER,
                onDelete: "CASCADE",
                references: {
                    model: "Packages",
                    key: "id",
                    as: "packageID",
                },
            },
            major: {
                allowNull: false,
                type: Sequelize.INTEGER,
            },
            minor: {
                allowNull: false,
                type: Sequelize.INTEGER,
            },
            patch: {
                allowNull: false,
                type: Sequelize.INTEGER,
            },
            digest: {
                type: Sequelize.STRING,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("PackageVersions");
    },
};
