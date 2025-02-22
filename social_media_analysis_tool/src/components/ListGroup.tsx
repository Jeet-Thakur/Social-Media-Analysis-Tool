import { Fragment } from "react/jsx-runtime";

function ListGroup() {
  const items = ["new york", "neyveli", "new zealand", "nigeria"];

  return (
    <Fragment>
      <h1>chicken</h1>
      <ul className="list-group">
        {items.map((item) => (
          <li className="list-group-item">{item}</li>
        ))}
      </ul>
    </Fragment>
  );
}

export default ListGroup;
