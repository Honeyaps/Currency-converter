import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style.css';
import { MdCurrencyExchange } from "react-icons/md";

const CurrencyConverter = () => {
    const [amount, setAmount] = useState('');
    const [fromCurrency, setFromCurrency] = useState('USD');
    const [toCurrency, setToCurrency] = useState('EUR');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const currencies = [
        'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'SEK', 'NZD',
        'MXN', 'SGD', 'HKD', 'NOK', 'KRW', 'TRY', 'INR', 'RUB', 'BRL', 'ZAR'
    ];

    useEffect(() => {
        fetchConversionRate();
    }, [fromCurrency, toCurrency]); // Fetch rates whenever fromCurrency or toCurrency changes

    const fetchConversionRate = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
            const rate = response.data.rates[toCurrency];
            
            if (rate) {
                setResult((parseFloat(amount) * rate).toFixed(2));
            } else {
                setError('Invalid currency selection. Please try again.');
            }
        } catch (error) {
            setError('Error fetching exchange rates. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!amount || isNaN(amount)) {
            setError('Please enter a valid amount.');
            return;
        }
        fetchConversionRate();
    };

    return (
        <div className="currency-converter">
            <h1>Currency Converter <MdCurrencyExchange /></h1>
            <form onSubmit={handleSubmit} className="converter-form">
                <div className="form-group">
                    <label htmlFor="amount">Amount</label>
                    <input
                        type="number"
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter amount"
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="fromCurrency">From</label>
                    <select
                        id="fromCurrency"
                        value={fromCurrency}
                        onChange={(e) => setFromCurrency(e.target.value)}
                        className="form-control"
                    >
                        {currencies.map(currency => (
                            <option key={currency} value={currency}>{currency}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="toCurrency">To</label>
                    <select
                        id="toCurrency"
                        value={toCurrency}
                        onChange={(e) => setToCurrency(e.target.value)}
                        className="form-control"
                    >
                        {currencies.map(currency => (
                            <option key={currency} value={currency}>{currency}</option>
                        ))}
                    </select>
                </div>
            </form>
            {loading && <p className="loading-message">Loading...</p>}
            {error && <p className="error-message">{error}</p>}
            {result && <h4 className="result-message">{amount} {fromCurrency} = {result} {toCurrency}</h4>}
        </div>
    );
};

export default CurrencyConverter;
