import { createEffect,  createSignal,  type ParentComponent } from "solid-js";
import type { JSX } from "solid-js/h/jsx-runtime";

const ANIMATION_DURATION = 1200;

const Collapser: ParentComponent<{open: boolean}> = (props) => {

    type AnimStatus = "opening" | "closing" | "idle"
    const [animStatus, setAnimStatus] = createSignal<AnimStatus>("idle");
    const [currrentlyOpen, setCurrentlyOpen] = createSignal(props.open);
    const [renderChildren, setRenderChildren] = createSignal(props.open);
    const [maxHeight, setMaxHeight] = createSignal<JSX.CSSProperties["max-height"]>(undefined);
    let divRef: HTMLDivElement | undefined;

    const waitATick = async () => new Promise((res) => setTimeout(res, 5));

    const show = async () => {
        setAnimStatus("opening");
        setCurrentlyOpen(true);

        // set invisible & wait for apply
        setMaxHeight(0);
        await waitATick();

        // turn children on & wait for apply
        setRenderChildren(true);
        await waitATick();

        // set animation + end hook & wait for apply
        const showAnimHandle = divRef!.animate([{
            "height": "0px",
        }, {
            "height": `${divRef!.scrollHeight}px`,
        }], {
            duration: ANIMATION_DURATION,
            easing: "cubic-bezier(0.9, 0, 0.1, 1)",
            fill: "forwards",
        });
        setTimeout(() => {
            setAnimStatus("idle");
            showAnimHandle.cancel();
        }, ANIMATION_DURATION + 10);
        await waitATick();

        // make things visible again so we can see the animation
        setMaxHeight(undefined);
    }

    const hide = async () => {
        setAnimStatus("closing");
        setCurrentlyOpen(false);
        const hideAnimHandle = divRef!.animate([{
            "height": `${divRef!.scrollHeight}px`,
        }, {
            "height": "0px",
        }], {
            duration: ANIMATION_DURATION,
            easing: "cubic-bezier(0.5, 1.3, 0.8, -1.3)",
            fill: "forwards"
        });
        setTimeout(() => {
            setAnimStatus("idle");
            hideAnimHandle.cancel();
        }, ANIMATION_DURATION + 10);
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
                "max-height": maxHeight(),
                overflow: animStatus() !== "idle" || !currrentlyOpen() ? "hidden" : undefined,
            }}
            ref={divRef}
        >
            {renderChildren() && props.children}
        </div>
    );
}

export default Collapser;