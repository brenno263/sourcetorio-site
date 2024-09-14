import classes from "./Countdown.module.css";
import { createMemo, createSignal, onCleanup, onMount } from "solid-js";

const DAY = 1000 * 60 * 60 * 24;
const HOUR = 1000 * 60 * 60;
const MINUTE = 1000 * 60;
const SECOND = 1000;

export function Countdown(props: {releaseDateString: string}) {
    const releaseDateMs = createMemo(() => {
        console.log("foo");
        return Number(new Date(props.releaseDateString));
    });
    const getTimeLeft = () => {
        return releaseDateMs() - Number(new Date());
    }

    const [ms, setMs] = createSignal(getTimeLeft());

    const msToDays = (ms: number) => Math.floor(ms / DAY);
    const msToHours = (ms: number) => Math.floor((ms % DAY) / HOUR);
    const msToMinutes = (ms: number) => Math.floor((ms % HOUR) / MINUTE);
    const msToSeconds = (ms: number) => Math.floor((ms % MINUTE) / SECOND);

    const leftPadNumber = (n: number, digits: number) => {
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
        <div class={classes["container"]}>
            <p class={classes.number}>{msToDays(ms())}:{leftPadNumber(msToHours(ms()), 2)}:{leftPadNumber(msToMinutes(ms()), 2)}:{leftPadNumber(msToSeconds(ms()), 2)}:{leftPadNumber(ms() % 1000, 3)}</p>
            
        </div>
    );
}