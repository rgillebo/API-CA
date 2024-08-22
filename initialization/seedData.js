const { Status } = require('../models');

//Seed statuses to the database if they do not already exist.
 async function seedStatuses() {
  const statuses = [
    { status: 'Not Started' },
    { status: 'Started' },
    { status: 'Completed' },
    { status: 'Deleted' }
  ];

  for (const status of statuses) {
    const [statusInstance, created] = await Status.findOrCreate({
      where: { status: status.status },
      defaults: status,
    });

    if (created) {
      console.log(`Status '${status.status}' added to the database.`);
    } else {
      console.log(`Status '${status.status}' already exists in the database.`);
    }
  }
}

module.exports = { seedStatuses };
