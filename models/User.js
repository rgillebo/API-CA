module.exports = (sequelize, Sequelize) => {
	const User = sequelize.define(
		'User',
		{
			name: {
				type: Sequelize.DataTypes.STRING,

				allowNull: false,
			},

			email: {
				type: Sequelize.DataTypes.STRING,
				allowNull: false,
				unique: true,
				validate: {
				  isEmail: true,
				},
			  },
			  
			encryptedPassword: {
				type: Sequelize.DataTypes.BLOB,

				allowNull: false,
			},

			salt: {
				type: Sequelize.DataTypes.BLOB,

				allowNull: false,
			},
		},
		{
			timestamps: false,
		}
	);

	User.associate = function (models) {
		User.hasMany(models.Todo, { foreignKey: { allowNull: false } });
		User.hasMany(models.Category, { foreignKey: { allowNull: false } });
	};

	return User;
};

