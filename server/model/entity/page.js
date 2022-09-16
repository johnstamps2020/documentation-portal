const EntitySchema = require('typeorm').EntitySchema;

module.exports = new EntitySchema({
  name: 'Page',
  columns: {
    url: {
      primary: true,
      type: 'varchar',
    },
    title: {
      type: 'varchar',
    },
    template: {
      type: 'varchar',
    },
    class: {
      type: 'varchar',
    },
    includeInBreadcrumbs: {
      type: 'boolean',
    },
    search_filters: {
      type: 'simple-json',
    },
  },
  relations: {
    items: {
      target: 'Item',
      type: 'one-to-many',
      joinTable: true,
      cascade: true,
    },
  },
});
