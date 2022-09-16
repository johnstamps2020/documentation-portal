const EntitySchema = require('typeorm').EntitySchema;

module.exports = new EntitySchema({
  name: 'Item',
  columns: {
    itemId: {
      primary: true,
      generated: true,
      unique: true,
      type: 'uuid',
    },
    class: {
      type: 'varchar',
    },
    label: {
      type: 'varchar',
    },
    id: {
      type: 'varchar',
    },
    page: {
      type: 'varchar',
    },
    link: {
      type: 'varchar',
    },
  },
});
