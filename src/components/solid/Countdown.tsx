import classes from "./Countdown.module.css";
import { createMemo, createSignal, onCleanup, onMount, type Component } from "solid-js";

const DAY = 1000 * 60 * 60 * 24;
const HOUR = 1000 * 60 * 60;
const MINUTE = 1000 * 60;
const SECOND = 1000;

const Countdown: Component<{releaseDateString: string}> = (props) => {
    const releaseDateMs = createMemo(() => 
        Number(new Date(props.releaseDateString))
    );
    const getTimeLeft = () => {
        return releaseDateMs() - Number(new Date());
    }

    const [ms, setMs] = createSignal(getTimeLeft());

    const msToDays = (ms: number) => Math.floor(ms / DAY);
    const msToHours = (ms: number) => Math.floor((ms % DAY) / HOUR);
    const msToMinutes = (ms: number) => Math.floor((ms % HOUR) / MINUTE);
    const msToSeconds = (ms: number) => Math.floor((ms % MINUTE) / SECOND);

    const leftPadNumber = (digits: number, n: number) => {
        let str = String(n);
        while (str.length < digits) {
            str = "0" + str;
        }
        return str;
    }
    

    onMount(() => {
        let animationFrame = requestAnimationFrame(updateAnimation);
        function updateAnimation() {
        setMs(getTimeLeft());
        animationFrame = requestAnimationFrame(updateAnimation);
        }

        onCleanup(() => {
            cancelAnimationFrame(animationFrame);
        })
    })


    return (
        <div classList={{[classes["container"]]: true, [classes["shaking"]]: ms() < DAY}}>
            <p class={classes.number}>
                {msToDays(ms())}
                :{leftPadNumber(2, msToHours(ms()))}
                :{leftPadNumber(2, msToMinutes(ms()))}
                :{leftPadNumber(2, msToSeconds(ms()))}
                :{leftPadNumber(3, ms() % 1000)}
            </p>
        </div>
    );
}

export default Countdown;