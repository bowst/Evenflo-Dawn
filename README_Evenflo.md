# Evenflo Dev Notes

## Don't touch Dawn
No customizations should be added to the Dawn theme. If a component requires customization the approriate files should be created using the naming conventions found below. This will allow for easier Dawn theme update integrations.

## Naming Conventions
All custom files should be prefixed with evenflo-, followed by the section/snippet name and it's appropriate extenstion. Additionally the section container should have a class of the same name for easy identification and/or customization of styles. For example, a custom version of the "related-products" section may result in the following:
- sections/evenflo-related-products.liquid
- assets/evenflo-related-products.css
- assets/evenflo-related-products.js
- `.evenflo-related-products` section class

If, for example, custom css or javascript isn't required, the files need not be created. Class names can be shared across components but the first class should always be the components unique class name.