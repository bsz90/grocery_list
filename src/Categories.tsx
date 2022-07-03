import { Dispatch, SetStateAction } from "react";
import { categories } from "./constants";
import { Action, ActionType, CartItem } from "./types";

export const Categories = ({
  pageState,
  setPageState,
  cart,
  dispatch,
}: {
  pageState: string;
  setPageState: Dispatch<SetStateAction<string>>;
  cart: CartItem[];
  dispatch: Dispatch<Action>;
}) => {
  return (
    <div className="my-14 flex w-3/4 max-w-sm flex-col items-center overflow-hidden rounded-xl drop-shadow-lg">
      <div className="flex h-16 w-full flex-none items-center justify-center bg-slate-500 py-4 drop-shadow-md">
        <h1 className="text-2xl text-white">Build Your List</h1>
      </div>
      <div className="flex h-full w-full flex-col gap-[1px] overflow-x-hidden overflow-y-scroll rounded-b-xl">
        {categories.map(({ type }, id) => {
          return (
            <button
              className="h-16 w-full flex-none bg-white capitalize drop-shadow-md"
              key={type}
              onClick={() => {
                setPageState(type);
                dispatch({
                  type: ActionType.UPDATE,
                  payload: { name: undefined, cart, newPageState: type },
                });
              }}
            >
              {type}
            </button>
          );
        })}
      </div>
    </div>
  );
};
