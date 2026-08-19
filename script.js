document.addEventListener("DOMContentLoaded", function () {

    const globeContainer = document.getElementById("globe");

    if (!globeContainer) {
        console.error("Globe container not found.");
        return;
    }

    if (typeof Globe === "undefined") {
        console.error("Globe.gl library did not load.");
        return;
    }


    /* =================================
       SETTINGS
    ================================= */

    let selectedContinent = "Asia";

    const GREEN = "#238B6B";
    const GRAY = "#B9BEC2";
    const BORDER = "#FFFFFF";


    /* =================================
       CREATE GLOBE
    ================================= */

    const globe = Globe()
        (globeContainer)

        .width(360)
        .height(360)

        .backgroundColor("rgba(0,0,0,0)")

        .showAtmosphere(true)
        .atmosphereColor("#B8C0C4")
        .atmosphereAltitude(0.08)

        .showGraticules(false)

        .polygonAltitude(0.006)

        .polygonStrokeColor(() => BORDER)

        .polygonSideColor(() => "rgba(100,100,100,0.25)")

        .polygonCapColor(country => {

            const continent =
                country.properties.CONTINENT;

            return continent === selectedContinent
                ? GREEN
                : GRAY;
        });


    /* =================================
       LOAD COUNTRY DATA
    ================================= */

    fetch(
        "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson"
    )

    .then(response => {

        if (!response.ok) {
            throw new Error(
                "Country data could not be loaded."
            );
        }

        return response.json();

    })

    .then(data => {

        console.log(
            "Countries loaded:",
            data.features.length
        );


        globe
            .polygonsData(data.features)

            .polygonLabel(country => {

                return `
                    <div style="
                        font-family: Arial, sans-serif;
                        font-size: 13px;
                        color: #123653;
                        background: white;
                        padding: 6px 9px;
                        border-radius: 4px;
                    ">
                        ${country.properties.ADMIN}
                    </div>
                `;

            })

            .onPolygonClick(country => {

                const continent =
                    country.properties.CONTINENT;

                if (continent) {

                    selectContinent(
                        continent
                    );

                }

            });

    })

    .catch(error => {

        console.error(
            "Globe country-data error:",
            error
        );

    });


    /* =================================
       CONTINENT BUTTONS
    ================================= */

    const buttons =
        document.querySelectorAll(".continent");


    buttons.forEach(button => {

        button.addEventListener(
            "click",
            function () {

                let continent =
                    this.dataset.continent;

                selectContinent(
                    continent
                );

            }
        );

    });


    /* =================================
       SELECT CONTINENT
    ================================= */

    function selectContinent(continent) {

        selectedContinent = continent;


        /* Update buttons */

        buttons.forEach(button => {

            button.classList.remove(
                "active"
            );

            if (
                button.dataset.continent ===
                continent
            ) {

                button.classList.add(
                    "active"
                );

            }

        });


        /* Update globe colors */

        globe.polygonCapColor(country => {

            const countryContinent =
                country.properties.CONTINENT;

            return countryContinent ===
                selectedContinent
                ? GREEN
                : GRAY;

        });

    }


    /* =================================
       INITIAL STATE
    ================================= */

    selectContinent("Asia");


    /* =================================
       AUTO ROTATION
    ================================= */

    globe.controls().autoRotate = true;
    globe.controls().autoRotateSpeed = 0.35;


    console.log(
        "Interactive globe initialized."
    );

})/* =========================================
   RESEARCH / MANUFACTURING TABS
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    const tabs = document.querySelectorAll(".capability-tab");
    const panels = document.querySelectorAll(".capability-panel");


    tabs.forEach(function (tab) {

        tab.addEventListener("click", function () {

            const selectedTab = this.getAttribute("data-tab");


            /* Remove active from all tabs */
            tabs.forEach(function (item) {
                item.classList.remove("active");
            });


            /* Hide all panels */
            panels.forEach(function (panel) {
                panel.classList.remove("active");
            });


            /* Activate clicked tab */
            this.classList.add("active");


            /* Show matching panel */
            const selectedPanel =
                document.getElementById(
                    selectedTab + "-panel"
                );


            if (selectedPanel) {
                selectedPanel.classList.add("active");
            }

        });

    });

});