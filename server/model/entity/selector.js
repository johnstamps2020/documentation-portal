const EntitySchema = require('typeorm').EntitySchema;

module.exports = new EntitySchema({
  name: 'Selector',
  columns: {
    selectorId: {
      primary: true,
      generated: true,
      unique: true,
      type: 'uuid',
    },
    label: {
      type: 'varchar',
    },
    class: {
      type: 'varchar',
    },
  },
  relations: {
    selectedItem: {
      target: 'Item',
      type: 'one-to-many',
      joinTable: true,
      cascade: true,
    },
    items: {
      target: 'Item',
      type: 'one-to-many',
      joinTable: true,
      cascade: true,
    },
  },
});
