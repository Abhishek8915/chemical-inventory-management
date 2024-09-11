document.addEventListener("DOMContentLoaded", () => {
    const info_buttons = document.querySelectorAll(".info-button");
    const add_btn = document.querySelector("#add_chemical");
    const cancel_form = document.querySelector("#cancel-form");
    const chemical_form = document.querySelector("#chemical-form");
    const edit_form = document.querySelector(".edit-form");
    const edit_buttons = document.querySelectorAll("#edit-btn");
    const cancel_edit_form = document.querySelector("#cancel-edit-form");

    // Toggle chemical details
    info_buttons.forEach((button) => {
        button.addEventListener("click", () => {
            const detail_bar = button.parentElement.parentElement.nextElementSibling;
            detail_bar.classList.toggle("active");
            button.textContent = detail_bar.classList.contains("active") ? "Hide details" : "Show details";
        });
    });

    // Show edit form
    edit_buttons.forEach((button) => {
        button.addEventListener("click", () => {
            edit_form.style.display = "block";
            editChemical(button);
        });
    });

    // Cancel edit form
    cancel_edit_form.addEventListener("click", () => {
        document.querySelector("#edit-chemical-form").reset();
        edit_form.style.display = "none";
    });

    // Show add chemical form
    add_btn.addEventListener("click", () => {
        document.querySelector(".add-chemical-form").style.display = "block";
    });

    // Cancel add form
    cancel_form.addEventListener("click", () => {
        document.querySelector("#chemical-form").reset();
        document.querySelector(".add-chemical-form").style.display = "none";
    });

    // Handle adding a new chemical
    chemical_form.addEventListener("submit", (event) => {
        event.preventDefault(); // Prevents form from refreshing the page
        addChemical();
        chemical_form.reset();
        document.querySelector(".add-chemical-form").style.display = "none";
    });

    function addChemical() {
        const newChemical = document.createElement("li");
        const expiryDate = document.querySelector("#ex-date").value;
        const ChemName = document.querySelector("#chemicalName").value;
        const amount = document.querySelector("#amount").value;
        const amountUnit = document.querySelector("#select-unit").value;
        const location = document.querySelector("#form-location").value;
        const type = document.querySelector("#select-type").value;
        const appearance = document.querySelector("#appearance").value;
        const hazards = document.querySelector("#hazards").value;

        const newInnerHtml = `
        <div class="chemical-name">
            <h3 class="name">${ChemName}</h3>
            <div class="btns">
                <button id="edit-btn">
                    <i class="fa-solid fa-pen"></i> Edit
                </button>
                <button class="info-button">Show Details</button>
            </div>
        </div>
        <div class="details">
            <div class="amount">
                <h4>Amount available: </h4>
                <span class="volume">${amount}</span>
                <span class="unit">${amountUnit}</span>
            </div>
            
            <div class="ex_date">
                <h4>Expiry Date :</h4>
                <span class="expiry-date">${expiryDate}</span>
            </div>
            <div class="location">
                <h4>Location: </h4>
                <span class="location-info">${location}</span>
            </div>
            <div class="type">
                <h4>Type: </h4>
                <span class="typeof">${type}</span>
            </div>
            <div class="appearance">
                <h4>Appearance: </h4>
                <span>${appearance}</span>
            </div>
            <div class="precautions">
                <h4 id="alert">Hazard , Precautions , H-codes : </h4>
                <span class="hazard-preco">${hazards}</span>
            </div>
        </div>`;

        newChemical.innerHTML = newInnerHtml;
        document.querySelector("#chemical-list").appendChild(newChemical);

        // Add event listener for the new info button
        const newInfoButton = newChemical.querySelector(".info-button");
        newInfoButton.addEventListener("click", () => {
            const detail_bar = newInfoButton.parentElement.parentElement.nextElementSibling;
            detail_bar.classList.toggle("active");
            newInfoButton.textContent = detail_bar.classList.contains("active") ? "Hide details" : "Show details";
        });

        // Add event listener for the new edit button
        const newEditbtn = newChemical.querySelector("#edit-btn");
        newEditbtn.addEventListener("click", () => {
            edit_form.style.display = "block";
            editChemical(newEditbtn);
        });

        saveChemicalsToLocalStorage();
    }

    function saveChemicalsToLocalStorage() {
        const chemicals = [];
        document.querySelectorAll("#chemical-list > li").forEach((chemicalItem) => {
            const name = chemicalItem.querySelector(".name").textContent;
            const amount = chemicalItem.querySelector(".volume").textContent;
            const unit = chemicalItem.querySelector(".unit").textContent;
            const location = chemicalItem.querySelector(".location-info").textContent;
            const type = chemicalItem.querySelector(".typeof").textContent;
            const appearance = chemicalItem.querySelector(".appearance span").textContent;
            const hazards = chemicalItem.querySelector(".hazard-preco").textContent;
            

    
            chemicals.push({ name, amount, unit, location, type, appearance, hazards });
        });
    
        localStorage.setItem("chemicals", JSON.stringify(chemicals));
    }

    function editChemical(editBtn) {
        // Get original name and location from the HTML structure
        const originalName = editBtn.parentElement.parentElement.firstElementChild.textContent;
        const originalLocation = editBtn.parentElement.parentElement.nextElementSibling.querySelector(".location-info").textContent;
    
        // Populate the form fields with the current chemical details
        const userName = document.querySelector("#userName").value;
        const chemname = document.querySelector("#editChemName");
        const loca = document.querySelector("#new-location");
        chemname.value = originalName;
        loca.value = originalLocation;

        // Remove previous event listeners to avoid duplication
        const newEditForm = document.querySelector("#edit-chemical-form");
        const updatedForm = newEditForm.cloneNode(true);
        newEditForm.parentNode.replaceChild(updatedForm, newEditForm);

        // Add submit event listener to the cloned edit form
        updatedForm.addEventListener("submit", (e) => {
            e.preventDefault();  // Prevent the form from submitting normally
    
            // Retrieve updated values from the form
            const updatedChemName = chemname.value;
            const updatedLocation = loca.value;

            // Retrieve original chemical details again for comparison
            const originalAmountElement = editBtn.parentElement.parentElement.nextElementSibling.querySelector(".volume");
            const originalAmountText = originalAmountElement.textContent.trim();
            let originalAmount = parseFloat(originalAmountText);
            let originalUnit = editBtn.parentElement.parentElement.nextElementSibling.querySelector(".unit").textContent.trim();

            

            if (isNaN(originalAmount)) {
                alert("Error: Unable to retrieve the original amount. Please check the data.");
                return;
            }

            // Retrieve new type and unit from the form
            const newType = document.querySelector("#edit-select-type").value;
            const newUnit = document.querySelector("#edit-select-unit").value;
            const amountUsed = parseFloat(document.querySelector("#used-amount").value);

            let amountLeft;

            // Logic to handle unit conversion and amount deduction
            if (newUnit === originalUnit && originalAmount >= amountUsed) {
                // Direct subtraction for same units
                amountLeft = originalAmount - amountUsed;
            } else if (newUnit === "ml" && originalUnit === "L") {
                // Convert Liters to Milliliters and subtract
                if ((originalAmount * 1000) >= amountUsed) {
                    amountLeft = (originalAmount * 1000) - amountUsed; // Convert to ml and subtract
                    if (amountLeft >= 1000) {
                        amountLeft = amountLeft / 1000;  // Convert back to liters
                    } else {
                        originalUnit = newUnit;  // Keep as ml if less than 1L
                    }
                } else {
                    alert("Error: The used amount exceeds the available amount.");
                    return;  // Exit if there's an error
                }
            } else if (newUnit === "gm" && originalUnit === "kg") {
                // Convert Kilograms to Grams and subtract
                if ((originalAmount * 1000) >= amountUsed) {
                    amountLeft = (originalAmount * 1000) - amountUsed;  // Convert to gm and subtract
                    if (amountLeft >= 1000) {
                        amountLeft = amountLeft / 1000;  // Convert back to kg
                    } else {
                        originalUnit = newUnit;  // Keep as gm if less than 1kg
                    }
                } else {
                    alert("Error: The used amount exceeds the available amount.");
                    return;  // Exit if there's an error
                }
            } else {
                alert("Error: The units are incompatible or the used amount exceeds the available amount.");
                return;  // Exit the function if there's an error
            }

            // Update the UI with the new values
            editBtn.parentElement.parentElement.firstElementChild.textContent = updatedChemName;
            editBtn.parentElement.parentElement.nextElementSibling.querySelector(".location-info").textContent = updatedLocation;
            originalAmountElement.textContent = amountLeft.toFixed(2);
            editBtn.parentElement.parentElement.nextElementSibling.querySelector(".typeof").textContent = newType;
            editBtn.parentElement.parentElement.nextElementSibling.querySelector(".unit").textContent = originalUnit;

            // Hide the edit form
            updatedForm.reset();
            edit_form.style.display = "none";
        });
    }
    
    loadChemicalsFromLocalStorage();



function loadChemicalsFromLocalStorage() {
    const chemicals = JSON.parse(localStorage.getItem("chemicals")) || [];

    chemicals.forEach((chemical) => {
        const newChemical = document.createElement("li");

        const newInnerHtml = `
        <div class="chemical-name">
            <h3 class="name">${chemical.name}</h3>
            <div class="btns">
                <button id="edit-btn">
                    <i class="fa-solid fa-pen"></i> Edit
                </button>
                <button class="info-button">Show Details</button>
            </div>
        </div>
        <div class="details">
            <div class="amount">
                <h4>Amount available: </h4>
                <span class="volume">${chemical.amount}</span>
                <span class="unit">${chemical.unit}</span>
            </div>
            <div class="location">
                <h4>Location: </h4>
                <span class="location-info">${chemical.location}</span>
            </div>
            <div class="type">
                <h4>Type: </h4>
                <span class="typeof">${chemical.type}</span>
            </div>
            <div class="appearance">
                <h4>Appearance: </h4>
                <span>${chemical.appearance}</span>
            </div>
            <div class="precautions">
                <h4 id="alert">Hazard , Precautions , H-codes: </h4>
                <span class="hazard-preco">${chemical.hazards}</span>
            </div>
            
        </div>`;

        newChemical.innerHTML = newInnerHtml;
        document.querySelector("#chemical-list").appendChild(newChemical);

        // Add event listeners to newly loaded elements
        const newInfoButton = newChemical.querySelector(".info-button");
        newInfoButton.addEventListener("click", () => {
            const detail_bar = newInfoButton.parentElement.parentElement.nextElementSibling;
            detail_bar.classList.toggle("active");
            newInfoButton.textContent = detail_bar.classList.contains("active") ? "Hide details" : "Show details";
        });

        const newEditbtn = newChemical.querySelector("#edit-btn");
        newEditbtn.addEventListener("click", () => {
            edit_form.style.display = "block";
            editChemical(newEditbtn);
        });
    });
}

document.querySelector(".search").addEventListener("input", searchChemical);

function sort_by(){
    const chem_type = document.querySelector('.filter-by');
    
}

document.querySelector(".filter-by").addEventListener("click",sortBy);

});



function searchChemical() {
    const searchValue = document.querySelector(".search").value.toUpperCase();
    const chemicals = document.querySelectorAll("#chemical-list li");

    if (searchValue === "") {
        chemicals.forEach(chemical => {
            chemical.style.display = "";
        });
        return;
    }
    
    for (var i = 0; i < chemicals.length; i++) {
        let match = chemicals[i].querySelector(".name") ;

        if(match){
            let text=match.textContent || match.innerHTML;

            if (text.toUpperCase().indexOf(searchValue) > -1) {
                chemicals[i].style.display = "";
            } else {
                chemicals[i].style.display = "none";
            }
        }
       
    }
}

function sortBy(){
    const type=document.querySelector(".filter-by").value.toUpperCase();
    const chemicals = document.querySelectorAll("#chemical-list li");

    if (type === "ALL") {
        chemicals.forEach(chemical => {
            chemical.style.display = "";
        });
        return;
    }
    
    for (var i = 0; i < chemicals.length; i++) {
        let chemType = chemicals[i].querySelector(".typeof").textContent.toUpperCase() ;

        if(chemType===type){
            chemicals[i].style.display="";
        }else{
            chemicals[i].style.display="none";
        }

        
       
    }



}




