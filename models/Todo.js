module.exports = (sequelize, Sequelize) => {
    const Todo = sequelize.define(
        'Todo',
        {
            name: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
            },
            description: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
            },
            CategoryId: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false,
            },
            StatusId: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false,
            },
            UserId: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            timestamps: false,
        }
    );

    Todo.associate = function (models) {
        Todo.belongsTo(models.Category, { foreignKey: 'CategoryId', allowNull: false });
        Todo.belongsTo(models.Status, { foreignKey: 'StatusId', allowNull: false });
        Todo.belongsTo(models.User, { foreignKey: 'UserId', allowNull: false });
    };

    return Todo;
};
