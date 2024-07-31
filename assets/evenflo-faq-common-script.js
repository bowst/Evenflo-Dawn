var evenFloFAQURL = "https://api.dev.evenflocms.howst.io/api/";

toggleAnswerText();

function toggleAnswerText() {
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
}

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

//For appending loader in specific div
function appendLoader(container) {
	//Creating loader div through javascript
	const loader = document.createElement("div");
	loader.id = "loader";
	loader.className = "loader";
	container.appendChild(loader);
	if (loader) {
		loader.style.display = "block";
	}
	return loader;
}

//For hiding the loader
function hideLoader(loader) {
	loader.style.display = "none";
}

function fetchPopularProductsData(popularByProduct = false) {
	const container = document.getElementById("popularCards");
	const popularQuestionBlock = document.getElementById("popularQuestionBlock");
	let blocksToShow = popularQuestionBlock
		? popularQuestionBlock.dataset.productsToShow
		: 3;

	if (!container) {
		console.log("Error on getting container");
		return;
	}

	container.innerHTML = ""; // Clear existing content
	const loader = appendLoader(container);

	let url = popularByProduct
		? evenFloFAQURL + "faqs/popular"
		: evenFloFAQURL + "faqs/popular";

	fetch(url)
		.then((response) => response.json())
		.then((data) => {
			console.log("data", data);
			data.slice(0, blocksToShow).forEach((product) => {
				const popularCard = document.createElement("div");
				popularCard.classList.add("popular-card");

				let faqsContent = "";
				let tags = [];
				let tagsHtml = "";

				product?.products.forEach((nestedProduct) => {
					faqsContent += `<span>${nestedProduct?.name}</span>`;
				});

				product?.tags.forEach((tag) => {
					tags[tag?.id] = tag?.name;
				});

				const uniquetagsArray = tags?.filter(
					(value, index, self) => self.indexOf(value) === index
				);

				uniquetagsArray?.forEach((category, id) => {
					tagsHtml += `<a href="https://abc.com/${category}">${category}</a>`;
				});

				popularCard.innerHTML = `
			 
			  <div class="heading">
				<h3>${product?.topic?.name || ""}</h3>
				<h2>${product.question}</h2>
				<div class="description-wrapper">
				  <p>${faqsContent}</p>
				  <button>
					<span>Show more</span>
					<svg aria-hidden="true" focusable="false" class="icon icon-caret" viewBox="0 0 10 6">
					  <path fill-rule="evenodd" clip-rule="evenodd" d="M9.354.646a.5.5 0 00-.708 0L5 4.293 1.354.646a.5.5 0 00-.708.708l4 4a.5.5 0 00.708 0l4-4a.5.5 0 000-.708z" fill="currentColor"></path>
					</svg>
				  </button>
				</div>
			  </div>
			  <div class="card-content">
				<div class="card-detail-wrapper">
				  <p>${product.answer}</p>
				  <div class="card-content-link">
					<a href="/pages/evenflo-faq-answer?qid=${product?.id}">Read Answer</a>
				  </div>
				</div>
				<div class="card-link-wrapper">
				  ${tagsHtml}
				</div>
			  </div>
			`;
				container.appendChild(popularCard);
			});
		})
		.catch((error) => {
			console.error("Error fetching products:", error);
		})
		.finally(() => {
			// Hide the loader
			if (loader) {
				hideLoader(loader);
				toggleAnswerText();
			}
		});
}
