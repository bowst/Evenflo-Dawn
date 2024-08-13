document.querySelectorAll(".footer-block__details-content").forEach((content) => {
    content.classList.add("hide-custom-content");
});

document.querySelectorAll(".footer-block__heading").forEach((accor) => {
    accor.addEventListener("click", () => {
        let content = accor.nextElementSibling;
        content.classList.toggle("show-custom-content");
        content.classList.toggle("hide-custom-content");
        console.log("Here " + content.offsetHeight);
    });
});