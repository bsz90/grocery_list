export enum ActionType {
  INCREMENT = "increment",
  DECREMENT = "decrement",
  MANUAL_INPUT = "manual_input",
  ANNOTATE = "annotate",
  UPDATE = "update",
  RESET = "reset",
}

export type Action =
  | {
      type: ActionType.INCREMENT;
      payload: { name: string; type: string };
    }
  | {
      type: ActionType.DECREMENT;
      payload: { name: string };
    }
  | {
      type: ActionType.MANUAL_INPUT;
      payload: { name: string; total: number };
    }
  | {
      type: ActionType.ANNOTATE;
      payload: { name: string; notes: string };
    }
  | {
      type: ActionType.UPDATE;
      payload: { name: undefined; cart: CartItem[]; newPageState: string };
    }
  | {
      type: ActionType.RESET;
      payload: null;
    };

export type CartAction =
  | {
      type: ActionType.INCREMENT;
      payload: null;
    }
  | {
      type: ActionType.DECREMENT;
      payload: null;
    }
  | {
      type: ActionType.MANUAL_INPUT;
      payload: { total: number };
    };

export type CartItem = {
  name: string;
  type: string;
  total: number;
  notes: string;
  checked: boolean;
};
