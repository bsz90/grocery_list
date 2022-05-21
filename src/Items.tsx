import { useState, useEffect, useReducer, SetStateAction } from "react";
import { ConfirmCart } from "./ConfirmCart";
import { Dispatch } from "react";
import { Action, CartItem, ActionType } from "./types";
import { ConfirmDiscardNotesChanges } from "./ConfirmDiscardNotesChanges";

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
        (item) => item.type === payload.pageState
      );
      return updatedState;
    }
    default:
      throw new Error();
  }
}

export const Items = ({
  pageState,
  setPageState,
  cart,
  setCart,
  unsavedCartChanges,
  setUnsavedCartChanges,
}: {
  pageState: string;
  setPageState: Dispatch<SetStateAction<string>>;
  cart: CartItem[];
  setCart: Dispatch<SetStateAction<CartItem[]>>;
  unsavedCartChanges: boolean;
  setUnsavedCartChanges: Dispatch<SetStateAction<boolean>>;
}) => {
  const currentPageItems = cart.filter((items) => items.type === pageState);

  const [itemsToAdd, dispatch] = useReducer(itemsReducer, currentPageItems);

  const [displayConfirmDialog, setDisplayConfirmDialog] = useState(false);

  const [itemBeingEdited, setItemBeingEdited] = useState<string>();

  const [notesToAdd, setNotesToAdd] = useState("");

  const [displayDiscardNotesChanges, setDisplayDiscardNotesChanges] = useState({
    openState: false,
    nextItemBeingEdited: "",
  });

  function handleConfirmCartChange() {
    setCart((prev) => {
      const prevCart = prev.filter((item) => item.type !== pageState);
      return [...prevCart, ...itemsToAdd];
    });
    setPageState("continue");
    setUnsavedCartChanges(false);
  }

  const unsavedNotesChanges = () => {
    const activeItem = itemsToAdd.find((item) => item.name === itemBeingEdited);
    if (activeItem) return activeItem.notes !== notesToAdd;
  };

  useEffect(() => {
    function changesToCart() {
      const firstArray = itemsToAdd;
      const secondArray = currentPageItems;

      for (let i = 0; i < firstArray.length; i++) {
        const firstItem = firstArray[i];
        const secondItem = secondArray[i];

        if (firstItem.total !== secondItem.total) return true;
      }

      return false;
    }
    setUnsavedCartChanges(changesToCart());
  }, [currentPageItems, itemBeingEdited, itemsToAdd, setUnsavedCartChanges]);

  useEffect(
    () =>
      dispatch({
        type: ActionType.UPDATE,
        payload: { name: undefined, cart, pageState },
      }),
    [cart, pageState]
  );

  return (
    <>
      <div className="my-14 w-3/4 overflow-hidden rounded-xl drop-shadow-lg">
        <div className="flex h-16 flex-col items-center justify-center rounded-t-xl bg-slate-500 text-white">
          <h1 className="text-xl capitalize">{pageState}</h1>
        </div>
        <div className="flex h-full w-full flex-col gap-[1px] overflow-x-hidden overflow-y-scroll rounded-b-xl">
          {itemsToAdd.map(({ name, type, total, notes, checked }, id) => {
            return (
              <div
                className="flex h-full w-full flex-col items-center justify-center bg-white"
                key={id}
              >
                <div className="flex h-16 w-full flex-none justify-between">
                  <label className="flex w-32 flex-none items-center justify-start pl-8 capitalize">
                    {name}
                  </label>
                  <div className="flex flex-none items-center justify-around">
                    <button
                      className="mr-2 flex h-8 w-8 items-center justify-center rounded-full"
                      onClick={() => {
                        if (unsavedNotesChanges()) {
                          setDisplayDiscardNotesChanges({
                            openState: true,
                            nextItemBeingEdited: name,
                          });
                        } else {
                          setItemBeingEdited(
                            itemBeingEdited === name ? undefined : name
                          );
                          setNotesToAdd(
                            itemsToAdd.find((item) => item.name === name)!.notes
                          );
                        }
                      }}
                    >
                      <svg
                        width="32"
                        height="32"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="#64748b"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M12 18.25C15.5 18.25 19.25 16.5 19.25 12C19.25 7.5 15.5 5.75 12 5.75C8.5 5.75 4.75 7.5 4.75 12C4.75 13.0298 4.94639 13.9156 5.29123 14.6693C5.50618 15.1392 5.62675 15.6573 5.53154 16.1651L5.26934 17.5635C5.13974 18.2547 5.74527 18.8603 6.43651 18.7307L9.64388 18.1293C9.896 18.082 10.1545 18.0861 10.4078 18.1263C10.935 18.2099 11.4704 18.25 12 18.25Z"
                        ></path>
                        <path
                          stroke="#64748b"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9.5 12C9.5 12.2761 9.27614 12.5 9 12.5C8.72386 12.5 8.5 12.2761 8.5 12C8.5 11.7239 8.72386 11.5 9 11.5C9.27614 11.5 9.5 11.7239 9.5 12Z"
                        ></path>
                        <path
                          stroke="#64748b"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12.5 12C12.5 12.2761 12.2761 12.5 12 12.5C11.7239 12.5 11.5 12.2761 11.5 12C11.5 11.7239 11.7239 11.5 12 11.5C12.2761 11.5 12.5 11.7239 12.5 12Z"
                        ></path>
                        <path
                          stroke="#64748b"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.5 12C15.5 12.2761 15.2761 12.5 15 12.5C14.7239 12.5 14.5 12.2761 14.5 12C14.5 11.7239 14.7239 11.5 15 11.5C15.2761 11.5 15.5 11.7239 15.5 12Z"
                        ></path>
                      </svg>
                    </button>
                    <button
                      onClick={() =>
                        dispatch({
                          type: ActionType.DECREMENT,
                          payload: { name },
                        })
                      }
                      className="mx-2 flex h-8 w-8 items-center justify-center rounded-full border bg-slate-500 text-white drop-shadow-sm"
                    >
                      <svg
                        width="20"
                        height="20"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2.5"
                          d="M17.25 12.25L6.75 12.25"
                        ></path>
                      </svg>
                    </button>
                    <input
                      type="number"
                      className=" w-12 bg-inherit text-center"
                      step="1"
                      min="0"
                      max="999"
                      value={total}
                      onChange={({ target }) => {
                        dispatch({
                          type: ActionType.MANUAL_INPUT,
                          payload: {
                            name,
                            total: Math.round(Number(target.value)),
                          },
                        });
                      }}
                    ></input>
                    <button
                      onClick={() =>
                        dispatch({
                          type: ActionType.INCREMENT,
                          payload: { name, type },
                        })
                      }
                      className="mx-2 flex h-8 w-8 items-center justify-center rounded-full border bg-slate-500 text-center text-white drop-shadow-sm"
                    >
                      <svg
                        width="20"
                        height="20"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2.5"
                          d="M12 5.75V18.25"
                        ></path>
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2.5"
                          d="M18.25 12L5.75 12"
                        ></path>
                      </svg>
                    </button>
                  </div>
                </div>
                <div
                  className="flex w-full flex-none flex-col items-center justify-start overflow-hidden bg-slate-200 transition-all"
                  style={{
                    height:
                      itemBeingEdited === name ? "144px" : notes ? "88px" : 0,
                    transition: "all .25s",
                  }}
                >
                  <textarea
                    id={`${name} notes`}
                    name={`${name} notes`}
                    className="relative top-0 m-4 h-14 w-[85%] flex-none resize-none px-2 py-1 text-left"
                    value={itemBeingEdited === name ? notesToAdd : notes}
                    onChange={({ target }) => setNotesToAdd(target.value)}
                    placeholder="Click to add notes..."
                    disabled={itemBeingEdited !== name}
                    style={{
                      backgroundColor:
                        itemBeingEdited === name
                          ? "white"
                          : "rgb(226, 232, 240, 1)",
                      transition: "all .25s ease-in",
                    }}
                  ></textarea>
                  <div className="flex w-full items-start justify-center gap-8 overflow-hidden pb-4">
                    <button
                      className="flex h-8 w-20 items-center justify-center bg-slate-500 text-white"
                      onClick={() => {
                        dispatch({
                          type: ActionType.ANNOTATE,
                          payload: { name, notes: notesToAdd },
                        });
                      }}
                      style={{
                        opacity: notesToAdd === notes ? 0.2 : 1,
                      }}
                      disabled={notesToAdd === notes}
                    >
                      Confirm
                    </button>
                    <button
                      className="flex h-8 w-20 items-center justify-center bg-gray-300"
                      onClick={() => {
                        if (unsavedNotesChanges()) {
                          setDisplayDiscardNotesChanges({
                            openState: true,
                            nextItemBeingEdited: "",
                          });
                        } else {
                          setItemBeingEdited("");
                        }
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex h-16 w-full grow flex-row items-center justify-center pt-8 pb-20">
        <ConfirmDiscardNotesChanges
          displayDiscardNotesChanges={displayDiscardNotesChanges}
          setDisplayDiscardNotesChanges={setDisplayDiscardNotesChanges}
          itemBeingEdited={itemBeingEdited}
          setItemBeingEdited={setItemBeingEdited}
          notesToAdd={notesToAdd}
          setNotesToAdd={setNotesToAdd}
        />
        <ConfirmCart
          displayConfirmDialog={displayConfirmDialog}
          setDisplayConfirmDialog={setDisplayConfirmDialog}
          itemsToAdd={itemsToAdd}
          unsavedCartChanges={unsavedCartChanges}
          handleConfirmCartChange={handleConfirmCartChange}
        />
      </div>
    </>
  );
};
