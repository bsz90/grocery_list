import * as Dialog from "@radix-ui/react-dialog";
import { Dispatch, SetStateAction } from "react";
import { items } from "./constants";
import { Action, ActionType, CartItem } from "./types";

export const ConfirmClearCart = ({
  setPageState,
  displayClearCart,
  setDisplayClearCart,
  dispatch,
  setCart,
}: {
  setPageState: Dispatch<SetStateAction<string>>;
  displayClearCart: boolean;
  setDisplayClearCart: Dispatch<SetStateAction<boolean>>;
  dispatch: Dispatch<Action>;
  setCart: Dispatch<SetStateAction<CartItem[]>>;
}) => {
  return (
    <Dialog.Root open={displayClearCart} modal={true}>
      <Dialog.Portal className="h-full w-full">
        <Dialog.Overlay className="fixed top-0 z-10 h-full w-full bg-gray-600/50" />
        <Dialog.Content className="fixed top-0 z-20 flex h-full w-full items-center justify-center">
          <div className="relative flex h-auto w-full flex-col items-center justify-center bg-white">
            <Dialog.Title className="mt-12 text-2xl">
              Clear All Items
            </Dialog.Title>
            <Dialog.Description className="my-8 flex flex-col  gap-1 px-12  text-center">
              <p>This change cannot be undone.</p>
              <p>Are you sure you want to clear all items?</p>
            </Dialog.Description>
            <div className="my-8 flex h-16 w-full items-center justify-center gap-10">
              <button
                className="h-12 w-36 rounded-xl bg-red-500 text-white drop-shadow-md"
                onClick={() => {
                  setPageState("categories");
                  setDisplayClearCart(false);
                  dispatch({ type: ActionType.RESET, payload: null });
                  setCart(items);
                }}
              >
                Confirm
              </button>
              <button
                className="h-12 w-36 rounded-xl border-2 border-slate-500 bg-white drop-shadow-md"
                onClick={() => setDisplayClearCart(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
