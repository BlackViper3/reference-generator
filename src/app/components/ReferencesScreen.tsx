import { useSelector } from "react-redux";
import { createAuthorsList } from "./Utils";
import { useState, useEffect, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import update from "immutability-helper";

const ItemType = "REFERENCE_CARD";

const ReferenceCard = ({ id, index, reference, moveCard }) => {
  const ref = useRef(null);

  const [, drop] = useDrop({
    accept: ItemType,
    hover(item) {
      if (!ref.current || item.index === index) return;
      moveCard(item.index, index);
      item.index = index;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  const opacity = isDragging ? 0.4 : 1;

  const populateJournal = () => {
    const metadata = reference.metadata;
    const authorString = createAuthorsList(metadata.author);
    const doi = `https://doi.org/${metadata.doi}`;
    return (
      <p>
        <strong>{authorString}</strong> ({metadata.issued.year}){" "}
        <em>{metadata.title}</em>. <em>{metadata.containerTitle}</em>,{" "}
        <strong>{metadata.volume}</strong>({metadata.issue}), pp. {metadata.page}.<br />
        <a href={doi} target="_blank">{doi}</a>
      </p>
    );
  };

  const populateBook = () => {
    const metadata = reference.metadata;
    const authorString = createAuthorsList(metadata.author);
    return (
      <p>
        <strong>{authorString}</strong> ({metadata.issued.year}){" "}
        <em>{metadata.title}</em>. <strong>{metadata.publisherPlace}: </strong>
        {metadata.publisher}.
      </p>
    );
  };

  const populateWebsite = () => {
    const metadata = reference.metadata;
    const url = metadata.url;
    const date = new Date();
    const formattedDate = date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    return (
      <p>
        <strong>{metadata.title}</strong> ({metadata.issued.year}){" "}
        <em>{metadata.title}</em>. <em>{metadata.containerTitle}</em>. Available at:{" "}
        <a href={url} target="_blank">{url}</a> (Accessed: {formattedDate}).
      </p>
    );
  };

  return (
    <div
      ref={ref}
      style={{ opacity }}
      className="card w-96 card-sm shadow-sm mb-2 bg-white p-4"
    >
      <div className="card-body">
        <h3 className="card-title">{reference.metadata.title}</h3>
        {reference.type === "Journal" && populateJournal()}
        {reference.type === "Website" && populateWebsite()}
        {reference.type === "Book" && populateBook()}
      </div>
    </div>
  );
};

const ReferenceScreen = () => {
  const referencesFromStore = useSelector((state: any) => state.reference);
  const [cards, setCards] = useState([]);

  useEffect(() => {
    // Flatten all references into a single array for ordering
    const flat = [];
    for (const section of Object.values(referencesFromStore)) {
      for (const [entryId, ref] of Object.entries(section.entries)) {
        flat.push({ id: entryId, ...ref });
      }
    }
    setCards(flat);
  }, [referencesFromStore]);

  const moveCard = (from, to) => {
    setCards((prevCards) =>
      update(prevCards, {
        $splice: [
          [from, 1],
          [to, 0, prevCards[from]],
        ],
      })
    );
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">References</h2>
      {cards.map((card, index) => (
        <ReferenceCard
          key={card.id}
          id={card.id}
          index={index}
          reference={card}
          moveCard={moveCard}
        />
      ))}
    </div>
  );
};

export default ReferenceScreen;
