import * as Dialog from "@radix-ui/react-dialog";
import { Dispatch, SetStateAction } from "react";
import { CartItem } from "./types";

export const ConfirmCart = ({
  displayConfirmDialog,
  setDisplayConfirmDialog,
  itemsToAdd,
  unsavedCartChanges,
  handleConfirmCartChange,
}: {
  displayConfirmDialog: boolean;
  setDisplayConfirmDialog: Dispatch<SetStateAction<boolean>>;
  itemsToAdd: CartItem[];
  unsavedCartChanges: boolean;
  handleConfirmCartChange: () => void;
}) => {
  return (
    <Dialog.Root open={displayConfirmDialog}>
      <Dialog.Trigger
        className="h-12 w-56
   rounded-xl bg-slate-500 text-white drop-shadow-md"
        onClick={() => setDisplayConfirmDialog(true)}
        style={{ opacity: unsavedCartChanges ? 1 : 0.5 }}
        disabled={!unsavedCartChanges}
      >
        Add To Cart
      </Dialog.Trigger>
      <Dialog.Portal className="h-full w-full">
        <Dialog.Overlay className="fixed top-0 z-10 h-full w-full bg-black/50" />
        <Dialog.Content
          className="fixed top-0 z-20 flex h-full w-full items-center justify-center"
          onClick={() => setDisplayConfirmDialog(false)}
        >
          <div className="relative flex h-auto w-full flex-col items-center justify-center bg-white">
            <Dialog.Title className="mt-12 text-2xl">Confirm</Dialog.Title>
            <Dialog.Description className="my-8 text-lg">
              Are you sure you want to add these items?
            </Dialog.Description>
            <ul>
              {itemsToAdd
                .filter((item) => item.total > 0)
                .map((item, id) => {
                  return (
                    <li key={id} className="capitalize">
                      {item.name}: {item.total}
                    </li>
                  );
                })}
            </ul>
            <div className="my-8 flex h-16 w-full items-center justify-center gap-10">
              <button
                className="h-12 w-36 rounded-xl bg-slate-500 text-white drop-shadow-md"
                onClick={handleConfirmCartChange}
              >
                Confirm
              </button>
              <button
                className="h-12 w-36 rounded-xl border-2 border-slate-500 bg-white drop-shadow-md"
                onClick={() => setDisplayConfirmDialog(false)}
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
