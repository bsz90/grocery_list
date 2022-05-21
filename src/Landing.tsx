import { Dispatch, SetStateAction } from "react";
import { categories } from "./constants";

export const Landing = ({
  pageState,
  setPageState,
}: {
  pageState: string;
  setPageState: Dispatch<SetStateAction<string>>;
}) => {
  return (
    <div className="flex h-full w-full flex-col items-center pt-14">
      <div className="flex h-[650px] w-full flex-col items-center justify-start gap-2 overflow-hidden">
        <div className="flex h-16 w-56 flex-none items-center justify-center rounded-xl bg-slate-500 py-4 drop-shadow-md">
          <h1 className="text-2xl text-white">Build Your List</h1>
        </div>
        {categories.map(({ type }, id) => {
          return (
            <button
              className="h-12 w-56 flex-none rounded-lg border bg-white capitalize drop-shadow-md"
              key={type}
              onClick={() => setPageState(type)}
            >
              {type}
            </button>
          );
        })}
      </div>
    </div>
  );
};
