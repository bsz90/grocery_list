import { Dispatch, SetStateAction, useState, useMemo } from "react";
import { categories } from "./constants";
import { Action, ActionType, CartItem } from "./types";
import { EditSearchedItem } from "./EditSearchedItem";

export const Header = ({
  cart,
  setCart,
  pageState,
  setPageState,
  dispatch,
  unsavedCartChanges,
  setDisplayDiscardCartChanges,
}: {
  cart: CartItem[];
  setCart: Dispatch<SetStateAction<CartItem[]>>;
  pageState: string;
  setPageState: Dispatch<SetStateAction<string>>;
  dispatch: Dispatch<Action>;
  unsavedCartChanges: boolean;
  setDisplayDiscardCartChanges: Dispatch<
    SetStateAction<{ openState: boolean; nextPageState: string }>
  >;
}) => {
  const [dropdownIsOpen, setDropdownIsOpen] = useState(false);

  const [searchCriteria, setSearchCriteria] = useState("");

  const [searchedItem, setSearchedItem] = useState("");

  const handleHeaderCartClick = () => {
    if (unsavedCartChanges) {
      setDisplayDiscardCartChanges({ openState: true, nextPageState: "cart" });
    } else {
      setPageState("cart");
    }
  };

  const handleHamburgerClick = (newPageState: string) => {
    setPageState(newPageState);
    dispatch({
      type: ActionType.UPDATE,
      payload: { name: undefined, cart, newPageState },
    });
  };

  const searchResults = useMemo(() => {
    function doesItemMeetCriteria(item: CartItem) {
      return item.name.startsWith(searchCriteria);
    }
    return cart.filter((item) => doesItemMeetCriteria(item));
  }, [cart, searchCriteria]);

  return (
    <>
      <div className="z-20 flex h-20 w-full shrink-0 items-center justify-between bg-slate-700 px-4 drop-shadow-lg">
        <div className="flex h-14 w-14 flex-col items-start justify-start">
          <button
            className="flex h-14 w-14 flex-none grow items-center justify-center"
            onClick={() => {
              setDropdownIsOpen((prev) => (prev ? false : true));
            }}
            disabled={pageState === "landing"}
          >
            <svg width="38" height="38" fill="none" viewBox="0 0 24 24">
              <path
                stroke="white"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M4.75 5.75H19.25"
              ></path>
              <path
                stroke="white"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M4.75 18.25H19.25"
              ></path>
              <path
                stroke="white"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M4.75 12H19.25"
              ></path>
            </svg>
          </button>
          <div
            className="relative mt-2 box-border flex flex-col items-center justify-center border bg-white pt-2 transition-all"
            style={{ marginLeft: dropdownIsOpen ? "-16px" : "-210px" }}
          >
            <div className="box-content flex h-12 w-48 items-center justify-center overflow-hidden">
              <div className="absolute left-2 mx-2">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path
                    stroke="rgb(148, 163, 184)"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.25"
                    d="M19.25 19.25L15.5 15.5M4.75 11C4.75 7.54822 7.54822 4.75 11 4.75C14.4518 4.75 17.25 7.54822 17.25 11C17.25 14.4518 14.4518 17.25 11 17.25C7.54822 17.25 4.75 14.4518 4.75 11Z"
                  ></path>
                </svg>
              </div>
              <input
                type="search"
                className="mx-2 box-border h-10 w-full rounded-full border-2 border-slate-400 bg-none px-2 indent-8"
                placeholder="Search"
                onChange={(event) => setSearchCriteria(event.target.value)}
                disabled={!dropdownIsOpen}
              ></input>
            </div>
            <hr className="mt-2 w-5/6 bg-slate-500"></hr>
            {(() => {
              if (searchCriteria.length > 1 && searchResults.length === 0) {
                return (
                  <div className="flex h-12 w-48 items-center justify-start bg-white px-6 py-2 text-gray-400">
                    No results found...
                  </div>
                );
              }
              if (searchCriteria[0] || searchCriteria.length > 1) {
                return searchResults.map((item, id) => {
                  return (
                    <div key={item.name} className="h-auto w-full">
                      <EditSearchedItem
                        key={item.name}
                        item={item}
                        cart={cart}
                        setCart={setCart}
                        searchedItem={searchedItem}
                        setSearchedItem={setSearchedItem}
                        setDropdownIsOpen={setDropdownIsOpen}
                      />
                      {id < searchResults.length - 1 ? (
                        <hr className="w-5/6 bg-slate-500"></hr>
                      ) : null}
                    </div>
                  );
                });
              }
              return categories.map(({ type }, id) => {
                return (
                  <div key={type}>
                    <button
                      key={type}
                      className="flex h-12 w-48 items-center justify-start bg-white px-6 py-2 capitalize"
                      onClick={() => {
                        handleHamburgerClick(type);
                        setDropdownIsOpen(false);
                      }}
                      disabled={!dropdownIsOpen}
                    >
                      {type}
                    </button>
                    {id < categories.length - 1 ? (
                      <hr className="w-5/6 bg-slate-500"></hr>
                    ) : null}
                  </div>
                );
              });
            })()}
          </div>
        </div>
        <div
          className="flex h-full w-full items-center justify-center"
          onClick={() => setPageState("landing")}
        >
          <h1 className="text-center text-3xl text-white">Grocery List</h1>
        </div>
        <button
          className="flex h-14 w-14 flex-none items-center justify-center"
          onClick={handleHeaderCartClick}
          disabled={pageState === "landing"}
        >
          <svg width="38" height="38" fill="none" viewBox="0 0 24 24">
            <path
              stroke="white"
              fill="white"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1"
              d="M7.75 7.75H19.25L17.6128 14.7081C17.4002 15.6115 16.5941 16.25 15.666 16.25H11.5395C10.632 16.25 9.83827 15.639 9.60606 14.7618L7.75 7.75ZM7.75 7.75L7 4.75H4.75"
            ></path>
            <circle cx="10" cy="19" r="1" fill="white"></circle>
            <circle cx="17" cy="19" r="1" fill="white"></circle>
          </svg>
        </button>
      </div>
      <div
        className="absolute box-border h-full w-full flex-none transition-all"
        style={{
          backgroundColor: dropdownIsOpen ? "black" : "none",
          opacity: dropdownIsOpen ? "0.3" : 0,
          zIndex: dropdownIsOpen ? 1 : 0,
        }}
      ></div>
    </>
  );
};
