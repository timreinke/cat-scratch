import { Draft, PatchListener, produce } from 'immer';
import {
    assign as xstateAssign, AssignAction,
    AssignMeta, EventObject
} from 'xstate';


export type ImmerAssigner<TContext, TEvent extends EventObject> = (
    context: Draft<TContext>,
    event: TEvent,
    meta: AssignMeta<TContext, TEvent>
) => void;

type ImmerAssigners<TContext, TEvent extends EventObject = EventObject> = {
    plain: AssignAction<TContext, TEvent>,
    listener: (listener: PatchListener) => AssignAction<TContext, TEvent>
}

function immerAssign<TContext, TEvent extends EventObject = EventObject>(
    recipe: ImmerAssigner<TContext, TEvent>
): ImmerAssigners<TContext, TEvent> {
    return {
        plain: xstateAssign((context, event, meta) => {
            return produce(context, (draft) => recipe(draft, event, meta));
        }), listener: function (listener) {
            let f: AssignAction<TContext, TEvent> = xstateAssign((context, event, meta) => {
                return produce(context, (draft) => recipe(draft, event, meta), listener);
            });
            return f;
        }
    }
}

export { immerAssign as assign };
