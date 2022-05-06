class PIPController {
	constructor() {
		this.element = null;
		
		// SPA navigation handler
		this.observer = new MutationObserver(() => {
			if (this.isPlayerPage()) {
				this.injectPipControls();
			}
		});

		this.observer.observe(window.document.body, {
			childList: true,
			subtree: true
		});
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
		pip.id = "pip-btn";
		pip.type = type;
		pip.role = type;
		pip.tabindex = "0";
		pip.classList = "control-icon-btn fullscreen-icon";

		pip.innerHTML = `<div class="focus-hack-div " tabindex="-1"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 -1 27 27" tabindex="-1" focusable="false"><path fill="#ffffff" d="M19 11h-8v6h8v-6zm4 8V4.98C23 3.88 22.1 3 21 3H3c-1.1 0-2 .88-2 1.98V19c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2zm-2 .02H3V4.97h18v14.05z"/></svg></div>`;

		pip.addEventListener("click", () => this.togglePictureInPicture());

		return pip;
	}

	// PIP element has been created and injected into the DOM
	hasPipControls() {
		return document.getElementById("pip-btn") ? true : false;
	}

	// Insert the PIP toggle button and enable PIP on the video element
	injectPipControls() {
		if (this.hasPipControls()) {
			return true;
		}

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