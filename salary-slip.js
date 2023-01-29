/*
Name - Ashwin Anand
Email id - anandashwin806@gmail.com
*/


// adding event listeners to input fields when DOM is loaded
document.addEventListener("DOMContentLoaded", event => {

    // selecting input elements of type number with in a class named deductions
    var numInputNodes = document.querySelectorAll("div.deductions input[type=number]");


    var i;
    for (i = 0; i < numInputNodes.length; i++) {
        numInputNodes[i].addEventListener('input', function () {

            var element = getAppropriateElement(this);

            if (!this.validity.valid) {

                this.setAttribute('data-val', this.value);

                var dummyVal = this.getAttribute('data-val');

                var current = parseFloat(this.value);
                var max = parseFloat(this.max);
                var min = parseFloat(this.min);

                if (this.value.match(/^[0-9]{1}\.{1}/)) {
                    this.value = dummyVal.slice(0, 4);
                    if (!(current >= min && current <= max))
                        showError(element, this);

                }
                else if (this.value.match(/^[0-9]{2,}\.{1}/)) {
                    this.value = dummyVal.slice(0, 5);
                    if (!(current >= min && current <= max))
                        showError(element, this);

                }
                else {
                    this.value = dummyVal.slice(0, 2);
                    if (!(current >= min && current <= max))
                        showError(element, this);
                }
            }
            else {
                element.setAttribute("hidden", "hidden");
            }

            current = parseFloat(this.value);

            if ((current >= min && current <= max))
                element.setAttribute("hidden", "hidden");

        }, false)
    }



    numInputNodes = document.querySelectorAll("div.annualSalDiv input[type=number], div.additions input[type=number]");


    for (i = 0; i < numInputNodes.length; i++) {
        numInputNodes[i].addEventListener('input', function () {

            var element = getAppropriateElement(this);

            if (!this.validity.valid) {

                if (this.value != '')
                    this.value = this.getAttribute('data-val');

                showError(element, this);
            }
            else {
                element.setAttribute("hidden", "hidden");
            }

            this.setAttribute('data-val', this.value);

        }, false)
    }
});


// returns an appropriate error element in the document
function getAppropriateElement(currentElem) {

    var element;

    var nameError = document.getElementById("nameError");
    var itError = document.getElementById("itError");
    var eiError = document.getElementById("eiError");
    var cppError = document.getElementById("cppError");
    var salError = document.getElementById("salError");
    var bonusError = document.getElementById("bonusError");
    var allowanceError = document.getElementById("allowanceError");
    var formError = document.getElementById("formError");


    switch (currentElem.id) {
        case "empName":
            element = nameError;
            break;
        case "incomeTax":
            element = itError;
            break;
        case "ei":
            element = eiError;
            break;
        case "cpp":
            element = cppError;
            break;
        case "empAllowance":
            element = allowanceError;
            break;
        case "empBonus":
            element = bonusError;
            break;
        case "empAnnualSal":
            element = salError;
            break;
        case "submitBtn":
            element = formError;
            break;
    }
    return element;
}


// checks whether all the fields are filled or not
function doesErrorExist() {

    var inputElements = document.querySelectorAll("input");

    var errorExists = false;

    for (var i = 0; i < inputElements.length; i++) {
        if (inputElements[i].type == "radio") {
            var selectedRadioBtn = getSelectedRadioButton(document.getElementsByName(inputElements[i].name));

            if (!selectedRadioBtn) {
                errorExists = true;
            }
        }
        else {
            if (inputElements[i].value == "") {
                errorExists = true;
            }
        }
    }

    return errorExists;
}


// displays error message if input format is not met
function showError(element, currentElem) {

    if (currentElem.min && currentElem.min != 0)
        element.innerHTML = "!! Please enter a value between " + currentElem.min + " and " + currentElem.max + " !!";
    else
        element.innerHTML = "!! Please enter a valid value !!"

    element.removeAttribute("hidden");

}

// calculate net salary of an employee including taxes
function calculateNetSalary() {

    event.preventDefault();

    var element = getAppropriateElement(submitBtn);


    if (!doesErrorExist()) {

        element.setAttribute("hidden", "hidden");

        var name = document.getElementById("empName").value;

        var grossSallery = parseFloat(document.getElementById("empAnnualSal").value);

        var bonus = parseFloat(document.getElementById("empBonus").value);

        var allowance = parseFloat(document.getElementById("empAllowance").value);

        var iTax = parseFloat(document.getElementById("incomeTax").value);

        var cpp = parseFloat(document.getElementById("cpp").value);

        var ei = parseFloat(document.getElementById("ei").value);

        var selectedGender = getSelectedGender().value;

        var numberOfDeps = getNumberOfDependents().value;

        var totalTax = getTotalTax(iTax, cpp, ei, selectedGender, numberOfDeps);

        var additionsTotal = getGrossSalleryWithBonuses(grossSallery, bonus, allowance);

        var deductionsTotal = getTotalDeduction(grossSallery, totalTax);

        var netSalary = (additionsTotal - deductionsTotal).toFixed(2);;

        displayResult(name, grossSallery, netSalary, selectedGender, numberOfDeps);

    }
    else {

        element.innerHTML = "!! Please provide formatted values for all required fields !!"

        element.removeAttribute("hidden");
    }
}


// displays final result
function displayResult(name, grossSallery, netSalary, selectedGender, numberOfDeps) {

    document.getElementById("resultHeader").innerHTML = "Results are as follows: ";

    document.getElementById("resultName").innerHTML = "Employee Name: " + name;

    document.getElementById("sal").innerHTML = "Employee Gross Salary: " + grossSallery;

    document.getElementById("netSal").innerHTML = "Employee Net Salary: " + netSalary;

    document.getElementById("resultGender").innerHTML = "Gender: " + selectedGender;

    document.getElementById("resultDep").innerHTML = "Number of Dependents: " + numberOfDeps;

    document.getElementById("result").removeAttribute("hidden");
}

// calculate total tax paid by an employee
function getTotalTax(iTax, cpp, ei, selectedGender, numberOfDeps) {

    var totalTax = 0;

    if (selectedGender == "Female")
        iTax = iTax - 2;

    if (numberOfDeps === '3') {
        iTax = iTax - 2;
    }
    else if (numberOfDeps === '4')
        iTax = iTax - 4;

    return (iTax + cpp + ei) / 100;
}

// returns total salary including additions
function getGrossSalleryWithBonuses(grossSallery, bonus, allowance) {
    return grossSallery + bonus + allowance;
}

// returns the salary to be deducted from annual salary
function getTotalDeduction(grossSallery, totalTax) {
    return grossSallery * totalTax;
}


// return the selected gender
function getSelectedGender() {
    var genderRadioBtns = document.getElementsByName('gender');
    return getSelectedRadioButton(genderRadioBtns);
}

// returns the number of dependents of an employee
function getNumberOfDependents() {
    var dependentsRadioBtns = document.getElementsByName('dependents');
    return getSelectedRadioButton(dependentsRadioBtns);
}

// Finds and returns the selected option from a group of radio buttons
function getSelectedRadioButton(radioBtns) {

    var selectedRadio;

    for (var i = 0; i < radioBtns.length; i++) {
        if (radioBtns[i].checked)
            selectedRadio = radioBtns[i];
    }

    return selectedRadio;
}