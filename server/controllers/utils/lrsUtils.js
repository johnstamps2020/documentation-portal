const recordTemplate = {
  actor: {
    name: 'Sam Person',
    mbox: 'mailto:sperson@guidewire.com',
  },
  verb: {
    id: 'http://activitystrea.ms/schema/1.0/complete',
    display: { 'en-US': 'completed' },
  },
  object: {
    id: 'https://docs.guidewire.com/jutro/learning-prerequisites',
    definition: {
      type: 'https://docs.guidewire.com/expapi/activities/learning-mission',
      name: { 'en-US': 'Prerequisites' },
    },
  },
  result: {
    completion: true,
    success: true,
  },
  authority: {
    name: 'Test',
    mbox: 'mailto:test@guidewire.com',
  },
};

const recordVariables = [
  {
    actor: {
      name: 'Jane Someone',
      mbox: 'mailto:jsomeone@guidewire.com',
    },
  },
  {
    actor: {
      name: 'Suazee Whoever',
      mbox: 'mailto:swhoever@guidewire.com',
    },
  },
  {
    actor: {
      name: 'Piotrek Jakiś',
      mbox: 'mailto:pjakis@guidewire.com',
    },
  },
  {
    actor: {
      name: 'Piotrek Jakiś',
      mbox: 'mailto:pjakis@guidewire.com',
    },
    object: {
      id: 'https://docs.guidewire.com/jutro/learning-api',
      definition: {
        type: 'https://docs.guidewire.com/expapi/activities/learning-mission',
        name: { 'en-US': 'Use the Jutro API' },
      },
    },
  },
  {
    actor: {
      name: 'Polly Wight',
      mbox: 'mailto:pwight@guidewire.com',
    },
  },
  {
    actor: {
      name: 'Brad Humansky',
      mbox: 'mailto:bhumansky@guidewire.com',
    },
  },
  {
    actor: {
      name: 'Wyatt Earp',
      mbox: 'mailto:wyatt@partner.com',
    },
  },
  {
    actor: {
      name: 'Bill Hickok',
      mbox: 'mailto:bill@partner.com',
    },
  },
  {
    actor: {
      name: 'Martha Jane Cannary-Burke',
      mbox: 'mailto:jane.burke@customer.com',
    },
  },
  {
    actor: {
      name: 'William Bonney',
      mbox: 'mailto:billy.the.kid@customer.com',
    },
  },
];

function getSampleRecords() {
  return recordVariables.map(v => ({ ...recordTemplate, ...v }));
}

module.exports = { getSampleRecords };
