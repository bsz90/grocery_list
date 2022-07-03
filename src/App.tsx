import { useEffect, useMemo, useReducer, useState } from "react";
import { Categories } from "./Categories";
import { Items } from "./Items";
import { items } from "./constants";
import { Header } from "./Header";
import { Cart } from "./Cart";
import { ConfirmDiscardCartChanges } from "./ConfirmDiscardCartChanges";
import { Action, ActionType, CartItem } from "./types";
import { Landing } from "./Landing";

function itemsReducer(itemsToAdd: CartItem[], { type, payload }: Action) {
  const newState = (
    determineTotal: number | ((prevTotal: number) => number)
  ) => {
    return itemsToAdd.map(({ name, type, total, notes, checked }) => {
      if (name === payload!.name) {
        return {
          name,
          type,
          total:
            typeof determineTotal === "number"
              ? determineTotal
              : determineTotal(total),
          notes,
          checked,
        };
      } else return { name, type, total, notes, checked };
    });
  };

  switch (type) {
    case ActionType.INCREMENT: {
      const determineTotal = (prevTotal: number) => prevTotal + 1;
      return newState(determineTotal);
    }
    case ActionType.DECREMENT: {
      const determineTotal = (prevTotal: number) =>
        prevTotal > 0 ? prevTotal - 1 : 0;
      return newState(determineTotal);
    }
    case ActionType.MANUAL_INPUT: {
      const determineTotal = payload.total;
      return newState(determineTotal);
    }
    case ActionType.ANNOTATE: {
      const newAnnotateState = itemsToAdd.map(
        ({ name, total, type, notes, checked }) => {
          if (name === payload.name) {
            return { name, total, type, notes: payload.notes, checked };
          }
          return { name, total, type, notes, checked };
        }
      );
      return newAnnotateState;
    }
    case ActionType.UPDATE: {
      const updatedState = payload.cart.filter(
        (item) => item.type === payload.newPageState
      );
      return updatedState;
    }
    case ActionType.RESET: {
      return items;
    }
    default:
      throw new Error();
  }
}

function App() {
  const [pageState, setPageState] = useState("landing");

  const [initialCart] = useState<boolean>(
    localStorage.getItem("cart") ? true : false
  );

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const previousCart = localStorage.getItem("cart");
      return previousCart ? JSON.parse(previousCart) : items;
    } catch (error) {
      console.log("Error");
      return items;
    }
  });

  const currentPageItems = useMemo(
    () => cart.filter((items) => items.type === pageState),
    [cart, pageState]
  );

  const [itemsToAdd, dispatch] = useReducer(itemsReducer, currentPageItems);

  const [unsavedCartChanges, setUnsavedCartChanges] = useState(false);

  const [displayDiscardCartChanges, setDisplayDiscardCartChanges] = useState({
    openState: false,
    nextPageState: "",
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-items-stretch">
      <Header
        cart={cart}
        setCart={setCart}
        pageState={pageState}
        setPageState={setPageState}
        dispatch={dispatch}
        unsavedCartChanges={unsavedCartChanges}
        setDisplayDiscardCartChanges={setDisplayDiscardCartChanges}
      />
      {(() => {
        if (pageState === "landing") {
          return (
            <Landing
              initialCart={initialCart}
              pageState={pageState}
              setPageState={setPageState}
              cart={cart}
              setCart={setCart}
              dispatch={dispatch}
            />
          );
        }
        if (pageState === "categories") {
          return (
            <Categories
              pageState={pageState}
              setPageState={setPageState}
              cart={cart}
              dispatch={dispatch}
            />
          );
        }
        if (pageState === "cart") {
          return (
            <Cart
              cart={cart}
              setCart={setCart}
              setPageState={setPageState}
              dispatch={dispatch}
            />
          );
        }
        return (
          <Items
            cart={cart}
            setCart={setCart}
            pageState={pageState}
            setPageState={setPageState}
            currentPageItems={currentPageItems}
            itemsToAdd={itemsToAdd}
            dispatch={dispatch}
            unsavedCartChanges={unsavedCartChanges}
            setUnsavedCartChanges={setUnsavedCartChanges}
          />
        );
      })()}
      <ConfirmDiscardCartChanges
        setPageState={setPageState}
        displayDiscardCartChanges={displayDiscardCartChanges}
        setDisplayDiscardCartChanges={setDisplayDiscardCartChanges}
      />
    </div>
  );
}

export default App;
