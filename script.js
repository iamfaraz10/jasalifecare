import { products } from "./products.js";

document.addEventListener("DOMContentLoaded", () => {

    // =====================================================
    // ELEMENTS
    // =====================================================

    const searchInput = document.getElementById("productSearch");
    const categoryFilter = document.getElementById("categoryFilter");
    const formFilter = document.getElementById("formFilter");
    const dosageFilter = document.getElementById("dosageFilter");
    const clearFilters = document.getElementById("clearFilters");

    const tableBody = document.getElementById("productTableBody");
    const noProducts = document.getElementById("noProducts");
    const pagination = document.getElementById("pagination");

    const resultsText = document.getElementById("resultsText");

    const totalProducts = document.getElementById("totalProducts");
    const totalCategories = document.getElementById("totalCategories");
    const totalForms = document.getElementById("totalForms");
    const totalStrengths = document.getElementById("totalStrengths");


    // =====================================================
    // SETTINGS
    // =====================================================

    const PRODUCTS_PER_PAGE = 20;

    let currentPage = 1;

    let filteredProducts = [...products];


    // =====================================================
    // CHECK PRODUCT DATA
    // =====================================================

    console.log("Jasa Lifecare products loaded:", products.length);

    if (!Array.isArray(products)) {
        console.error("Products data is not an array.");
        return;
    }


    // =====================================================
    // HELPER
    // =====================================================

    function cleanValue(value) {

        if (value === null || value === undefined) {
            return "";
        }

        return String(value).trim();
    }


    // =====================================================
    // GET UNIQUE VALUES
    // =====================================================

    function getUniqueValues(key) {

        return [
            ...new Set(
                products
                    .map(product => cleanValue(product[key]))
                    .filter(value => value !== "")
            )
        ].sort((a, b) =>
            a.localeCompare(b, undefined, {
                numeric: true,
                sensitivity: "base"
            })
        );
    }


    // =====================================================
    // POPULATE FILTER
    // =====================================================

    function populateFilter(selectElement, values, defaultText) {

        if (!selectElement) return;

        selectElement.innerHTML = "";

        const defaultOption = document.createElement("option");

        defaultOption.value = "";
        defaultOption.textContent = defaultText;

        selectElement.appendChild(defaultOption);

        values.forEach(value => {

            const option = document.createElement("option");

            option.value = value;
            option.textContent = value;

            selectElement.appendChild(option);

        });
    }


    // =====================================================
    // POPULATE FILTERS
    // =====================================================

    populateFilter(
        categoryFilter,
        getUniqueValues("category"),
        "Category"
    );

    populateFilter(
        formFilter,
        getUniqueValues("form"),
        "Form"
    );

    populateFilter(
        dosageFilter,
        getUniqueValues("dosage"),
        "Dosage"
    );


    // =====================================================
    // STATISTICS
    // =====================================================

    function updateStatistics() {

        if (totalProducts) {
            totalProducts.textContent = products.length;
        }

        if (totalCategories) {
            totalCategories.textContent =
                getUniqueValues("category").length;
        }

        if (totalForms) {
            totalForms.textContent =
                getUniqueValues("form").length;
        }

        if (totalStrengths) {
            totalStrengths.textContent =
                getUniqueValues("dosage").length;
        }
    }


    updateStatistics();


    // =====================================================
    // FILTER PRODUCTS
    // =====================================================

    function filterProducts() {

        const searchTerm =
            cleanValue(searchInput?.value).toLowerCase();

        const selectedCategory =
            cleanValue(categoryFilter?.value);

        const selectedForm =
            cleanValue(formFilter?.value);

        const selectedDosage =
            cleanValue(dosageFilter?.value);


        filteredProducts = products.filter(product => {

            const name =
                cleanValue(product.name).toLowerCase();

            const form =
                cleanValue(product.form);

            const category =
                cleanValue(product.category);

            const dosage =
                cleanValue(product.dosage);

            const casId =
                cleanValue(product.casId).toLowerCase();


            // Search across all important fields

            const matchesSearch =
                searchTerm === "" ||
                name.includes(searchTerm) ||
                form.toLowerCase().includes(searchTerm) ||
                category.toLowerCase().includes(searchTerm) ||
                dosage.toLowerCase().includes(searchTerm) ||
                casId.includes(searchTerm);


            const matchesCategory =
                selectedCategory === "" ||
                category === selectedCategory;


            const matchesForm =
                selectedForm === "" ||
                form === selectedForm;


            const matchesDosage =
                selectedDosage === "" ||
                dosage === selectedDosage;


            return (
                matchesSearch &&
                matchesCategory &&
                matchesForm &&
                matchesDosage
            );

        });


        currentPage = 1;

        renderProducts();

    }


    // =====================================================
    // CREATE TABLE ROW
    // =====================================================

    function createProductRow(product) {

        const row = document.createElement("tr");


        const nameCell = document.createElement("td");
        nameCell.textContent = cleanValue(product.name);


        const formCell = document.createElement("td");
        formCell.textContent = cleanValue(product.form);


        const categoryCell = document.createElement("td");
        categoryCell.textContent = cleanValue(product.category);


        const dosageCell = document.createElement("td");
        dosageCell.textContent = cleanValue(product.dosage);


        const casCell = document.createElement("td");
        casCell.textContent = cleanValue(product.casId);


        row.appendChild(nameCell);
        row.appendChild(formCell);
        row.appendChild(categoryCell);
        row.appendChild(dosageCell);
        row.appendChild(casCell);


        return row;
    }


    // =====================================================
    // RENDER PRODUCTS
    // =====================================================

    function renderProducts() {

        tableBody.innerHTML = "";

        pagination.innerHTML = "";


        const totalResults = filteredProducts.length;

        const totalPages =
            Math.ceil(totalResults / PRODUCTS_PER_PAGE);


        // -------------------------------------------------
        // NO RESULTS
        // -------------------------------------------------

        if (totalResults === 0) {

            noProducts.style.display = "block";

            tableBody.parentElement.style.display = "none";

            resultsText.textContent = "No products found";

            return;
        }


        // -------------------------------------------------
        // SHOW TABLE
        // -------------------------------------------------

        noProducts.style.display = "none";

        tableBody.parentElement.style.display = "table";


        // -------------------------------------------------
        // CURRENT PAGE
        // -------------------------------------------------

        if (currentPage > totalPages) {
            currentPage = totalPages;
        }


        const startIndex =
            (currentPage - 1) * PRODUCTS_PER_PAGE;

        const endIndex =
            startIndex + PRODUCTS_PER_PAGE;


        const pageProducts =
            filteredProducts.slice(startIndex, endIndex);


        // -------------------------------------------------
        // ADD ROWS
        // -------------------------------------------------

        pageProducts.forEach(product => {

            const row = createProductRow(product);

            tableBody.appendChild(row);

        });


        // -------------------------------------------------
        // RESULTS TEXT
        // -------------------------------------------------

        resultsText.textContent =
            `Showing ${startIndex + 1}-${Math.min(endIndex, totalResults)} of ${totalResults} products`;


        // -------------------------------------------------
        // PAGINATION
        // -------------------------------------------------

        renderPagination(totalPages);

    }


    // =====================================================
    // PAGINATION
    // =====================================================

    function renderPagination(totalPages) {

        if (totalPages <= 1) {
            return;
        }


        // Previous button

        const previousButton =
            document.createElement("button");

        previousButton.textContent = "← Previous";

        previousButton.type = "button";

        previousButton.disabled = currentPage === 1;

        previousButton.addEventListener("click", () => {

            if (currentPage > 1) {

                currentPage--;

                renderProducts();

                scrollToTable();

            }

        });


        pagination.appendChild(previousButton);


        // Page buttons

        const maxVisiblePages = 7;

        let startPage =
            Math.max(1, currentPage - 3);

        let endPage =
            Math.min(
                totalPages,
                startPage + maxVisiblePages - 1
            );


        if (endPage - startPage < maxVisiblePages - 1) {

            startPage =
                Math.max(
                    1,
                    endPage - maxVisiblePages + 1
                );

        }


        for (
            let page = startPage;
            page <= endPage;
            page++
        ) {

            const pageButton =
                document.createElement("button");

            pageButton.textContent = page;

            pageButton.type = "button";

            if (page === currentPage) {
                pageButton.classList.add("active");
            }


            pageButton.addEventListener("click", () => {

                currentPage = page;

                renderProducts();

                scrollToTable();

            });


            pagination.appendChild(pageButton);

        }


        // Next button

        const nextButton =
            document.createElement("button");

        nextButton.textContent = "Next →";

        nextButton.type = "button";

        nextButton.disabled =
            currentPage === totalPages;


        nextButton.addEventListener("click", () => {

            if (currentPage < totalPages) {

                currentPage++;

                renderProducts();

                scrollToTable();

            }

        });


        pagination.appendChild(nextButton);

    }


    // =====================================================
    // SCROLL TO TABLE
    // =====================================================

    function scrollToTable() {

        const table =
            document.querySelector(".product-table-wrapper");

        if (!table) return;


        const top =
            table.getBoundingClientRect().top +
            window.scrollY -
            120;


        window.scrollTo({
            top: top,
            behavior: "smooth"
        });

    }


    // =====================================================
    // SEARCH
    // =====================================================

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            filterProducts
        );

    }


    // =====================================================
    // FILTER EVENTS
    // =====================================================

    if (categoryFilter) {

        categoryFilter.addEventListener(
            "change",
            filterProducts
        );

    }


    if (formFilter) {

        formFilter.addEventListener(
            "change",
            filterProducts
        );

    }


    if (dosageFilter) {

        dosageFilter.addEventListener(
            "change",
            filterProducts
        );

    }


    // =====================================================
    // CLEAR FILTERS
    // =====================================================

    if (clearFilters) {

        clearFilters.addEventListener("click", () => {

            if (searchInput) {
                searchInput.value = "";
            }

            if (categoryFilter) {
                categoryFilter.value = "";
            }

            if (formFilter) {
                formFilter.value = "";
            }

            if (dosageFilter) {
                dosageFilter.value = "";
            }


            filteredProducts = [...products];

            currentPage = 1;

            renderProducts();

        });

    }


    // =====================================================
    // INITIAL RENDER
    // =====================================================

    renderProducts();

});