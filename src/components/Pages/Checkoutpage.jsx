import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Header from "../Header";

const CheckoutPage = () => {
  const [cart, setCart] = useState([]);
  const uId = localStorage.getItem("id");

  const fetchCart = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/users/${uId}`);
      setCart(response.data.cart);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const calculatesubtotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const calculatetaxes = (subtotal) => {
    return subtotal * 0.1;
  };

  const calculateshipping = () => {
    return 0;
  };

  const subtotal = calculatesubtotal();
  const taxes = calculatetaxes(subtotal);
  const shipping = calculateshipping();
  const total = subtotal + taxes + shipping;

  const handlesubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const orderData = {
      email: formData.get("email-address"),
      firstname: formData.get("first-name"),
      lastname: formData.get("last-name"),
      phonenumber: formData.get("phone-number"),
      address: formData.get("address"),
      city: formData.get("city"),
      state: formData.get("state"),
      zipcode: formData.get("zip-code"),
      cardname: formData.get("card-name"),
      cardnumber: formData.get("card-number"),
      expirationdate: formData.get("expiration-date"),
      securitycode: formData.get("security-code"),
      items: cart,
      subtotal,
      taxes,
      shipping,
      total,
    };

    try {
      await axios.patch(`http://localhost:3000/users/${uId}`, {
        order: orderData,
      });
      toast.success("Order placed Successfully!");
      setCart([]);
      await axios.patch(`http://localhost:3000/users/${uId}`, {
        cart: [],
      });
    } catch (error) {
      console.error("Error submitting order:", error.response ? error.response.data : error.message);
    }
  };

  return (
    <div>
      <Header/>
    <div className="font-[sans-serif] bg-white">
      <div className="flex max-sm:flex-col gap-12 max-lg:gap-4 h-full">
        <div className="bg-gradient-to-r from-black to-black lg:min-w-[370px] sm:min-w-[300px]">
          <div className="h-full">
            <div className="px-4 py-8 overflow-auto">
              <div className="space-y-4">
                {cart.map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-32 h-28 max-lg:w-24 max-lg:h-24 flex p-3 shrink-0 bg-gray-300 rounded-md">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full object-contain"
                      />
                    </div>
                    <div className="w-full">
                      <h3 className="text-base text-white">{item.name}</h3>
                      <ul className="text-xs text-gray-300 space-y-2 mt-2">
                        <li className="flex flex-wrap gap-4">
                          Quantity <h3 className="ml-auto">{item.quantity}</h3>
                        </li>
                        <li className="flex flex-wrap gap-4">
                          Total Price <h3 className="ml-auto">${item.price}</h3>
                        </li>
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-300 w-full p-4">
              <h4 className="flex flex-wrap gap-4 text-base text-black">
                Total <h3 className="ml-auto">${total}</h3>
              </h4>
            </div>
          </div>
        </div>

        <div className="max-w-4xl w-full h-max rounded-md px-4 py-8">
          <h2 className="text-2xl font-bold text-gray-800">
            Complete your order
          </h2>
          <form onSubmit={handlesubmit} className="mt-8">
            {/* Personal Details Section */}
            <div>
              <h3 className="text-base text-gray-800 mb-4">Personal Details</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    placeholder="First Name"
                    className="px-4 py-3 bg-gray-100 focus:bg-transparent text-gray-800 w-full text-sm rounded-md focus:outline-red-600"
                    id="first-name"
                    name="first-name"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Last Name"
                    className="px-4 py-3 bg-gray-100 focus:bg-transparent text-gray-800 w-full text-sm rounded-md focus:outline-red-300"
                    id="last-name"
                    name="last-name"
                  />
                </div>

                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    className="px-4 py-3 bg-gray-100 focus:bg-transparent text-gray-800 w-full text-sm rounded-md focus:outline-red-300"
                    id="email-address"
                    name="email-address"
                  />
                </div>

                <div>
                  <input
                    type="number"
                    placeholder="Phone No."
                    className="px-4 py-3 bg-gray-100 focus:bg-transparent text-gray-800 w-full text-sm rounded-md focus:outline-red-300"
                    id="phone-number"
                    name="phone-number"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address Section */}
            <div className="mt-8">
              <h3 className="text-base text-gray-800 mb-4">Shipping Address</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    placeholder="Address Line"
                    className="px-4 py-3 bg-gray-100 focus:bg-transparent text-gray-800 w-full text-sm rounded-md focus:outline-red-300"
                    id="address"
                    name="address"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="City"
                    className="px-4 py-3 bg-gray-100 focus:bg-transparent text-gray-800 w-full text-sm rounded-md focus:outline-pink-300"
                    id="city"
                    name="city"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="State"
                    className="px-4 py-3 bg-gray-100 focus:bg-transparent text-gray-800 w-full text-sm rounded-md focus:outline-red-300"
                    id="state"
                    name="state"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Zip Code"
                    className="px-4 py-3 bg-gray-100 focus:bg-transparent text-gray-800 w-full text-sm rounded-md focus:outline-red-300"
                    id="zip-code"
                    name="zip-code"
                  />
                </div>
              </div>
            </div>

            {/* Payment Section */}
            <div className="mt-8">
              <h3 className="text-base text-gray-800 mb-4">Payment Details</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    placeholder="Card Number"
                    className="px-4 py-3 bg-gray-100 focus:bg-transparent text-gray-800 w-full text-sm rounded-md focus:outline-red-300"
                    id="card-number"
                    name="card-number"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Name on Card"
                    className="px-4 py-3 bg-gray-100 focus:bg-transparent text-gray-800 w-full text-sm rounded-md focus:outline-red-300"
                    id="card-name"
                    name="card-name"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Expiration Date (MM/YY)"
                    className="px-4 py-3 bg-gray-100 focus:bg-transparent text-gray-800 w-full text-sm rounded-md focus:outline-red-300"
                    id="expiration-date"
                    name="expiration-date"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="CVV"
                    className="px-4 py-3 bg-gray-100 focus:bg-transparent text-gray-800 w-full text-sm rounded-md focus:outline-red-300"
                    id="security-code"
                    name="security-code"
                  />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 max-md:flex-col mt-8">
              <button
                type="button"
                className="rounded-md px-6 py-3 w-full text-sm tracking-wide bg-transparent hover:bg-gray-100 border border-gray-300 text-gray-800 max-md:order-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md px-6 py-3 w-full text-sm tracking-wide bg-red-300 hover:bg-gray-200 text-white"
              >
                Complete Purchase
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </div>
  );
};

export default CheckoutPage;
