import { useSelector } from "react-redux";
import { createAuthorsList } from "./Utils";
import { useState, useEffect, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import update from "immutability-helper";
import { convert } from "html-to-text";

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
        [{index + 1}]<strong>{authorString}</strong> ({metadata.issued.year}){" "}
        <em>{metadata.title}</em>. <em>{metadata.containerTitle}</em>,{" "}
        <strong>{metadata.volume}</strong>({metadata.issue}), pp.{" "}
        {metadata.page}.<br />
        <a href={doi} target="_blank">
          {doi}
        </a>
      </p>
    );
  };

  const populateBook = () => {
    const metadata = reference.metadata;
    const authorString = createAuthorsList(metadata.author);
    return (
      <p>
        [{index + 1}]<strong>{authorString}</strong> ({metadata.issued.year}){" "}
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
        [{index + 1}]<strong>{metadata.title}</strong> ({metadata.issued.year}){" "}
        <em>{metadata.title}</em>. <em>{metadata.containerTitle}</em>. Available
        at:{" "}
        <a href={url} target="_blank">
          {url}
        </a>{" "}
        (Accessed: {formattedDate}).
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
  const [renderedCards, setRenderedCards] = useState([]);

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

  const exportToTxtFile = () => {
    const referenceNode = document.getElementById("references");
    if (!referenceNode) return;

    const options = {
      wordwrap: false,
      selectors: [
        { selector: "a", options: { ignoreHref: true } },
        { selector: "strong", format: "inline" },
        { selector: "em", format: "inline" },
        { selector: "h3", format: "skip" }, // skip titles
      ],
      format: {
        paragraph: (elem, walk, builder) => {
          builder.openBlock({ leadingLineBreaks: 1 });
          walk(elem.children, builder);
          builder.closeBlock({ trailingLineBreaks: 2 });
        },
      },
    };

    const text = convert(referenceNode.innerHTML, options);

    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "references.txt";
    a.click();

    URL.revokeObjectURL(url); // Clean up
  };
  const copyRefToClipboard = () => {
    const referenceNode = document.getElementById("references");
    if (!referenceNode) return;

    const options = {
      wordwrap: false,
      selectors: [
        { selector: "a", options: { ignoreHref: true } },
        { selector: "strong", format: "inline" },
        { selector: "em", format: "inline" },
        { selector: "h3", format: "skip" },
      ],
      format: {
        paragraph: (elem, walk, builder) => {
          builder.openBlock({ leadingLineBreaks: 1 });
          walk(elem.children, builder);
          builder.closeBlock({ trailingLineBreaks: 2 });
        },
      },
    };

    const copyText = convert(referenceNode.innerHTML, options);
    navigator.clipboard.writeText(copyText).then(() => {
      console.log("Copied:\n", copyText);
    });
  };
  return (
    <div className="p-4">
      <div className="flex m-2">
        <div className="solid rounded bg-amber-100 m-2 p-1 ">
          <button
            className="form-icon-copy"
            type="button"
            value="Copy to Clipboard"
            name="Copy to Clipboard"
            role="button"
            onClick={(e) => copyRefToClipboard(e)}
          >
            Copy to clipboard
          </button>
        </div>
        <div className="solid rounded bg-amber-100 m-2 p-1 ">
          <button
            className="form-icon-copy"
            type="button"
            value="Download as txt"
            name="Download as txt"
            role="button"
            onClick={(e) => exportToTxtFile(e)}
          >
            Download as Txt file
          </button>
        </div>
      </div>
      <h2 className="text-xl font-bold mb-4">References</h2>
      <div id="references">
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
    </div>
  );
};

export default ReferenceScreen;
