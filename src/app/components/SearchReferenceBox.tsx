"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChangeEvent, useCallback, useEffect } from "react";
import axios from "axios";
import { useImmer, useImmerReducer } from "use-immer";
import { useSelector, useDispatch } from "react-redux";
import { addReference } from "../../features/references/referenceSlice";
const SearchReferenceBox = () => {
  const searchTypes = ["Website", "Journal", "Paper"];
  const searchTypeToSourceId = {
    Website: "website",
    Journal: "article_journal",
    Paper: "paper",
  };

  const [searchQuery, updateSearchQuery] = useImmer({
    searchString: "",
    limit: 10,
    searchType: "Journal",
  });
  const [currentSection, setCurrentSection] = useImmer("Introduction");

  const [searchResults, updateSearchResults] = useImmer([]);
  const [error, setError] = useImmer("");

  const [displayResult, setDisplayResult] = useImmer(false);

  const references = useSelector((state: any) => state.reference.value);
  const dispatch = useDispatch();

  const handleResultSelection = (e, result) => {
    // result = { ...result, id: references.length + 1 };

    const dataToAdd = {
      name: currentSection,
      type: searchQuery.searchType,
      ...result,
    };
    dispatch(addReference(dataToAdd));
    // handleAdd(result);
  };

  const validateSearchString = (searchQuery: any) => {
    const trimmed = searchQuery.searchString && searchQuery.searchString.trim();

    if (trimmed.length === 0) {
      setError("Search query is empty");
      return false;
    }
    if (searchQuery.searchType === "Website") {
      const urlPattern = /^(https?:\/\/[^\s]+)$/i;
      if (urlPattern.test(searchQuery.searchString)) {
        setError("Only valid http:// or https:// URLs are allowed.");
        return false;
      }
    } else {
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
          value={searchQuery.searchType}
          onChange={(e) => handleSearchQueryChange(e)}
          defaultChecked={searchType === "Journal"}
        />
        <label htmlFor={searchType} className="text-xl">
          {searchType}
        </label>
      </div>
    );
  });

  const renderSearchResults =
    searchResults != null &&
    searchResults.map((result) => {
      return (
        <li className="inline px-3" key={result.rv}>
          <h2 role="button" onClick={(e) => handleResultSelection(e, result)}>
            {result?.metadata?.title}
          </h2>
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
          className="border-2 rounded-xs border-s-violet-300 m-3 px-1 form-icon-search"
        />

        <button
          className="solid rounded bg-blue-400 p-1"
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
      {error && <p style={{ color: "red" }}>{error}</p>}
      {searchResults?.length > 0 && (
        <div>
          <ul className="rounded-box z-1 w-100  p-2 shadow-sm">
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
