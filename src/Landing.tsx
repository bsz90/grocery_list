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
    <div className="my-14 flex w-3/4 flex-col items-center overflow-hidden rounded-xl drop-shadow-lg">
      <div className="flex h-16 w-full flex-none items-center justify-center bg-slate-500 py-4 drop-shadow-md">
        <h1 className="text-2xl text-white">Build Your List</h1>
      </div>
      <div className="flex h-full w-full flex-col gap-[1px] overflow-x-hidden overflow-y-scroll rounded-b-xl">
        {categories.map(({ type }, id) => {
          return (
            <button
              className="h-16 w-full flex-none bg-white capitalize drop-shadow-md"
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
