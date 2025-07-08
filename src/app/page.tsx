"use client";
import { library } from "@fortawesome/fontawesome-svg-core";
import { Provider } from "react-redux";
import store from "../store";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

library.add(faSearch);

import SearchReferenceBox from "./components/SearchReferenceBox";
import { useImmer } from "use-immer";
import ReferenceScreen from "./components/ReferencesScreen";

export default function Home() {
  const [showResults, updateShowResults] = useImmer(false);
  return (
    <Provider store={store}>
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main
          onClick={(e) => updateShowResults(false)}
          className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start"
        >
          <SearchReferenceBox />

          <ReferenceScreen />
        </main>
        <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center"></footer>
      </div>
    </Provider>
  );
}
