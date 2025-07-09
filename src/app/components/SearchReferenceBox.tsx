"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChangeEvent, useCallback, useEffect } from "react";
import axios from "axios";
import { useImmer, useImmerReducer } from "use-immer";
import { useSelector, useDispatch } from "react-redux";
import { addReference } from "../../features/references/referenceSlice";
import { createAuthorsList } from "./Utils";
const SearchReferenceBox = () => {
  const searchTypes = ["Journal", "Website", "Book"];
  const searchTypeToSourceId = {
    Website: "webpage",
    Journal: "article_journal",
    Book: "book",
  };

  const [searchQuery, updateSearchQuery] = useImmer({
    searchString: "",
    limit: 10,
    searchType: "Journal",
  });
  const [currentSection, setCurrentSection] = useImmer("Introduction");

  const [searchResults, updateSearchResults] = useImmer([]);
  const [showSearchResults, updateShowSearchResults] = useImmer(false);
  const [error, setError] = useImmer("");

  const [displayResult, setDisplayResult] = useImmer(false);

  const dispatch = useDispatch();

  const handleResultSelection = (e, result) => {
    // result = { ...result, id: references.length + 1 };

    const dataToAdd = {
      name: currentSection,
      type: searchQuery.searchType,
      ...result,
    };
    dispatch(addReference(dataToAdd));
    clearSearchResults();
  };

  const clearSearchResults = () => {
    updateSearchResults([]);
    updateShowSearchResults(false);
    updateSearchQuery((draft) => {
      draft["searchString"] = "";
    });
  };

  const validateSearchString = (searchQuery: any) => {
    const trimmed = searchQuery.searchString && searchQuery.searchString.trim();
    const urlPattern = /^(https?:\/\/[^\s]+)$/i;
    if (trimmed.length === 0) {
      setError("Search query is empty");
      return false;
    }
    if (searchQuery.searchType === "Website") {
      if (!urlPattern.test(searchQuery.searchString)) {
        setError("Only valid http:// or https:// URLs are allowed.");
        return false;
      }
      return true;
    } else {
      if (urlPattern.test(searchQuery.searchString)) {
        setError("Use Website for  http:// or https:// URLs.");
        return false;
      }
      const sanitized = trimmed.replace(/<\/?[^>]+(>|$)/g, "");

      updateSearchQuery((draft) => {
        draft["searchString"] = sanitized;
      });
      return true;
    }

    return false;
  };

  const searchForReferences = (e) => {
    e.preventDefault();
    if (validateSearchString(searchQuery)) {
      const sourceId = searchTypeToSourceId[searchQuery.searchType];
      const searchQueryString = encodeURIComponent(searchQuery.searchString);
      const searchUrl = `/api/autocite/search?q=${searchQueryString}&sourceId=${sourceId}`;
      axios.get(searchUrl).then((response) => {
        if (response.status === 200 && response.data.status === "ok") {
          updateSearchResults(response.data.results);
          updateShowSearchResults(true);
        }
      });
    }
  };
  const handleSearchQueryChange = (e: ChangeEvent<HTMLInputElement>): void => {
    {
      updateSearchQuery((draft) => {
        draft[e.target.name] = e.target.value;
      });
      setError("");
    }
  };

  const renderSearchTypes = searchTypes.map((searchType) => {
    return (
      <div className="inline px-3" key={searchTypes.indexOf(searchType)}>
        <input
          type="radio"
          id={searchType}
          className="radio radio-xs radio-primary"
          name="searchType"
          value={searchType}
          onChange={(e) => handleSearchQueryChange(e)}
          defaultChecked={searchType === "Journal"}
        />
        <label htmlFor={searchType} className="text-xl">
          {searchType}
        </label>
      </div>
    );
  });

  const populateJournalSearchResult = (ref) => {
    let metadata = ref.metadata;

    let authorString = createAuthorsList(metadata.author);
    return (
      <p>
        <em>By </em>
        <span>{authorString}</span> <em>| Year: </em>{" "}
        <span>{metadata.issued.year} </span>
        <em>| Container: </em> <span>{metadata.containerTitle} </span>
        <em>| Volume: </em> <span>{metadata.volume} </span>
        <em>| Issue: </em> <span>{metadata.issue} </span>
        <em>| Page: </em> <span>{metadata.page} </span>
        <em>| DOI: </em> <span>{metadata.doi} </span>
      </p>
    );
  };

  const populateBookSearchResult = (ref) => {
    let metadata = ref.metadata;
    let authorString = createAuthorsList(metadata.author);
    return (
      <p>
        <em>By </em>
        <span>{authorString}</span> <em>| Year: </em>{" "}
        <span>{metadata.issued.year} </span>
        <em>| Publisher: </em> <span>{metadata.publisher} </span>
        <em>| Publisher Place: </em> <span>{metadata.publisherPlace} </span>
        <em>| ISBN: </em> <span>{metadata.isbn} </span>
      </p>
    );
  };

  const populateWebsiteSearchResult = (ref) => {
    let metadata = ref.metadata;
    let authorString = createAuthorsList(metadata.author);
    return (
      <p>
        <em>By </em>
        <span>{authorString}</span> <em>| Container: </em>{" "}
        <span>{metadata.containerTitle}</span>
        <em>| URL: </em> <span>{metadata.url}</span>
      </p>
    );
  };

  const renderSearchResults =
    searchResults != null &&
    searchResults.map((result) => {
      const formattedResult =
        searchQuery.searchType === "Journal"
          ? populateJournalSearchResult(result)
          : searchQuery.searchType === "Book"
          ? populateBookSearchResult(result)
          : searchQuery.searchType === "Website"
          ? populateWebsiteSearchResult(result)
          : "";
      return (
        <li className="inline px-3" key={result.rv}>
          <div className="hover:bg-gray-200">
            <h2
              role="button"
              onClick={(e) => handleResultSelection(e, result)}
              className=""
            >
              {result?.metadata?.title}
            </h2>
            {formattedResult}
          </div>
        </li>
      );
    });

  return (
    <div>
      <div className="flex-row items-center">
        <fieldset>
          <legend>Select Reference type :</legend>
          {renderSearchTypes}
        </fieldset>
      </div>
      <div className="flex items-center">
        <input
          type="text"
          name="searchString"
          placeholder="Enter Search String"
          onChange={(e) => handleSearchQueryChange(e)}
          value={searchQuery.searchString}
          className="border-2 rounded-xs border-s-violet-300 m-3 px-1"
        />

        <div className="solid rounded bg-blue-400 p-1 ">
          <button
            className="form-icon-search "
            type="button"
            value="Search"
            name="search"
            popoverTarget="popover-1"
            tabIndex={0}
            role="button"
            onClick={(e) => searchForReferences(e)}
          >
            Search
          </button>
        </div>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {searchResults?.length > 0 && showSearchResults && (
        <div>
          <ul className="rounded-box z-1 w-100  p-2 shadow-sm ">
            {renderSearchResults}
          </ul>
        </div>
      )}
    </div>
  );
};
export default SearchReferenceBox;
function validateSearchString(searchString: string) {
  throw new Error("Function not implemented.");
}
