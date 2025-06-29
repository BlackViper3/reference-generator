"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChangeEvent, useEffect } from "react";
import axios from "axios";
import { useImmer } from "use-immer";
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
    searchType: "Website",
  });
  const searchForReferences = (e) => {
    e.preventDefault();
    if (searchQuery.searchString) {
      const sourceId = searchTypeToSourceId[searchQuery.searchType];
      const searchQueryString = encodeURIComponent(searchQuery.searchString);
      const searchUrl = `/api/autocite/search?q=${searchQueryString}&sourceId=${sourceId}`;
      axios.get(searchUrl).then((response) => {
        console.log(response.data[0]);
      });
    }
  };
  const handleSearchQueryChange = (e: ChangeEvent<HTMLInputElement>): void => {
    {
      updateSearchQuery((draft) => {
        draft[e.target.name] = e.target.value;
      });
    }
  };

  const renderSearchTypes = searchTypes.map((searchType) => {
    return (
      <div className="inline px-3" key={searchTypes.indexOf(searchType)}>
        <input
          type="radio"
          id={searchType}
          name="searchType"
          value={searchType}
          onChange={(e) => handleSearchQueryChange(e)}
        />
        <label htmlFor={searchType}>{searchType}</label>
      </div>
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
          onClick={(e) => searchForReferences(e)}
        >
          Search
        </button>
      </div>
    </div>
  );
};
export default SearchReferenceBox;
