import { createEffect, createMemo, createSignal, onCleanup, onMount, type Component, type ParentComponent } from "solid-js";
import type { JSX } from "solid-js/h/jsx-runtime";

const ANIMATION_DURATION = 1200;

const Collapser: ParentComponent<{open: boolean}> = (props) => {

    type AnimStatus = "opening" | "closing" | "idle"
    const [animStatus, setAnimStatus] = createSignal<AnimStatus>("idle");
    const [currrentlyOpen, setCurrentlyOpen] = createSignal(props.open);
    const [renderChildren, setRenderChildren] = createSignal(props.open);
    const [maxHeight, setMaxHeight] = createSignal<JSX.CSSProperties["max-height"]>(undefined);
    let divRef: HTMLDivElement | undefined;

    const waitATick = async () => new Promise((res) => setTimeout(res, 1));

    const show = async () => {
        setAnimStatus("opening");
        setCurrentlyOpen(true);
        setMaxHeight(0);
        setRenderChildren(true);
        await waitATick();
        divRef!.animate([{
            "height": "0px",
        }, {
            "height": `${divRef!.scrollHeight}px`,
        }], {
            duration: ANIMATION_DURATION,
            easing: "cubic-bezier(0.9, 0, 0.1, 1)",
            fill: "forwards",
        });
        setTimeout(() => setAnimStatus("idle"), ANIMATION_DURATION);
    }

    const hide = async () => {
        setAnimStatus("closing");
        setCurrentlyOpen(false);
        divRef!.animate([{
            "height": `${divRef!.scrollHeight}px`,
        }, {
            "height": "0px",
        }], {
            duration: ANIMATION_DURATION,
            easing: "cubic-bezier(0.5, 1.3, 0.8, -1.3)",
            fill: "forwards",
        });
        setTimeout(() => setAnimStatus("idle"), ANIMATION_DURATION);
    }

    createEffect(() => {
        if(animStatus() !== "idle") return;
        if(props.open && !currrentlyOpen()) {
            show();
        } else if ( !props.open && currrentlyOpen()) {
            hide();
        }
    });

    // if we're idle and closed, we can go ahead and remove children from the DOM.
    createEffect(() => {
        if(animStatus() === "idle" && !currrentlyOpen() && !props.open) {
            setRenderChildren(false);
        }
    })

    return (
        <div 
            style={{
                // transition: "max-height 1.2s ease-in-out",
                // "max-height": maxHeight(),
                overflow: animStatus() !== "idle" || !currrentlyOpen() ? "hidden" : undefined,
            }}
            ref={divRef}
        >
            {renderChildren() && props.children}
        </div>
    );
}

export default Collapser;