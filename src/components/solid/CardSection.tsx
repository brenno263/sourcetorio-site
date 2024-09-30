import { createSignal, type ParentComponent } from "solid-js";
import Collapser from "./Collapser";

const CardSection: ParentComponent<{
	title?: string;
	collapsing?: boolean;
    startCollapsed?: boolean;
	extraClasses?: string[];
}> = (props) => {
	const [collapsed, setCollapsed] = createSignal<boolean>(props.startCollapsed ?? false);
	const listToClassList = (list: string[]): Record<string, true> => {
		const obj: Record<string, true> = {};
		list.forEach((classString) => (obj[classString] = true));
		return obj;
	};

	return (
		<section
			classList={listToClassList([
				"card-section",
				...(props.extraClasses ?? []),
			])}
		>
            <div style="display: flex">
                {props.title && <h2>{props.title}</h2>}
                {props.collapsing && (
                    <button style="height: 100%; margin-left: auto" onClick={() => setCollapsed((c) => !c)}>{collapsed() ? "expand" : "collapse"}</button>
                )}
            </div>
			{props.collapsing ? (
				<Collapser open={!collapsed()}>
					<div class="card-section-inlay">{props.children}</div>
				</Collapser>
			) : (
				<div class="card-section-inlay">{props.children}</div>
			)}
		</section>
	);
};

export default CardSection;
