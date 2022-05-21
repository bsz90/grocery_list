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
    <div className="flex h-screen w-full flex-col items-center justify-items-stretch">
      <Header
        cart={cart}
        setCart={setCart}
        setPageState={setPageState}
        unsavedCartChanges={unsavedCartChanges}
        setDisplayDiscardCartChanges={setDisplayDiscardCartChanges}
      />
      {(() => {
        if (pageState === "landing" || pageState === "continue") {
          return <Landing pageState={pageState} setPageState={setPageState} />;
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
      <ConfirmDiscardCartChanges
        setPageState={setPageState}
        displayDiscardCartChanges={displayDiscardCartChanges}
        setDisplayDiscardCartChanges={setDisplayDiscardCartChanges}
      />
    </div>
  );
}

export default App;
