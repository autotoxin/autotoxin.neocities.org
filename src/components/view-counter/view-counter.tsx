import { useEffect, useRef, useState } from "react";
import "../../styles/features/view-counter.css";
import { getVisitorCount } from "./utils/get-visitor-count";
import { padNum } from "./utils/pad-num";
import type { VisitorCountData } from "./view-counter.d";

const REFRESH_RATE = 25;
const MAX_DIGITS = 7;
const ANIMATION_DURATION = 1000;
const ANIMATION_DURATION_OFFSET = 100;

interface ViewCounterProps {
    id: string;
}

const ViewCounter = ({ id }: ViewCounterProps) => {
    const [visitorCountData, setVisitorCountData] = useState<VisitorCountData>();
    const [chars, setChars] = useState<string[]>(Array(MAX_DIGITS).fill("?"));
    const [isHovered, setIsHovered] = useState(false);
    const isAnimationFinishedStates = useRef<boolean[]>(Array(MAX_DIGITS).fill(false));
    const startTimes = useRef<number[]>(Array(MAX_DIGITS).fill(0));
    const animationFrameIds = useRef<number[]>(Array(MAX_DIGITS).fill(0));

    const animate = (idx: number, target: number | string, lastTime = performance.now()) => {
        // console.log(`Animating char at index ${idx} towards target '${target}'`);
        if (isAnimationFinishedStates.current[idx]) return;

        const diff = performance.now() - lastTime;
        // end animation
        if (performance.now() - startTimes.current[idx] > ANIMATION_DURATION + idx * ANIMATION_DURATION_OFFSET) {
            // console.log(`Animation finished for index ${idx}, setting final char '${target}'`);
            isAnimationFinishedStates.current[idx] = true;
            setChar(idx, target.toString());
            return;
        }
        const afId = requestAnimationFrame(() => animate(idx, target, lastTime));
        animationFrameIds.current[idx] = afId;

        // throttle animation
        if (diff < REFRESH_RATE) return;

        lastTime = performance.now();
        setChar(idx, Math.floor(Math.random() * 10).toString());
    };

    const setFinalChars = (views: number) => {
        const targets = padNum(views, MAX_DIGITS).split("");
        setChars(targets);
    };

    const setChar = (index: number, char: string) => {
        setChars((prev) => {
            const newChars = [...prev];
            newChars[index] = char;
            return newChars;
        });
    };

    const initializeAnimation = (views: number) => {
        // do not animate if user prefers reduced motion
        const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        if (motionQuery.matches) {
            setFinalChars(views);
            return;
        }

        console.log("Starting animation for views:", views);

        isAnimationFinishedStates.current = Array(MAX_DIGITS).fill(false);
        const targets = views < Math.pow(10, MAX_DIGITS) ? padNum(views, MAX_DIGITS).split("") : "TOOMANY".split("");
        chars.forEach((_, idx) => {
            startTimes.current[idx] = performance.now();
            const afId = requestAnimationFrame(() => animate(idx, targets[idx]));
            animationFrameIds.current[idx] = afId;
        });
    };

    // trigger only once - get visitor count from API
    useEffect(() => {
        getVisitorCount()
            .then((data) => {
                setVisitorCountData(data);
                console.log("Visitor count data fetched:", data);
            })
            .catch((error) => {
                setVisitorCountData(undefined);
                console.error("Error fetching view count:", error);
            });
    }, []);

    useEffect(() => {}, [isHovered]);

    // trigger when visitorCountData changes or hover state changes and start animation
    useEffect(() => {
        if (!visitorCountData) return;
        console.log("Initializing animation with visitor count data:", visitorCountData);
        initializeAnimation(isHovered ? visitorCountData.unique : visitorCountData.total);

        return () => {
            animationFrameIds.current.forEach((id) => cancelAnimationFrame(id));
            isAnimationFinishedStates.current = Array(MAX_DIGITS).fill(true);
        };
    }, [visitorCountData, isHovered]);

    return (
        <section
            className="flex flex-col items-center gap-1"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <h4 className="text-secondary bg-background rounded-pixelated-2 px-1 py-0.5 leading-none">
                {isHovered ? "you are unique visitor" : "this is visit"} <small>#</small>
            </h4>
            <div
                id={id}
                className="view-counter"
                aria-label={
                    isHovered
                        ? `You are unique visitor #${visitorCountData?.unique}`
                        : `This is a visit #${visitorCountData?.total}`
                }
            >
                {chars.map((char, idx) => (
                    <span key={idx}>{char}</span>
                ))}
            </div>
            <div className="text-primary bg-background rounded-pixelated-2 px-1 py-0.5 leading-none">thank you!</div>
        </section>
    );
};

export default ViewCounter;
