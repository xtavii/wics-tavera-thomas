import React, { useState } from 'react';
import './index.css';

const AddTransactionModal = ({ isOpen, onClose, onAdd }) => {
  const [label, setLabel] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = () => {
    if (!label) {
      alert('Per favore, inserisci una etichetta valida.');
      return;
    }
    if (amount === '') {
      alert('Per favore, inserisci un importo.');
      return;
    }
    if (!date) {
      alert('Per favore, inserisci una data valida.');
      return;
    }
    const formattedDate = date.split('-').reverse().join('/');
    onAdd({ label, amount: parseFloat(amount), date: formattedDate });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Aggiungi Transazione</h2>
        <input value={label} onChange={e => setLabel(e.target.value)} placeholder="Etichetta" />
        <input value={amount} onChange={e => setAmount(e.target.value)} placeholder="Importo" type="number"/>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        <button onClick={handleSubmit}>Aggiungi</button>
      </div>
    </div>
  );
};

const Wallet = () => {
  const [transactions, setTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddTransaction = (transaction) => {
    const { date, ...rest } = transaction;
    const [day, month, year] = date.split('/');
    const formattedDate = new Date(year, month - 1, day); // Date uses 0-based months

    const newTransaction = {
      ...rest,
      id: Date.now(),
      date: formattedDate
    };

    setTransactions(prevTransactions => {
      const updatedTransactions = [...prevTransactions, newTransaction];
      // Ordina le transazioni per data in ordine decrescente
      updatedTransactions.sort((a, b) => b.date - a.date);
      return updatedTransactions;
    });
  };

  const calculateTotals = () => {
    const totals = transactions.reduce(
      (acc, transaction) => {
        const amount = parseFloat(transaction.amount);
        if (amount > 0) {
          acc.entrate += amount;
        } else {
          acc.uscite += amount;
        }
        return acc;
      },
      { entrate: 0, uscite: 0 }
    );
    totals.imponibile = totals.entrate + totals.uscite;
    return totals;
  };

  const { entrate, uscite, imponibile } = calculateTotals();

  return (
    <div className="wallet">
      <h1>Il Mio Portafoglio</h1>
      <button onClick={() => setIsModalOpen(true)}>+</button>
      <AddTransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={handleAddTransaction} />
      <div className="movimenti">
        <h2>Movimenti</h2>
        <ul>
          {transactions.map((transaction) => (
            <li key={transaction.id}>
              <span className="label" style={{ fontWeight: 'bold', marginRight: '140px' }}>{transaction.label}</span>
              <span className="amount" style={{ marginRight: '140px' }}>{transaction.amount.toFixed(2)}€</span>
              <span className="date" style={{ marginRight: '20px', color: '#19bdf4' }}>
                {transaction.date.toLocaleDateString('it-IT')}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="riepilogo">
        <h2>Riepilogo</h2>
        <ul>
          <li><span style={{ fontWeight: 'bold' }}>Entrate:</span> €{entrate.toFixed(2)}</li>
          <li><span style={{ fontWeight: 'bold' }}>Uscite:</span> €{uscite.toFixed(2)}</li>
          <li><span style={{ fontWeight: 'bold' }}>Imponibile:</span> €{imponibile.toFixed(2)}</li>
        </ul>
      </div>
    </div>
  );
};

export default Wallet;