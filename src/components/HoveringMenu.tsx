import React, { useRef, useEffect } from "react";
import { useSlate, ReactEditor } from "slate-react";
import { Editor, Range } from "slate";
import styled from "styled-components";

import ReactDOM from "react-dom";

interface PortalProps {
	children: React.ReactNode;
}

const Portal: React.FC<PortalProps> = ({ children }) => {
	return ReactDOM.createPortal(children, document.body);
};

const Menu = styled.div`
	padding: 8px 10px 6px;
	position: absolute;
	z-index: 1;
	top: -10000px;
	left: -10000px;
	margin-top: -10px;
	opacity: 0;
	background-color: #ffffff;
	box-shadow: rgb(168, 168, 168) 0px 0px 29px -1px;
	border-radius: 4px;
	transition: opacity 0.45s;
`;

const HoveringMenu = () => {
	const ref = useRef<HTMLDivElement>(null);
	const editor = useSlate();

	useEffect(() => {
		if (ref && ref.current) {
			const el = ref.current;

			const { selection } = editor;

			if (!el) {
				return;
			}

			if (
				!selection ||
				!ReactEditor.isFocused(editor) ||
				Range.isCollapsed(selection) ||
				Editor.string(editor, selection) === ""
			) {
				el.removeAttribute("style");
				return;
			}

			const domSelection = window.getSelection();
			if (!domSelection) {
				return;
			}
			const domRange = domSelection.getRangeAt(0);
			const rect = domRange.getBoundingClientRect();

			el.style.opacity = "1";
			el.style.top = `${rect.top + window.pageYOffset - el.offsetHeight}px`;
			el.style.left = `${rect.left +
				window.pageXOffset -
				el.offsetWidth / 2 +
				rect.width / 2}px`;
		}
	});

	return (
		<Portal>
			<Menu ref={ref}>Hello</Menu>
		</Portal>
	);
};

export default HoveringMenu;
