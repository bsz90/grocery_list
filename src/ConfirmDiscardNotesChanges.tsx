import * as Dialog from "@radix-ui/react-dialog";
import { Dispatch, SetStateAction } from "react";

export const ConfirmDiscardNotesChanges = ({
  displayDiscardNotesChanges,
  setDisplayDiscardNotesChanges,
  itemBeingEdited,
  setItemBeingEdited,
  notesToAdd,
  setNotesToAdd,
}: {
  displayDiscardNotesChanges: {
    openState: boolean;
    nextItemBeingEdited: string;
  };
  setDisplayDiscardNotesChanges: Dispatch<
    SetStateAction<{ openState: boolean; nextItemBeingEdited: string }>
  >;
  itemBeingEdited: string | undefined;
  setItemBeingEdited: Dispatch<SetStateAction<string | undefined>>;
  notesToAdd: string | undefined;
  setNotesToAdd: Dispatch<SetStateAction<string>>;
}) => {
  return (
    <Dialog.Root open={displayDiscardNotesChanges.openState} modal={true}>
      <Dialog.Portal className="h-full w-full">
        <Dialog.Overlay className="fixed top-0 z-10 h-full w-full bg-black/50" />
        <Dialog.Content className="fixed top-0 z-20 flex h-full w-full items-center justify-center">
          <div className="relative flex h-auto w-full flex-col items-center justify-center bg-white">
            <Dialog.Title className="mt-12 mb-8 text-center text-2xl">
              Discard the notes to {itemBeingEdited}?
            </Dialog.Title>
            <Dialog.Description>{notesToAdd}</Dialog.Description>
            <div className="my-8 flex h-16 w-full items-center justify-center gap-10">
              <button
                className="h-12 w-36 rounded-xl bg-slate-500 text-white drop-shadow-md"
                onClick={() => {
                  setItemBeingEdited(
                    displayDiscardNotesChanges.nextItemBeingEdited
                  );
                  setDisplayDiscardNotesChanges({
                    openState: false,
                    nextItemBeingEdited: "",
                  });
                  setNotesToAdd("");
                }}
              >
                Confirm
              </button>
              <button
                className="h-12 w-36 rounded-xl border-2 border-slate-500 bg-white drop-shadow-md "
                onClick={() =>
                  setDisplayDiscardNotesChanges({
                    openState: false,
                    nextItemBeingEdited: "",
                  })
                }
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
