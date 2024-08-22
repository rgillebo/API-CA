module.exports = (sequelize, Sequelize) => {
	const Status = sequelize.define(
		'Status',
		{
			status: {
				type: Sequelize.DataTypes.STRING,

				allowNull: false,
			},
		},
		{
			timestamps: false,
		});

		Status.associate = function (models) {
			Status.hasMany(models.Todo, { foreignKey: { allowNull: false } });

		};

	return Status;
};

