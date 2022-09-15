const EntitySchema = require('typeorm').EntitySchema;

module.exports = new EntitySchema({
  name: 'Page',
  columns: {
    url: {
      primary: true,
      type: 'string',
    },
    title: {
      type: 'string',
    },
    template: {
      type: 'string',
    },
    class: {
      type: 'string',
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
