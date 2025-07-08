import { useSelector } from "react-redux";

const ReferenceScreen = () => {
  const references = useSelector((state: any) => state.reference);

  const populateJournal = (ref) => {
    let metadata = ref.metadata;

    let singleAuthor = true;
    let authorString = "";
    for (const author in metadata.authors) {
      if (!singleAuthor) authorString += " and ";
      singleAuthor = false;
      authorString += author.family;
      if (author.given) {
        authorString += author.given.charAt(0);
      }
    }
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

    for (const sectionKey in references) {
      const section = references[sectionKey];
      for (const entryId in section.entries) {
        const reference = section.entries[entryId];

        allReferenceCards.push(
          <div className="card w-96  card-sm shadow-sm" key={entryId}>
            <div className="card-body">
              <h2 className="card-title">{reference.metadata.title}</h2>
              <div>
                {reference.type === "Journal" && populateJournal(reference)}
                {reference.type === "Website" && populateWebsite(reference)}
              </div>
            </div>
          </div>
        );
      }
    }

    return allReferenceCards;
  };
  return <div>{renderReferences()}</div>;
};

export default ReferenceScreen;
