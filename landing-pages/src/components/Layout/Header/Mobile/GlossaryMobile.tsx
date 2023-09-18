import ItemListMobile from './ItemListMobile';

export default function GlossaryMobile() {
  return (
    <ItemListMobile
      title="Glossary"
      items={[
        {
          href: '/glossary',
          children: 'Guidewire Glossary',
        },
      ]}
    />
  );
}
