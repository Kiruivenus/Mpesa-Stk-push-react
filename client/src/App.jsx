import { useState } from "react";
import "./index.css";
import Axios from "axios";

function App() {
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const payHandler = (event) => {
    event.preventDefault();
    if (!phone || !amount) {
      alert("Please fill in both fields.");
      return;
    }
    if (!/^\d{10}$/.test(phone)) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    setLoading(true);
    Axios.post("https://mpesa-stk-push-reactjs.onrender.com/token", { amount, phone })
      .then((res) => {
        alert("Payment initiated successfully!");
        console.log(res);
      })
      .catch((error) => {
        console.error(error);
        alert("Payment failed. Please try again.");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br p-6 from-green-50 to-green-100 flex flex-col justify-center items-center">
      <div className="w-full max-w-md  bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-3xl font-semibold text-center text-green-600 mb-6">
          Pay with <span className="font-bold">Mpesa</span>
        </h1>
        <form
          className="flex flex-col space-y-4"
          onSubmit={payHandler}
        >
          <input
            type="text"
            placeholder="Enter phone number"
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none"
          />
          <input
            type="number"
            placeholder="Enter amount"
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 text-lg font-semibold text-white rounded-lg ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </form>
        <p className="text-sm text-gray-500 text-center mt-4">
          Ensure the phone number is registered for Mpesa.
        </p>
      </div>
    </div>
  );
}

export default App;
