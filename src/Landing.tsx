import { stringify } from "querystring";
import { Dispatch, SetStateAction } from "react";
import { items } from "./constants";
import { Action, ActionType, CartItem } from "./types";

export const Landing = ({
  initialCart,
  pageState,
  setPageState,
  cart,
  setCart,
  dispatch,
}: {
  initialCart: boolean;
  pageState: string;
  setPageState: Dispatch<SetStateAction<string>>;
  cart: CartItem[];
  setCart: Dispatch<SetStateAction<CartItem[]>>;
  dispatch: Dispatch<Action>;
}) => {
  const startNewSession = () => {
    dispatch({ type: ActionType.RESET, payload: null });
    localStorage.clear();
    setCart(items);
    console.log("new sess");
    console.log(localStorage.getItem("cart"));
    setPageState("categories");
  };

  function disabled() {
    for (let i = 0; i < cart.length; i++) {
      if (cart[i].total > 0) {
        return false;
      }
    }
    return true;
  }

  return (
    <div className="my-14 flex w-3/4 max-w-sm grow flex-col items-center justify-center gap-24 overflow-hidden">
      <button
        className="flex h-16 w-full flex-none items-center justify-center rounded-xl bg-slate-500 py-4 drop-shadow-lg"
        onClick={startNewSession}
      >
        <h1 className="text-2xl text-white">New List</h1>
      </button>
      <button
        className="flex h-16 w-full flex-none items-center justify-center rounded-xl bg-slate-500 py-4 drop-shadow-lg"
        disabled={disabled()}
        style={{ opacity: disabled() ? 0.5 : 1 }}
        onClick={() => setPageState("categories")}
      >
        <h1 className="text-2xl text-white">Resume</h1>
      </button>
    </div>
  );
};
