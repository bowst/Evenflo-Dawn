var evenFloFAQURL = "https://api.dev.evenflocms.howst.io/api/";

var categoryID = "";
var topicID = "";
var collectionID = "";
var productID = "";

//We are using this filter for generic search for all faqs in faq-load-more block
function fetchFAQsByFilters({
	categoryID = "",
	filter = "",
	topicsID = "",
	page = 1,
	productID = "",
	collectionID = "",
	popular = false,
	appendTo = "searchListigBody",
	showLoadMore = true,
}) {
	const container = document.getElementById(appendTo);

	const faqsToShow =
		document.getElementById("faqsToShow")?.dataset?.faqsToShow || 3;

	const loadMoreBtn = document.getElementById("loadMoreBtn");

	if (!container) {
		console.error("searchListigBody wrapper container not found");
		return;
	}

	if (loadMoreBtn && showLoadMore) {
		loadMoreBtn.style.display = "none";
	}

	if (page == 1) {
		emptyContainerHtml(container);
	}

	const loader = appendLoader(container);

	fetch(
		evenFloFAQURL +
			`faqs/getFilteredFaqs?filter=${filter}&page=${page}&category_id=${categoryID}&
			topics_id=${topicsID}&product_id=${productID}&collection_id=${collectionID}&popular=${popular}`
	)
		.then((response) => response.json())
		.then((data) => {
			let resultsToShow = data?.results;
			if (popular) {
				resultsToShow = resultsToShow.slice(0, faqsToShow);
			}

			resultsToShow?.forEach((product) => {
				const popularCard = createPopularCardDivElement("popular-card");

				const faqsContent = getFAQContent(product?.products || []);

				const tags = getTagsArray(product?.tags || []);

				const tagsHtml = getTagsHtml(tags);

				popularCard.innerHTML = setFAQBlockInnerHtml(
					product?.topic?.name || "",
					product.question,
					faqsContent,
					product.answer,
					//product?.id,
					"",
					tagsHtml
				);

				container.appendChild(popularCard);
			});

			if (loadMoreBtn && showLoadMore) {
				loadMoreBtn.style.display = data?.next ? "block" : "none";
			}
		})
		.catch((error) => {
			console.error("Error fetching products:", error);
		})
		.finally(() => {
			if (loader) {
				hideLoader(loader);
				toggleAnswerBullet();
			}
		});
}

function toggleAnswerBullet() {
  
	const descriptionWrappers = document.querySelectorAll(".description-wrapper");

	if (descriptionWrappers.length > 0) {
		descriptionWrappers.forEach((desc) => {
			const listItems = desc.querySelectorAll("ul li").length;

			if (listItems > 1) {
				desc.classList.remove("description-wrapper-remove");
				const button = desc.querySelector("button");

				if (button) {
					button.addEventListener("click", () => {
						desc.classList.toggle("description-wrapper-show");
					});
				}
			} else {
				desc.classList.add("description-wrapper-remove");
			}
		});
	}
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

function copyBtnFunc() {
	let copyBtn = document.querySelectorAll(".copy-clipboard-btn");
	copyBtn.forEach((btn) => {
		btn.classList.add("copied-clipboard-btn");
		if (btn?.querySelector("span")?.textContent)
			btn.querySelector("span").textContent = "COPIED";

		setTimeout(() => {
			btn.classList.remove("copied-clipboard-btn");
			if (btn?.querySelector("span")?.textContent)
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
		.then(() => {})
		.catch((err) => {
			console.error("Failed to copy:", err);
			alert("Failed to copy URL to clipboard");
		})
		.finally(() => {
			copyBtnFunc();
			document.body.removeChild(dummyInput);
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
		tagsHtml += `<a href="javascript:void(0)">${category.name}</a>`;
	});

	return tagsHtml;
}

function getFAQContent(products) {
	let faqsContent = "";

	products.forEach((nestedProduct) => {
		faqsContent += `<li><a href="/pages/evenflo-faq-product?pid=${nestedProduct?.id}">${nestedProduct?.name}</a></li>`;
	});

	return faqsContent;
}

function redirectIfNoData(data = []) {
	if (data && data?.length > 0) {
	} else {
		window.location.href = "/pages/evenflo-faq-portal";
	}
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
		${topicName ? `<h3>${topicName}</h3>` : ""}
		${faqQuestion ? `<h2>${faqQuestion}</h2>` : ""}
		
		${
			faqContent
				? `
			<div class="description-wrapper">
				<ul>${faqContent}</ul>
				<button>
					<span>Show more</span>
					<svg aria-hidden="true" focusable="false" class="icon icon-caret" viewBox="0 0 10 6">
						<path fill-rule="evenodd" clip-rule="evenodd" d="M9.354.646a.5.5 0 00-.708 0L5 4.293 1.354.646a.5.5 0 00-.708.708l4 4a.5.5 0 00.708 0l4-4a.5.5 0 000-.708z" fill="currentColor"></path>
					</svg>
				</button>
			</div>
		`
				: ""
		}
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

function containsString(str, search) {
	return str?.toLowerCase()?.includes(search) || false;
}

function errorString(string = "not found") {
	return string;
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

				if (type_id && type_id == product.id) {
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

function getBreadCrumbLinks(breadCrumbName = "", fromPage = "") {
	const container = document.getElementById("breadcrumb");
	if (!container) {
		return;
	}

	emptyContainerHtml(container);

	let currentUrl = window.location.href;

	let breadcrumbTrail = generateBreadcrumbTrail(currentUrl, breadCrumbName);

	console.log("breadcrumbTrail", breadcrumbTrail);

	container.innerHTML = breadcrumbTrail;
}

function generateBreadcrumbTrail(currentUrl, name) {
	let lastSlug = getLastSlug(currentUrl);

	let lastBreadcrumb = getBreadcrumbLinkName(lastSlug);
	let lastBreadcrumbLink = `<a href="#" onclick="location.reload(); return false;">${
		name ? name : lastBreadcrumb
	}</a>`;

	let homeLink = '<a href="/">Home</a>';
	let faqLink = '<a href="/pages/evenflo-faq-portal">FAQ</a>';

	let breadcrumbTrail = `${homeLink} | ${faqLink} | ${lastBreadcrumbLink}`;

	return breadcrumbTrail;
}

function getLastSlug(url) {
	let cleanUrl = url.split("?")[0];
	let parts = cleanUrl.split("/").filter(Boolean);

	return parts[parts.length - 1];
}

function getBreadcrumbLinkName(slug) {
	const breadcrumbMappings = [
		{ keyword: "collection", name: "Collection" },
		{ keyword: "topic", name: "Topic" },
		{ keyword: "product", name: "Product" },
		{ keyword: "category", name: "Category" },
		{ keyword: "question-answer", name: "Answer" },
		{ keyword: "search", name: "Search" },
	];

	for (let mapping of breadcrumbMappings) {
		if (slug.includes(mapping.keyword)) {
			return mapping.name;
		}
	}

	return "FAQ";
}

function getProductsByCategory(
	category_id,
	category_name = "",
	fromCategoryDetail = false
) {
	// Show the loader
	const container = document.getElementById("productsByCategory");
	const browseCategoriesContainer = document.getElementById(
		"browseCategoriesDiv"
	);

	if (!container) {
		console.error("productsByCategory wrapper container not found");
		return;
	}

	emptyContainerHtml(container);

	emptyContainerHtml(browseCategoriesContainer);

	const loader = appendLoader(container);

	fetch(evenFloFAQURL + `products/by/category/${category_id}`)
		.then((response) => response.json())
		.then((data) => {
			if (data && data?.length > 0) {
				const productsBlock = document.getElementById("productsByCategory");

				const blocksToShow = productsBlock
					? productsBlock?.dataset?.faqsToShow
					: 3;

				let resultsToShow = [];
				if (fromCategoryDetail) {
					resultsToShow = data;
				} else {
					// Limit to blocksToShow products
					resultsToShow = data.slice(0, blocksToShow);
				}

				resultsToShow.forEach((product) => {
					const tabCard = document.createElement("div");
					tabCard.classList.add("swiper-slide","tab-card");

					tabCard.innerHTML = `
		 <a href="/pages/evenflo-faq-product?pid=${product?.id}">
		  <div class="tab-img">
			 <img
			   src=${product?.image}
			   alt="tab-img"
			 />
		   </div>
		   <div class="tab-content">
			 <h4>${product?.name}</h4>
		   </div>
		 </a>
		 `;

					container.appendChild(tabCard);
				});
              
				if (browseCategoriesContainer) {
					//Appending all categories button
					const browseCategories = document.createElement("button");
					browseCategories.innerHTML = `<button>Browse All ${category_name}</button>`;
					// Appending an onclick function to all the buttons
					browseCategories.onclick = () => {
						window.location.href = `/pages/evenflo-faq-category?cat_id=${category_id}`;
						//  alert(category_id)
					};
					browseCategoriesContainer.appendChild(browseCategories);
				}
			}
		})
		.catch((error) => {
			console.error("Error fetching products by category:", error);
		})
		.finally(() => {
			// Hide the loader
			if (loader) {
				hideLoader(loader);
               
 customSlider()
			}
		});
}

function customSlider(){
   var swiper = new Swiper(".mySwiper", {
      loop: true,
      slidesPerView: 4,
      spaceBetween: 30,   
      pagination: {
          el: ".swiper-pagination",
          clickable: true,
      },
      navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
      },
      breakpoints: {
        320: {  // when window width is >= 320px
          slidesPerView: 1,
          spaceBetween: 10
        },
        640: {  // when window width is >= 640px
          slidesPerView: 2,
        },
        960: {  // when window width is >= 960px
          slidesPerView: 4,
        }
      }
  });
}

