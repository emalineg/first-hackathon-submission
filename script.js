var ficoScore = 690;

const loanAmountInput = document.querySelector(".loan-amount");
const interestRateInput = document.querySelector(".interest-amount");
const loanDurationInput = document.querySelector(".loan-duration");

const loanEMIValue = document.querySelector(".loan-emi .value");
const totalInterestValue = document.querySelector(".total-interest .value");
const totalAmountValue = document.querySelector(".total-amount .value");

const calculateBtn = document.querySelector(".calculate-btn");

/********* mortgage calc *************/

let loanAmount = parseFloat(loanAmountInput.value);
let interestRate = parseFloat(interestRateInput.value);
let loanDuration = parseFloat(loanDurationInput.value);

let interest = interestRate / 12 / 100;

let myChart;

const calculateEMI = () => {

    refreshInputValues();

    let emi = 
        loanAmount *
        interest *
        (Math.pow(1+interest, loanDuration) / (Math.pow(1+interest, loanDuration)-1));

    return emi;
}

const displayChart = (totalInterestPayableValue) => {
    const ctx = document.getElementById("chart").getContext("2d");
    myChart = new Chart(ctx, {
      type: "pie",
      data: {
        labels: ["Total Interest", "Principal Loan Amount"],
        datasets: [
          {
            data: [totalInterestPayableValue, loanAmount],
            backgroundColor: ["orangered", "#15213d"],
            borderWidth: 0,
          },
        ],
      },
    });
};

const updateChart = (totalInterestPayableValue) => {
    myChart.data.datasets[0].data[0] = totalInterestPayableValue;
    myChart.data.datasets[0].data[1] = loanAmount;
    myChart.update();
};

const refreshInputValues = () => {
    loanAmount = parseFloat(loanAmountInput.value);
    interestRate = parseFloat(interestRateInput.value);
    loanDuration = parseFloat(loanDurationInput.value);
    interest = interestRate / 12 / 100;
  };
  

const updateData = (emi) => {
    loanEMIValue.innerHTML = Math.round(emi);

    let totalAmount = Math.round(loanDuration * emi);
    totalAmountValue.innerHTML = totalAmount;

    let totalInterestPayable = Math.round(totalAmount - loanAmount);
    totalInterestValue.innerHTML = totalInterestPayable;

    if (myChart) {
        updateChart(totalInterestPayable);
    } else {
        displayChart(totalInterestPayable);
    }

};

const init = () => {
    let emi = calculateEMI();
    updateData(emi);
}

init();

calculateBtn.addEventListener("click", init);