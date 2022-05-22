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

export const EditCartItem = ({
  item,
  cart,
  setCart,
  cartItemBeingEdited,
  setCartItemBeingEdited,
  displayCheckedItems,
}: {
  item: CartItem;
  cart: CartItem[];
  setCart: Dispatch<SetStateAction<CartItem[]>>;
  cartItemBeingEdited: string;
  setCartItemBeingEdited: Dispatch<SetStateAction<string>>;
  displayCheckedItems: boolean;
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
    setCartItemBeingEdited("");
  };

  return (
    <Dialog.Root open={item.name === cartItemBeingEdited} modal={true}>
      <Dialog.Trigger
        className="flex h-full w-8 items-center justify-center overflow-hidden"
        onClick={() => setCartItemBeingEdited(item.name)}
        disabled={item.checked && !displayCheckedItems}
      >
        <svg
          className="flex-none"
          width="48"
          height="48"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            fill="#64748b"
            d="M13 12C13 12.5523 12.5523 13 12 13C11.4477 13 11 12.5523 11 12C11 11.4477 11.4477 11 12 11C12.5523 11 13 11.4477 13 12Z"
          ></path>
          <path
            fill="#64748b"
            d="M13 8C13 8.55228 12.5523 9 12 9C11.4477 9 11 8.55228 11 8C11 7.44772 11.4477 7 12 7C12.5523 7 13 7.44772 13 8Z"
          ></path>
          <path
            fill="#64748b"
            d="M13 16C13 16.5523 12.5523 17 12 17C11.4477 17 11 16.5523 11 16C11 15.4477 11.4477 15 12 15C12.5523 15 13 15.4477 13 16Z"
          ></path>
        </svg>
      </Dialog.Trigger>
      <Dialog.Portal className="h-full w-full">
        <Dialog.Overlay className="fixed top-0 z-10 h-full w-full bg-black/50" />
        <Dialog.Content
          className="fixed top-0 z-20 flex h-full w-full items-center justify-center"
          onEscapeKeyDown={() => setCartItemBeingEdited("")}
          onPointerDownOutside={() => setCartItemBeingEdited("")}
          onInteractOutside={() => setCartItemBeingEdited("")}
        >
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
                className="h-12 w-36 rounded-xl border border-black bg-slate-500 text-white drop-shadow-md"
                onClick={handleCartItemEdit}
              >
                Confirm
              </button>
              <button
                className="h-12 w-36 rounded-xl border border-black bg-white drop-shadow-md"
                onClick={() => setCartItemBeingEdited("")}
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
