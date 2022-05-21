import { useState } from "react";
import { Landing } from "./Landing";
import { Items } from "./Items";
import { items } from "./constants";
import { Header } from "./Header";
import { Cart } from "./Cart";
import { ConfirmDiscardCartChanges } from "./ConfirmDiscardCartChanges";

function App() {
  const [pageState, setPageState] = useState("landing");

  const [cart, setCart] = useState(items);

  const [unsavedCartChanges, setUnsavedCartChanges] = useState(false);

  const [displayDiscardCartChanges, setDisplayDiscardCartChanges] = useState({
    openState: false,
    nextPageState: "",
  });

  return (
    <div className="h-screen w-full">
      <Header
        cart={cart}
        setCart={setCart}
        setPageState={setPageState}
        unsavedCartChanges={unsavedCartChanges}
        setDisplayDiscardCartChanges={setDisplayDiscardCartChanges}
      />
      <div className="flex h-auto w-full flex-col items-center justify-center gap-4">
        {(() => {
          if (
            pageState === "landing" ||
            pageState === "continue" ||
            pageState === "home"
          ) {
            return (
              <Landing pageState={pageState} setPageState={setPageState} />
            );
          }
          if (pageState === "cart") {
            return <Cart cart={cart} setCart={setCart} />;
          }
          return (
            <Items
              cart={cart}
              setCart={setCart}
              pageState={pageState}
              setPageState={setPageState}
              unsavedCartChanges={unsavedCartChanges}
              setUnsavedCartChanges={setUnsavedCartChanges}
            />
          );
        })()}
      </div>
      <ConfirmDiscardCartChanges
        setPageState={setPageState}
        displayDiscardCartChanges={displayDiscardCartChanges}
        setDisplayDiscardCartChanges={setDisplayDiscardCartChanges}
      />
    </div>
  );
}

export default App;
