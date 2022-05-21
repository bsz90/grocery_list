import * as Dialog from "@radix-ui/react-dialog";
import { Dispatch, SetStateAction } from "react";

export const ConfirmDiscardCartChanges = ({
  setPageState,
  displayDiscardCartChanges,
  setDisplayDiscardCartChanges,
}: {
  setPageState: Dispatch<SetStateAction<string>>;
  displayDiscardCartChanges: {
    openState: boolean;
    nextPageState: string;
  };
  setDisplayDiscardCartChanges: Dispatch<
    SetStateAction<{ openState: boolean; nextPageState: string }>
  >;
}) => {
  return (
    <Dialog.Root open={displayDiscardCartChanges.openState} modal={true}>
      <Dialog.Portal className="h-full w-full">
        <Dialog.Overlay className="fixed top-0 z-10 h-full w-full bg-gray-600/50" />
        <Dialog.Content className="fixed top-0 z-20 flex h-full w-full items-center justify-center">
          <div className="relative flex h-auto w-full flex-col items-center justify-center bg-white">
            <Dialog.Title className="mt-12">
              Discard unsaved changes to your cart?
            </Dialog.Title>
            <div className="my-8 flex h-16 w-full items-center justify-center gap-10">
              <button
                className="h-12 w-36 rounded-xl bg-slate-500 text-white drop-shadow-md"
                onClick={() => {
                  setPageState(displayDiscardCartChanges.nextPageState);
                  setDisplayDiscardCartChanges({
                    openState: false,
                    nextPageState: "",
                  });
                }}
              >
                Confirm
              </button>
              <button
                className="h-12 w-36 rounded-xl border-2 border-slate-500 bg-white drop-shadow-md"
                onClick={() =>
                  setDisplayDiscardCartChanges({
                    openState: false,
                    nextPageState: "",
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
