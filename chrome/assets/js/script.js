class PIPController {
	constructor() {
		this.element = null;

		const config = {
			childList: true,
			subtree: true
		}

		const mutationTimeout = 500;
		let mutating = null;
		let prevHref = null;
		
		// SPA navigation handler
		this.observer = new MutationObserver(() => {
			if (this.isPlayerPage()) {
				clearTimeout(mutating);
				
				// Wait for mutation to stop
				mutating = setTimeout(() => {
					// Attempt to inject PIP controls
					if (prevHref !== window.location.href) {
						this.injectPipControls();
						prevHref = window.location.href;
					}
				}, mutationTimeout);
			} else {
				prevHref = window.location.href;
			}
		});

		this.observer.observe(window.document.body, config);
	}

	// Returns true if the page is /video/
	isPlayerPage() {
		const url = new URL(window.location);
		const pathname = url.pathname.split("/");

		return pathname[1] === "video" ? true : false;
	}

	// Enter/exit PIP mode
	togglePictureInPicture() {
		if (document.pictureInPictureElement) {
			document.exitPictureInPicture();
		} else {
			if (document.pictureInPictureEnabled) {
				this.element.requestPictureInPicture();
			}
		}
	}

	// Generate the PIP toggle button from existing SVG icons on Disney+
	createPipButton() {
		const type = "button";

		const pip = document.createElement(type);
		pip.type = type;
		pip.role = type;
		pip.tabindex = "0";
		pip.classList = "control-icon-btn fullscreen-icon";

		pip.innerHTML = `<div class="focus-hack-div " tabindex="-1"><svg tabindex="-1" focusable="false"><use xlink:href="#067--arrow-down" style="transform: rotate(180deg) scale(0.6);transform-origin: 50% 50%;"></use><use xlink:href="#014--fullscreen"></use></svg></div>`;

		pip.addEventListener("click", () => this.togglePictureInPicture());

		return pip;
	}

	// Insert the PIP toggle button and enable PIP on the video element
	injectPipControls() {
		this.element = document.getElementsByTagName("video")[0];

		if (!this.isPlayerPage() || !this.element) {
			return false;
		}

		this.element.disablePictureInPicture = false;

		// Inject the PIP toggle button
		const target = document.querySelector("#hudson-wrapper .controls__right");
		target.insertAdjacentElement("afterbegin", this.createPipButton());
	}
}

window.addEventListener("load", () => new PIPController(), { once: true });