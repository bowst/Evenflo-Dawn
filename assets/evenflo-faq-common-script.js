var evenFloFAQURL = "https://1739-182-185-217-240.ngrok-free.app/api/";

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

// document.querySelectorAll(".tab-header button").forEach((tabBtn, index) => {
// 	let tabContentWrapper = document.querySelectorAll(".tab-content-wrapper")[
// 		index
// 	];
// 	tabBtn.addEventListener("click", () => {
// 		document
// 			.querySelectorAll(
// 				".tab-header button.active, .tab-content-wrapper.active"
// 			)
// 			.forEach((activeElement) => {
// 				activeElement.classList.remove("active");
// 			});

// 		tabBtn.classList.add("active");
// 		tabContentWrapper.classList.add("active");
// 	});
// });
