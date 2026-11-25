export default function DisplayList({ itens, Element }) {
  return (
    <section className="grid-list">
      {itens.map((item) => {
        return <Element key={item.id} data={item} />;
      })}
    </section>
  );
}
