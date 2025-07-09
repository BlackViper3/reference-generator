import { useSelector } from "react-redux";
import { createAuthorsList } from "./Utils";

const ReferenceScreen = () => {
  const references = useSelector((state: any) => state.reference);

  const populateJournal = (ref) => {
    let metadata = ref.metadata;
    let authorString = createAuthorsList(metadata.author);
    let doi = `https://doi.org/${metadata.doi}`;

    return (
      <p>
        <strong>{authorString}</strong> ({metadata.issued.year})
        <em>{metadata.title}</em>. <em>{metadata.containerTitle}</em>,{" "}
        <strong>{metadata.volume}</strong>({metadata.issue}), pp.{" "}
        {metadata.page}.
        <br />
        <a href={doi} target="_blank">
          {doi}
        </a>
      </p>
    );
  };

  const populateBook = (ref) => {
    let metadata = ref.metadata;
    let authorString = createAuthorsList(metadata.author);
    let url = metadata.url;
    let date = new Date();
    let formattedDate = date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    return (
      <p>
        <strong>{authorString}</strong> ({metadata.issued.year})
        <em>{metadata.title}</em>.<strong>{metadata.publisherPlace}: </strong>(
        {metadata.publisher}).{" "}
      </p>
    );
  };

  const populateWebsite = (ref) => {
    let metadata = ref.metadata;
    let url = metadata.url;
    let date = new Date();
    let formattedDate = date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    return (
      <p>
        <strong>{metadata.title}</strong> ({metadata.issued.year})
        <em>{metadata.title}</em>. <em>{metadata.containerTitle}</em>, .
        Available at:
        <a href={url} target="_blank">
          {url}
        </a>{" "}
        (Accessed: {formattedDate}).
      </p>
    );
  };
  const renderReferences = () => {
    
    const allReferenceCards = [];

    for (const [sectionKey, section] of Object.entries(references)) {
      
      const entriesArray = Object.entries(section.entries);
      if (entriesArray.length === 0) continue;

      allReferenceCards.push(
        <div key={sectionKey}>
          <h2 className="text-xl font-bold mb-2">{section.name}</h2>
          {entriesArray.map(([entryId, reference]) => (
            <div className="card w-96 card-sm shadow-sm mb-2" key={entryId}>
              <div className="card-body">
                <h3 className="card-title">{reference.metadata.title}</h3>
                <div>
                  {reference.type === "Journal" && populateJournal(reference)}
                  {reference.type === "Website" && populateWebsite(reference)}
                  {reference.type === "Book" && populateBook(reference)}
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    return allReferenceCards;
  };

  return <div>{renderReferences()}</div>;
};

export default ReferenceScreen;
