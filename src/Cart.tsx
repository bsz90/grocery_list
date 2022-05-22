import { Dispatch, SetStateAction, useState } from "react";
import { CartItem } from "./types";
import * as Checkbox from "@radix-ui/react-checkbox";
import { EditCartItem } from "./EditCartItem";
import { categories } from "./constants";

export const Cart = ({
  cart,
  setCart,
}: {
  cart: CartItem[];
  setCart: Dispatch<SetStateAction<CartItem[]>>;
}) => {
  const currentCartItems = cart.filter((items) => items.total > 0);

  const currentCategories = categories.filter(
    ({ type }) =>
      currentCartItems.filter((item) => item.type === type).length > 0
  );

  const [cartItemBeingEdited, setCartItemBeingEdited] = useState("");

  const handleCheckItem = (item: CartItem) => {
    setCart((prev) => {
      const newCart = [...prev];
      const newObject = { ...item, checked: item.checked ? false : true };
      const itemId = newCart.findIndex(({ name }) => name === item.name);
      newCart.splice(itemId, 1, newObject);
      return newCart;
    });
  };

  const [categoryOpenState, setCategoryOpenState] = useState(
    Array.from({ length: currentCategories.length }, () => true)
  );

  const [displayCheckedItems, setDisplayCheckedItems] = useState(false);

  function itemHeight(
    currentCartForThisCategory: CartItem[],
    countOfUncheckedItems: number,
    countOfNotes: number,
    countOfCheckedNotes: number
  ) {
    const pixelsPerItem = 64;
    const pixelsPerNotesArea = 88;
    const countOfAllItems = currentCartForThisCategory.length;

    return displayCheckedItems
      ? countOfAllItems * pixelsPerItem + countOfNotes * pixelsPerNotesArea
      : countOfUncheckedItems * pixelsPerItem +
          (countOfNotes - countOfCheckedNotes) * pixelsPerNotesArea;
  }

  function itemTransitionTime(
    currentCartForThisCategory: CartItem[],
    countOfUncheckedItems: number
  ) {
    const msPerItem = 0.05;
    const min = 0.2;
    const max = 1;
    function clamp(num: number, min: number, max: number) {
      return Math.max(Math.min(num, max), min);
    }

    return `${
      displayCheckedItems
        ? clamp((currentCartForThisCategory.length + 1) * msPerItem, min, max)
        : clamp((countOfUncheckedItems + 1) * msPerItem, min, max)
    }`;
  }

  return (
    <div className="absolute top-20 flex w-3/4 max-w-sm flex-col items-center justify-center py-8">
      <div className=" flex flex-col items-center justify-center">
        <h1 className="text-2xl capitalize">Your Cart</h1>
      </div>
      <div className="mt-4 flex w-full items-center justify-end text-base">
        <div className="flex h-12 items-center justify-center gap-2 rounded-xl">
          <Checkbox.Root
            className="flex h-4 w-4 items-center justify-center border-2 border-slate-700 bg-white"
            checked={displayCheckedItems}
            onCheckedChange={() => setDisplayCheckedItems((prev) => !prev)}
          >
            <Checkbox.Indicator>
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24">
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M5.75 12.8665L8.33995 16.4138C9.15171 17.5256 10.8179 17.504 11.6006 16.3715L18.25 6.75"
                ></path>
              </svg>
            </Checkbox.Indicator>
          </Checkbox.Root>
          Show Completed
        </div>
      </div>
      <div className="flex h-auto w-full flex-col gap-8">
        {currentCartItems.length > 0 ? (
          currentCategories.map((category, id) => {
            const currentCartForThisCategory = currentCartItems.filter(
              (currentItem) => currentItem.type === category.type
            );

            const countOfUncheckedItems = currentCartForThisCategory.filter(
              (currentItem) => !currentItem.checked
            ).length;

            const countOfNotes = currentCartForThisCategory.filter(
              (currentItem) => currentItem.notes
            ).length;

            const countOfCheckedNotes = currentCartForThisCategory.filter(
              (currentItem) => currentItem.notes && currentItem.checked
            ).length;

            return (
              <div
                key={category.type}
                className="flex h-auto w-full flex-col overflow-hidden rounded-xl drop-shadow-lg"
              >
                <button
                  className="flex h-16 w-full flex-none items-center justify-between gap-4 bg-slate-500 px-8 text-lg text-white"
                  onClick={() =>
                    setCategoryOpenState((prev) => {
                      const newState = [...prev];
                      newState[id] = !newState[id];
                      return newState;
                    })
                  }
                >
                  <div className="flex w-3/4 gap-4">
                    <span
                      className="transition-all"
                      style={{
                        transform: categoryOpenState[id]
                          ? "rotate(90deg)"
                          : "rotate(0)",
                      }}
                    >
                      &rarr;
                    </span>
                    <h1 className="capitalize">{category.type}</h1>
                  </div>
                  <span>
                    ({currentCartForThisCategory.length - countOfUncheckedItems}
                    /{currentCartForThisCategory.length})
                  </span>
                </button>

                <div
                  className="flex flex-col overflow-hidden transition-all"
                  style={{
                    height: categoryOpenState[id]
                      ? `${itemHeight(
                          currentCartForThisCategory,
                          countOfUncheckedItems,
                          countOfNotes,
                          countOfCheckedNotes
                        )}px`
                      : 0,
                    transition: `all ${itemTransitionTime(
                      currentCartForThisCategory,
                      countOfUncheckedItems
                    )}}s ease-out`,
                  }}
                >
                  {currentCartForThisCategory.map((item, id) => {
                    return (
                      <div
                        className="flex h-16 w-full origin-top flex-col overflow-visible transition-all"
                        key={item.name}
                        style={{
                          backgroundColor: item.checked
                            ? "rgb(134, 239, 172)"
                            : "rgb(243, 244, 246)",
                          height: item.notes
                            ? !item.checked
                              ? "152px"
                              : displayCheckedItems
                              ? "152px"
                              : 0
                            : !item.checked
                            ? "64px"
                            : displayCheckedItems
                            ? "64px"
                            : 0,
                        }}
                      >
                        <div className="box-border flex w-full origin-top items-center justify-items-stretch overflow-hidden pl-4 pr-2 transition-all">
                          <div className="relative flex h-16 w-12 flex-none items-center justify-center">
                            <Checkbox.Root
                              className="flex h-4 w-4 items-center justify-center border-2 border-slate-600 bg-white"
                              checked={item.checked}
                              onCheckedChange={() => handleCheckItem(item)}
                            >
                              <Checkbox.Indicator className="text-[10px]">
                                <svg
                                  width="12"
                                  height="12"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.5"
                                    d="M5.75 12.8665L8.33995 16.4138C9.15171 17.5256 10.8179 17.504 11.6006 16.3715L18.25 6.75"
                                  ></path>
                                </svg>
                              </Checkbox.Indicator>
                            </Checkbox.Root>
                          </div>
                          <div
                            className="box-border flex h-16 grow items-center justify-start overflow-hidden text-ellipsis whitespace-nowrap px-4 capitalize"
                            onClick={() => handleCheckItem(item)}
                          >
                            {item.total} {item.name}
                          </div>
                          <EditCartItem
                            item={item}
                            cart={cart}
                            setCart={setCart}
                            cartItemBeingEdited={cartItemBeingEdited}
                            setCartItemBeingEdited={setCartItemBeingEdited}
                          />
                        </div>
                        {(() => {
                          if (
                            item.notes &&
                            (!item.checked || displayCheckedItems)
                          ) {
                            return (
                              <>
                                <div className="flex h-full w-full justify-center px-4">
                                  <textarea
                                    disabled
                                    className="m-4 h-14 w-[85%] flex-none resize-none px-2 py-1 text-left"
                                    defaultValue={`Notes : ${item.notes}`}
                                  ></textarea>
                                </div>
                              </>
                            );
                          }
                        })()}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex h-16 w-full items-center justify-center rounded-xl bg-slate-500 text-white drop-shadow-lg">
            Cart Is Empty
          </div>
        )}
      </div>
    </div>
  );
};
