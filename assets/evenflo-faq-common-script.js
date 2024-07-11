var evenFloFAQURL = "https://api.dev.evenflocms.howst.io/api/";

document
	.querySelectorAll(".description-wrapper button")
	.forEach((descBtn, index) => {
		let description = document.querySelectorAll(".description-wrapper p")[
			index
		];

		description.setAttribute("data-full-text", description.textContent);

		if (description.textContent.length > 50) {
			description.textContent =
				description.textContent.substring(0, 50) + "...";
		}

		descBtn.addEventListener("click", () => {
			document.querySelectorAll(".description-wrapper p").forEach((desc) => {
				let fullText = desc.getAttribute("data-full-text");
				if (fullText && fullText.length > 50) {
					desc.textContent = fullText.substring(0, 50) + "...";
				}
			});

			document
				.querySelectorAll(".description-wrapper button.active")
				.forEach((activeBtn) => {
					activeBtn.classList.remove("active");
				});

			descBtn.classList.add("active");

			description.textContent = description.getAttribute("data-full-text");
		});
	});

function formatPostedDate(timestamp) {
	const date = new Date(timestamp);

	// Extracting the date part
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");

	const formattedDate = `${year}-${month}-${day}`;
	return formattedDate;
}

function copyCurrentUrlToClipboard() {
	var dummyInput = document.createElement("input");

	dummyInput.value = window.location.href;

	document.body.appendChild(dummyInput);

	dummyInput.select();

	navigator.clipboard
		.writeText(dummyInput.value)
		.then(() => {
			alert("URL copied to clipboard");
		})
		.catch((err) => {
			console.error("Failed to copy:", err);
			alert("Failed to copy URL to clipboard");
		})
		.finally(() => {
			document.body.removeChild(dummyInput);
		});
}
