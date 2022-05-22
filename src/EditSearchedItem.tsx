import * as Dialog from "@radix-ui/react-dialog";
import { Dispatch, SetStateAction, useReducer } from "react";
import { ActionType, CartAction, CartItem } from "./types";

function cartItemReducer(itemToEdit: CartItem, { type, payload }: CartAction) {
  let newItem = { ...itemToEdit };
  switch (type) {
    case ActionType.INCREMENT: {
      newItem.total = itemToEdit.total + 1;
      return newItem;
    }
    case ActionType.DECREMENT: {
      newItem.total = itemToEdit.total > 0 ? itemToEdit.total - 1 : 0;
      return newItem;
    }
    case ActionType.MANUAL_INPUT: {
      newItem.total = payload.total;
      return newItem;
    }
    default:
      throw new Error();
  }
}

export const EditSearchedItem = ({
  item,
  cart,
  setCart,
  searchedItem,
  setSearchedItem,
  setDropdownIsOpen,
}: {
  item: CartItem;
  cart: CartItem[];
  setCart: Dispatch<SetStateAction<CartItem[]>>;
  searchedItem: string;
  setSearchedItem: Dispatch<SetStateAction<string>>;
  setDropdownIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [itemToEdit, dispatch] = useReducer(cartItemReducer, item);

  const handleCartItemEdit = () => {
    setCart((prev) => {
      const newCart = [...prev];
      const itemIndex = newCart.findIndex(
        (cartItem) => cartItem.name === item.name
      );
      newCart.splice(itemIndex, 1, itemToEdit);
      return newCart;
    });
    setSearchedItem("");
  };

  return (
    <Dialog.Root
      open={item.name === searchedItem}
      onOpenChange={(open) => {
        if (!open) setSearchedItem("");
      }}
      modal={true}
    >
      <Dialog.Trigger
        className="flex h-12 w-48 items-center justify-start bg-white px-6 py-2 capitalize"
        onClick={() => setSearchedItem(item.name)}
      >
        {item.name}
      </Dialog.Trigger>
      <Dialog.Portal className="h-full w-full">
        <Dialog.Overlay className="fixed top-0 z-10 h-full w-full bg-black/50" />
        <Dialog.Content className="fixed top-0 z-20 flex h-full w-full items-center justify-center">
          <div className="relative flex h-auto w-full flex-col items-center justify-center bg-white">
            <Dialog.Title className="mt-12 capitalize">
              {item.name}
            </Dialog.Title>
            <div className="flex h-16 items-center justify-around">
              <button
                onClick={() => {
                  dispatch({
                    type: ActionType.DECREMENT,
                    payload: null,
                  });
                }}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-500 text-white drop-shadow-md"
              >
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M17.25 12.25L6.75 12.25"
                  ></path>
                </svg>
              </button>
              <input
                type="number"
                className="mx-6 w-10 bg-inherit text-center"
                step="1"
                min="0"
                max="999"
                value={itemToEdit.total}
                onChange={({ target }) => {
                  dispatch({
                    type: ActionType.MANUAL_INPUT,
                    payload: {
                      total: Math.round(Number(target.value)),
                    },
                  });
                }}
              ></input>
              <button
                onClick={() =>
                  dispatch({
                    type: ActionType.INCREMENT,
                    payload: null,
                  })
                }
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-500 text-white drop-shadow-md"
              >
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M12 5.75V18.25"
                  ></path>
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M18.25 12L5.75 12"
                  ></path>
                </svg>
              </button>
            </div>

            <div className="my-8 flex h-16 w-full items-center justify-center gap-10">
              <button
                className="h-12 w-36 rounded-xl border bg-slate-500 text-white drop-shadow-md"
                onClick={handleCartItemEdit}
              >
                Confirm
              </button>
              <button
                className="h-12 w-36 rounded-xl border border-black bg-white drop-shadow-md"
                onClick={() => setSearchedItem("")}
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
