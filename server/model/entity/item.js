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
      type: 'string',
    },
    label: {
      type: 'string',
    },
    id: {
      type: 'string',
    },
    page: {
      type: 'string',
    },
    link: {
      type: 'string',
    },
  },
});
