var evenFloFAQURL = "https://api.dev.evenflocms.howst.io/api/";

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

function formatPostedDate(timestamp) {
	const date = new Date(timestamp);

	// Extracting the date part
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");

	const formattedDate = `${year}-${month}-${day}`;
	return formattedDate;
}

function copyBtnFunc(){
    let copyBtn = document.querySelectorAll(".copy-clipboard-btn");
    copyBtn.forEach((btn) => {
        btn.classList.add("copied-clipboard-btn");
        if(btn?.querySelector('span')?.textContent)
        btn.querySelector("span").textContent = "COPIED";

        setTimeout(() => {
            btn.classList.remove("copied-clipboard-btn");
            if(btn?.querySelector('span')?.textContent)
            btn.querySelector("span").textContent = "COPY LINK"; // Reset the text to original
        }, 2000);
    });
}





function copyCurrentUrlToClipboard() {
	var dummyInput = document.createElement("input");

	dummyInput.value = window.location.href;

	document.body.appendChild(dummyInput);

	dummyInput.select();

	navigator.clipboard
		.writeText(dummyInput.value)
		.then(() => {
		})
		.catch((err) => {
			console.error("Failed to copy:", err);
			alert("Failed to copy URL to clipboard");
		})
		.finally(() => {
        copyBtnFunc()
			document.body.removeChild(dummyInput);
		});
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
				const popularCard = createPopularCardDivElement("popular-card");

				const faqsContent = getFAQContent(product?.products || []);

				const tags = getTagsArray(product?.tags || []);

				const tagsHtml = getTagsHtml(tags);

				popularCard.innerHTML = setFAQBlockInnerHtml(
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

function fetchTopicsByType(id, productPage = false, type = "collection") {
	const container = document.getElementById("selectTopic");

	if (!container) {
		return;
	}

	emptyContainerHtml(container);

	createAndAppendDropDownOption(container, "Select Topic");

	let url = evenFloFAQURL + `topics/?page=1&collection_id=${id}`;

	if (productPage) {
		url = evenFloFAQURL + `topics/?page=1&product_id=${id}`;
	}

	if (type == "category") {
		url = evenFloFAQURL + `topics/?page=1&category_id=${id}`;
	}

	fetch(url)
		.then((response) => response.json())
		.then((data) => {
			data?.results.forEach((topic) => {
				createAndAppendDropDownOption(container, topic.name, topic.id);
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

function createPopularCardDivElement(className = "popular-card") {
	const popularCard = document.createElement("div");
	popularCard.classList.add(className);
	return popularCard;
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

function setFAQBlockInnerHtml(
	topicName = "",
	faqQuestion = "",
	faqContent = "",
	faqAnswer = "",
	productID = "",
	tagsHtml = ""
) {
	return `
	  <div class="heading">
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
		  ${
				productID
					? `<div class="card-content-link"><a href="/pages/evenflo-faq-answer?qid=${productID}">Read Answer</a></div>`
					: ""
			}
		</div>
		<div class="card-link-wrapper">
		  ${tagsHtml}
		</div>
	  </div>
	`;
}

function createAndAppendDropDownOption(
	container,
	textContent = "Select Topic",
	value = ""
) {
	const defaultOption = document.createElement("option");
	defaultOption.value = value;
	defaultOption.textContent = textContent;
	container.appendChild(defaultOption);
}

function emptyContainerHtml(container) {
	if (container) {
		container.innerHTML = "";
	}
}

function fetchDropDownProductsByType(type_id = 1, type = "collection") {
	const container = document.getElementById("selectProduct");

	if (!container) {
		return;
	}

	emptyContainerHtml(container);

	createAndAppendDropDownOption(container, "Select Product");

	let url = evenFloFAQURL + `products/filterByCollection/${type_id}`;

	if (type == "category") {
		url = evenFloFAQURL + `products/by/category/${type_id}`;
	}

	fetch(url)
		.then((response) => response.json())
		.then((data) => {
			data?.forEach((product) => {
				const option = document.createElement("option");
				option.value = product.id;

				if (type_id && type_id == topic.id) {
					option.selected = true;
				}

				option.textContent = product.name;
				container.appendChild(option);
			});
		})
		.catch((error) => {
			console.error("Error fetching products:", error);
		});
}
