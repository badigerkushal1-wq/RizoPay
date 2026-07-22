// State Management
const RizoState = {
  user: JSON.parse(localStorage.getItem('rp_user')) || {
    id: 'RP' + Math.floor(100000 + Math.random() * 900000),
    phone: '9876543210',
    balance: 0,
    referralWallet: 0,
    refCode: 'RZ' + Math.floor(1000 + Math.random() * 9000),
    level1Count: 3,
    level2Count: 5,
    withdrawAccounts: {}
  },
  plans: [
    { id: 1, name: 'RP Token - Tier 1', price: 100, rate: 6, quote: 106 },
    { id: 2, name: 'RP Token - Tier 2', price: 300, rate: 6, quote: 318 },
    { id: 3, name: 'RP Token - Tier 3', price: 450, rate: 6, quote: 477 }
  ],
  orders: JSON.parse(localStorage.getItem('rp_orders')) || [],
  save() {
    localStorage.setItem('rp_user', JSON.stringify(this.user));
    localStorage.setItem('rp_orders', JSON.stringify(this.orders));
  }
};

// Global Utilities
document.addEventListener('DOMContentLoaded', () => {
  initBanners();
  updateUI();
});

function initBanners() {
  const wrapper = document.getElementById('bannerWrapper');
  if (!wrapper) return;
  let index = 0;
  setInterval(() => {
    index = (index + 1) % 3;
    wrapper.style.transform = `translateX(-${index * 100}%)`;
  }, 3500);
}

function updateUI() {
  const balElem = document.getElementById('userBalance');
  if (balElem) balElem.innerText = `₹${RizoState.user.balance.toFixed(2)}`;
}

// Payment Logic
let timerInterval = null;
function triggerBuy(planId) {
  const plan = RizoState.plans.find(p => p.id === planId);
  if (!plan) return;

  const modal = document.getElementById('paymentModal');
  if (modal) {
    document.getElementById('modalPrice').innerText = plan.price;
    modal.style.display = 'flex';
    startCountdown(600); // 10 minutes
  }
}

function startCountdown(seconds) {
  clearInterval(timerInterval);
  const timerDisplay = document.getElementById('timer');
  let left = seconds;
  
  timerInterval = setInterval(() => {
    const m = Math.floor(left / 60).toString().padStart(2, '0');
    const s = (left % 60).toString().padStart(2, '0');
    if (timerDisplay) timerDisplay.innerText = `${m}:${s}`;
    if (--left < 0) {
      clearInterval(timerInterval);
      alert('Payment window expired!');
      closeModal();
    }
  }, 1000);
}

function closeModal() {
  const modal = document.getElementById('paymentModal');
  if (modal) modal.style.display = 'none';
  clearInterval(timerInterval);
}

function submitUTR() {
  const utr = document.getElementById('utrInput').value;
  if (!utr || utr.length < 8) {
    alert('Please enter a valid 12-digit UTR number.');
    return;
  }
  
  RizoState.orders.push({
    id: 'ORD' + Date.now(),
    utr: utr,
    status: 'Under Review',
    date: new Date().toLocaleDateString()
  });
  RizoState.save();
  
  alert('Payment Submitted Successfully! Verification status: Under Review.');
  closeModal();
}

function transferReferralWallet() {
  if (RizoState.user.referralWallet <= 0) {
    alert('No funds available in Referral Wallet.');
    return;
  }
  RizoState.user.balance += RizoState.user.referralWallet;
  RizoState.user.referralWallet = 0;
  RizoState.save();
  updateUI();
  alert('Successfully transferred referral income to Main Wallet!');
  location.reload();
}
