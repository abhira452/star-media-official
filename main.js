document.addEventListener("DOMContentLoaded", () => {

  /* ================= HELP TOOL ================= */
  const helpBtn = document.getElementById("helpBtn");
  const helpOptions = document.getElementById("helpOptions");

  if (helpBtn && helpOptions) {
    helpBtn.onclick = () => {
      helpOptions.style.display =
        helpOptions.style.display === "block" ? "none" : "block";
    };
  }

  /* ================= BASIC VARIABLES ================= */
  let currentService = "";
  let currentPrice = 0;

  /* ================= ELEMENTS ================= */
  const landing = document.getElementById("landing");
  const selection = document.getElementById("selection");
  const success = document.getElementById("success");

  const packagesDiv = document.getElementById("packages");
  const priceDisplay = document.getElementById("price-display");
  const totalPriceDiv = document.getElementById("total-price");

  const customQty = document.getElementById("custom-quantity");
  const calculateBtn = document.getElementById("calculate-btn");

  const payBtn = document.getElementById("pay-btn");
  const backBtn = document.getElementById("back-btn");
  const homeBtn = document.getElementById("home-btn");

  const usernameInput = document.getElementById("username");
  const customerWhatsappInput = document.getElementById("customerWhatsapp");
  const whatsappLink = document.getElementById("whatsappLink");

  /* ================= CHECK ORDER ================= */
  const checkOrderBtn = document.getElementById("checkOrderBtn");

  if (checkOrderBtn) {
    checkOrderBtn.onclick = () => {
      const orderId = document.getElementById("checkOrderId").value.trim();
      const result = document.getElementById("checkOrderResult");

      if (!orderId) {
        result.innerText = "❌ Please enter Order ID";
        return;
      }

      const orders = JSON.parse(localStorage.getItem("orders")) || [];
      const order = orders.find(o => o.orderId === orderId);

      if (!order) {
        result.innerText = "❌ Order not found";
        return;
      }

      result.innerHTML = `
        ✅ Order Found<br>
        Service: ${order.service}<br>
        Amount: ₹${order.amount}<br>
        Status: ${order.status}
      `;
    };
  }

  /* ================= PRICES ================= */
  const ratePerUnit = {
    followers: 0.30,
    likes: 0.20,
    views: 0.04
  };

  const packages = {
    followers: [{ qty: 100, price: 30 }],
    likes: [{ qty: 100, price: 20 }],
    views: [{ qty: 1000, price: 40 }]
  };

  /* ================= SERVICE CLICK ================= */
  document.querySelectorAll(".card").forEach(card => {
    card.onclick = () => {
      currentService = card.dataset.service;
      landing.classList.remove("active");
      selection.classList.add("active");
      showPackages();
    };
  });

  function showPackages() {
    packagesDiv.innerHTML = "";
    totalPriceDiv.classList.add("hidden");
    customQty.value = "";

    packages[currentService].forEach(p => {
      const div = document.createElement("div");
      div.className = "package";
      div.innerText = `${p.qty} ${currentService} - ₹${p.price}`;

      div.onclick = () => {
        currentPrice = p.price;
        priceDisplay.innerText = "₹" + currentPrice;
        totalPriceDiv.classList.remove("hidden");
      };

      packagesDiv.appendChild(div);
    });
  }

  /* ================= CUSTOM CALCULATION ================= */
  if (calculateBtn) {
    calculateBtn.onclick = () => {

      if (!currentService) {
        alert("Please select a service first");
        return;
      }

      const qty = Number(customQty.value);
      if (!qty || qty <= 0) {
        alert("Enter valid quantity");
        return;
      }

      currentPrice = Math.round(qty * ratePerUnit[currentService]);
      priceDisplay.innerText = "₹" + currentPrice;
      totalPriceDiv.classList.remove("hidden");
    };
  }

  /* ================= PAYMENT ================= */
  payBtn.onclick = () => {

    if (!currentService || currentPrice <= 0) {
      alert("Please select service and price");
      return;
    }

    const username = usernameInput.value.trim();
    const customerWhatsapp = customerWhatsappInput.value.trim();

    if (!username || !customerWhatsapp) {
      alert("Fill username and WhatsApp number");
      return;
    }

    const orderId =
      "ORD-" + new Date().getFullYear() + "-" + Math.floor(10000 + Math.random() * 90000);

    const options = {
      key: "rzp_test_Rv7XMdWzLnkhx3",    //put your key here
      amount: currentPrice * 100,
      currency: "INR",
      name: "Social Media Boost",

      handler: function () {

        selection.classList.remove("active");
        success.classList.add("active");

        document.getElementById("orderIdText").innerText = orderId;

        const orders = JSON.parse(localStorage.getItem("orders")) || [];
        orders.push({
          orderId,
          service: currentService,
          amount: currentPrice,
          username,
          whatsapp: customerWhatsapp,
          status: "Processing"
        });
        localStorage.setItem("orders", JSON.stringify(orders));

        const adminNumber = "918433316066";   //put your number here

        const message = `
New Order 🚀
Order ID: ${orderId}
Service: ${currentService}
Amount: ₹${currentPrice}
Username: ${username}
Customer WhatsApp: ${customerWhatsapp}
`;

        whatsappLink.href =
          "https://wa.me/" +
          adminNumber +
          "?text=" +
          encodeURIComponent(message);
      }
    };

    new Razorpay(options).open();
  };

  /* ================= NAVIGATION ================= */
  backBtn.onclick = () => {
    selection.classList.remove("active");
    landing.classList.add("active");
  };

  homeBtn.onclick = () => {
    success.classList.remove("active");
    landing.classList.add("active");
  };

});
