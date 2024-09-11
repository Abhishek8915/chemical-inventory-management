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
                                    <i class="fa-solid fa-pen"></i>
                                        Edit
                                    </button>
                                    <button class="info-button"> Show Details</button>
            
                            </div>
        </div>
        <div class="details">
            <div class="amount">
                <h4>Amount available: </h4>
                <span class="volume">${amount} </span>
                <span class="unit">${amountUnit}</span>
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
                <h4 id="alert">Hazard & Precautions: </h4>
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
        const newEditbtn=newChemical.querySelector("#edit-btn");
        
        newEditbtn.addEventListener("click", () => {
            edit_form.style.display = "block";
                editChemical(newEditbtn);
        });
        

    }

    function editChemical(editBtn) {
        // Get original name and location from the HTML structure
        const originalName = editBtn.parentElement.parentElement.firstElementChild.textContent;
        const originalLocation = editBtn.parentElement.parentElement.nextElementSibling.firstElementChild.nextElementSibling.firstElementChild.nextElementSibling.textContent;
    
        // Populate the form fields with the current chemical details
        const chemname = document.querySelector("#editChemName");
        const loca = document.querySelector("#new-location");
        chemname.value = originalName;
        loca.value = originalLocation;
    
        // Remove previous event listeners to avoid duplication
        const newEditForm = document.querySelector("#edit-chemical-form");
        newEditForm.replaceWith(newEditForm.cloneNode(true));
        const updatedForm = document.querySelector("#edit-chemical-form");
    
        // Add submit event listener to the cloned edit form
        updatedForm.addEventListener("submit", (e) => {
            e.preventDefault();  // Prevent the form from submitting normally
    
            // Retrieve updated values from the form
            const updatedChemName = chemname.value;
            const updatedLocation = loca.value;
    
            // Retrieve original chemical details again for comparison
            
            let originalUnit = editBtn.parentElement.parentElement.nextElementSibling.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.textContent;
            let originalAmountElement = editBtn.parentElement.parentElement.nextElementSibling.querySelector(".volume");
            let originalAmountText = originalAmountElement.textContent.trim();
            let originalAmount = parseFloat(originalAmountText);

            // Log the amount to check if it's being parsed correctly
            console.log("Original Amount Element:", originalAmountElement);
            console.log("Original Amount Text:", originalAmountText);
            console.log("Original Amount (Parsed):", originalAmount);

            if (isNaN(originalAmount)) {
                alert("Error: Unable to retrieve the original amount. Please check the data.");
                return;
            }
            // Retrieve new type and unit from the form
            const newType = document.querySelector("#edit-select-type").value;
            const newUnit = document.querySelector("#edit-select-unit").value;
            console.log("new unit:", newUnit);
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

                    // Convert back to Liters if the remaining amount is 1000 ml or more
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

                    // Convert back to Kilograms if the remaining amount is 1000 gm or more
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
            editBtn.parentElement.parentElement.nextElementSibling.firstElementChild.nextElementSibling.firstElementChild.nextElementSibling.textContent = updatedLocation;
            editBtn.parentElement.parentElement.nextElementSibling.firstElementChild.nextElementSibling.nextElementSibling.textContent = amountLeft.toFixed(2);
            editBtn.parentElement.parentElement.nextElementSibling.firstElementChild.nextElementSibling.nextElementSibling.firstElementChild.nextElementSibling.textContent = newType;
            editBtn.parentElement.parentElement.nextElementSibling.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.textContent = originalUnit;
    
            // Hide the edit form
            updatedForm.reset();
            edit_form.style.display = "none";
        });
    }
})







