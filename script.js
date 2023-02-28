
// FETCHING DATA USING ASYNC-AWAIT

// fetching the symbol data (current options) from symbol
const getCurrencyOptions = async() => {
    const optionsUrl = 'https://api.exchangerate.host/symbols';
    
    const response = await fetch(optionsUrl);
    const json = await response.json();
    
    return json.symbols;
};

// getCurrencyOptions().then(console.log)


// fetching the currency rate convert endpoint result data from API endpoint
const getCurrencyRate = async(fromCurrency, toCurrency) => {
    const currencyConvertUrl = new URL('https://api.exchangerate.host/convert')

    currencyConvertUrl.searchParams.append('from', fromCurrency);
    currencyConvertUrl.searchParams.append('to', toCurrency);

    const response = await fetch(currencyConvertUrl);
    const json = await response.json();

    return json.result;
};


// this function will create new option element and create it for the select element being
// pass as an aguments 


const  appendOptionsToSelectEl = (selectEl, optionItem) => {
    const optionEl = document.createElement('option');
    optionEl.value = optionItem.code;
    optionEl.textContent = optionItem.code;

    selectEl.appendChild(optionEl);
};

const populateSelectEl = (selectEl, optionList) => {
optionList.forEach(optionItem => {
       appendOptionsToSelectEl(selectEl, optionItem)
    })
};


// set up currencies the select elent using the previous function
    
const setupCurrencies = async () => {
    const fromCurrency = document.querySelector('#fromCurrency')
    const toCurrency = document.querySelector('#toCurrency')

    const currencyOptions = await getCurrencyOptions()
    const currencies = Object.keys(currencyOptions).map(currencyKeys =>
    currencyOptions[currencyKeys]);
    
 // populate the select elements using the previous function
    populateSelectEl(fromCurrency, currencies);
    populateSelectEl(toCurrency, currencies);
    

}

// setting up the event listener to our form

const setupEventsListener = () => {
    const formElement = document.getElementById('converterForm');
    formElement.addEventListener('submit', async (event) => {
        event.preventDefault();
        const fromCurrency = document.querySelector('#fromCurrency')
        const toCurrency = document.querySelector('#toCurrency');
        const amount = document.querySelector('#amount');
        const convertResultEl = document.querySelector('#result');

       try {
        const rate = await  getCurrencyRate(fromCurrency.value, toCurrency.value);
        const amountValue = Number(amount.value);
        const conversionRate = Number(amountValue * rate).toFixed(2);
        convertResultEl.textContent = `${amountValue} ${fromCurrency.value} = ${conversionRate} ${toCurrency.value}`;
       } 
       catch (err) {
            convertResultEl.textContent = `There is an error fetching [${err.message}]`;
            convertResultEl.classList.add('error');
       }
    })
}


setupEventsListener()
setupCurrencies();