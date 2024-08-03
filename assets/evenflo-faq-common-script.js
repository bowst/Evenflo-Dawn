var evenFloFAQURL = "https://api.dev.evenflocms.howst.io/api/";

toggleAnswerBullet();

function toggleAnswerBullet() {
	let descriptionWrapper = document.querySelectorAll(".description-wrapper");
	descriptionWrapper.forEach((desc, index) => {
		let bullet = desc.querySelectorAll("ul li").length;
		if (bullet > 1) {
			desc.classList.remove("description-wrapper-remove");
			desc.querySelector("button").addEventListener("click", () => {
				desc.classList.toggle("description-wrapper-show");
			});
		} else {
			desc.classList.add("description-wrapper-remove");
		}
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
			data.slice(0, blocksToShow).forEach((product) => {
				const popularCard = document.createElement("div");
				popularCard.classList.add("popular-card");

				const faqsContent = getFAQContent(product?.products || []);

				const tags = getTagsArray(product?.tags || []);

				const tagsHtml = getTagsHtml(tags);

				popularCard.innerHTML = setThreeBlockInnerHtml(
					product?.topic?.name || "",
					product.question,
					faqsContent,
					product.answer,
					product?.id,
					tagsHtml
				);
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
				toggleAnswerBullet();
			}
		});
}

function fetchTopicsByType(id, productPage = false) {
	const container = document.getElementById("selectTopic");

	if (!container) {
		return;
	}

	container.innerHTML = "";

	const defaultOption = document.createElement("option");
	defaultOption.value = "";
	defaultOption.textContent = "Select Topic";
	container.appendChild(defaultOption);

	let url = evenFloFAQURL + `topics/?page=1&collection_id=${id}`;
	if (productPage) {
		url = evenFloFAQURL + `topics/?page=1&product_id=${id}`;
	}

	fetch(url)
		.then((response) => response.json())
		.then((data) => {
			data?.results.forEach((topic) => {
				const option = document.createElement("option");
				option.value = topic.id;
				option.textContent = topic.name;
				container.appendChild(option);
			});
		})
		.catch((error) => {
			console.error("Error fetching topics:", error);
		});
}

let debounceTimeout;
function debouncedSearch(event) {
	clearTimeout(debounceTimeout);
	debounceTimeout = setTimeout(() => {
		handleDropDownChange(event);
	}, 500);
}

function getTagsArray(tags) {
	const allTags = [];

	tags?.forEach((tag) => {
		if (tag?.id && tag?.name) {
			allTags.push({ id: tag.id, name: tag.name });
		}
	});

	return allTags;
}

function getTagsHtml(tags) {
	let tagsHtml = "";

	const uniquetagsArray = Array.from(new Set(tags.map((tag) => tag.id))).map(
		(id) => {
			return tags.find((tag) => tag.id === id);
		}
	);

	uniquetagsArray?.forEach((category) => {
		tagsHtml += `<a href="/pages/evenflo-faq-category?cat_id=${category.id}">${category.name}</a>`;
	});

	return tagsHtml;
}

function getFAQContent(products) {
	let faqsContent = "";

	products.forEach((nestedProduct) => {
		faqsContent += `<li>${nestedProduct?.name}</li>`;
	});

	return faqsContent;
}

function setThreeBlockInnerHtml(
	topicName = "",
	faqQuestion = "",
	faqContent = "",
	faqAnswer = "",
	productID = "",
	tagsHtml
) {
	return `<div class="heading">
	  <h3>${topicName}</h3>
	  <h2>${faqQuestion}</h2>
	  <div class="description-wrapper">
		<ul>${faqContent}</ul>
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
		<p>${faqAnswer}</p>
		<div class="card-content-link">
		  <a href="/pages/evenflo-faq-answer?qid=${productID}">Read Answer</a>
		</div>
	  </div>
	  <div class="card-link-wrapper">
		${tagsHtml}
	  </div>
	</div>
  `;
}
