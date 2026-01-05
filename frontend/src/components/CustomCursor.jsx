import React, {useState, useEffect, useRef} from "react";

const CustomCursor = () => {
	const [mouseX, setMouseX] = useState(0);
	const [mouseY, setMouseY] = useState(0);
	const [cursorPos, setCursorPos] = useState({x: 0, y: 0});
	const cursorRef = useRef(null);
	const followerRef = useRef(null);

	// Mouse movement and cursor positioning
	useEffect(() => {
		const moveCursor = (e) => {
			setMouseX(e.clientX);
			setMouseY(e.clientY);

			if (cursorRef.current) {
				cursorRef.current.style.left = `${e.clientX}px`;
				cursorRef.current.style.top = `${e.clientY}px`;
			}
		};

		const handleLinkHover = () => {
			document.body.classList.add("hovering");
		};

		const handleLinkLeave = () => {
			document.body.classList.remove("hovering");
		};

		const handleFooterHover = (e) => {
			if (e.target.closest("footer")) {
				document.body.classList.add("cursor-inverted");
			} else {
				document.body.classList.remove("cursor-inverted");
			}
		};

		// Add event listeners
		document.addEventListener("mousemove", moveCursor);
		document.addEventListener("mousemove", handleFooterHover);

		// Setup hover effects for interactive elements
		const setupHoverListeners = () => {
			const interactables = document.querySelectorAll(
				"a, button, input, select, textarea, .service-card-modern, .slide-indicator, .project-card, .nav-item, .action-btn, .checkbox-label, .image-upload-area"
			);

			interactables.forEach((el) => {
				el.addEventListener("mouseenter", handleLinkHover);
				el.addEventListener("mouseleave", handleLinkLeave);
			});

			return interactables;
		};

		let interactables = setupHoverListeners();

		// Use MutationObserver to handle dynamically added elements
		const observer = new MutationObserver(() => {
			// Clean up old listeners
			interactables.forEach((el) => {
				el.removeEventListener("mouseenter", handleLinkHover);
				el.removeEventListener("mouseleave", handleLinkLeave);
			});
			// Setup new listeners
			interactables = setupHoverListeners();
		});

		observer.observe(document.body, {
			childList: true,
			subtree: true,
		});

		return () => {
			document.removeEventListener("mousemove", moveCursor);
			document.removeEventListener("mousemove", handleFooterHover);
			observer.disconnect();
			interactables.forEach((el) => {
				el.removeEventListener("mouseenter", handleLinkHover);
				el.removeEventListener("mouseleave", handleLinkLeave);
			});
		};
	}, []);

	// Smooth follower animation loop
	useEffect(() => {
		let animationId;

		const animateFollower = () => {
			setCursorPos((prevPos) => ({
				x: prevPos.x + (mouseX - prevPos.x) / 9,
				y: prevPos.y + (mouseY - prevPos.y) / 9,
			}));
			animationId = requestAnimationFrame(animateFollower);
		};

		animateFollower();

		return () => {
			if (animationId) {
				cancelAnimationFrame(animationId);
			}
		};
	}, [mouseX, mouseY]);

	return (
		<>
			<div ref={cursorRef} className="custom-cursor"></div>
			<div
				ref={followerRef}
				className="cursor-follower"
				style={{left: cursorPos.x, top: cursorPos.y}}
			></div>
		</>
	);
};

export default CustomCursor;
