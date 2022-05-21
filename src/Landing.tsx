import { Dispatch, SetStateAction, useState } from "react";
import { categories } from "./constants";

export const Landing = ({
  pageState,
  setPageState,
}: {
  pageState: string;
  setPageState: Dispatch<SetStateAction<string>>;
}) => {
  const [landingOpenState, setLandingOpenState] = useState(
    pageState === "landing" ? false : true
  );

  function heading() {
    switch (pageState) {
      case "landing": {
        if (landingOpenState) {
          return "Build Your List";
        }
        return "Get Started";
      }
      case "home":
        return "Build Your List";
      case "continue":
        return "Choose Another Category";
      default:
        throw new Error();
    }
  }
  // pageState === "landing"
  //   ? landingOpenState
  //     ? "Build Your List"
  //     : "Get Started"
  //   : pageState === "continue"
  //   ? "Choose Another Category" :
  //   : "Build Your List";

  return (
    <div className="absolute top-0 flex h-screen w-full flex-col items-center justify-center">
      <div
        className="flex w-full flex-col items-center justify-start gap-2 overflow-hidden"
        style={{
          height: landingOpenState ? "650px" : "80px",
          transition: "height .3s ease-out",
        }}
      >
        <button
          className="flex h-20 w-56 flex-none items-center justify-center rounded-xl bg-slate-500 py-4 drop-shadow-md"
          onClick={() => setLandingOpenState((prev) => !prev)}
          disabled={pageState !== "landing"}
        >
          <h1 className=" text-2xl text-white">{heading()}</h1>
        </button>
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
