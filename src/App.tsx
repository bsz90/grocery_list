import { useMemo, useReducer, useState } from "react";
import { Landing } from "./Landing";
import { Items } from "./Items";
import { items } from "./constants";
import { Header } from "./Header";
import { Cart } from "./Cart";
import { ConfirmDiscardCartChanges } from "./ConfirmDiscardCartChanges";
import { Action, ActionType, CartItem } from "./types";

function itemsReducer(itemsToAdd: CartItem[], { type, payload }: Action) {
  const newState = (
    determineTotal: number | ((prevTotal: number) => number)
  ) => {
    return itemsToAdd.map(({ name, type, total, notes, checked }) => {
      if (name === payload.name) {
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
    default:
      throw new Error();
  }
}

function App() {
  const [pageState, setPageState] = useState("landing");

  const [cart, setCart] = useState(items);

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

  return (
    <div className="flex h-screen w-full flex-col items-center justify-items-stretch">
      <Header
        cart={cart}
        setCart={setCart}
        setPageState={setPageState}
        dispatch={dispatch}
        unsavedCartChanges={unsavedCartChanges}
        setDisplayDiscardCartChanges={setDisplayDiscardCartChanges}
      />
      {(() => {
        if (pageState === "landing" || pageState === "continue") {
          return (
            <Landing
              pageState={pageState}
              setPageState={setPageState}
              cart={cart}
              dispatch={dispatch}
            />
          );
        }
        if (pageState === "cart") {
          return <Cart cart={cart} setCart={setCart} />;
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
