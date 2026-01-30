document.addEventListener('DOMContentLoaded', () => {
  // FAQ functionality
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    item.addEventListener('click', function () {
      const plus = this.querySelector('.faq-question span:last-child');
      plus.textContent = plus.textContent === '+' ? '×' : '+';
    });
  });

  // Sign In/Sign Out functionality
  const Signout = document.querySelectorAll('.signout');
  Signout.forEach(button => {
    button.addEventListener('click', function () {
      alert("You have successfully signed In!");
    });
  });

  // Signup navigation
  const getStartedButtons = document.querySelectorAll('.get-started-trigger');
  getStartedButtons.forEach(button => {
    button.addEventListener('click', function () {
      window.location.href = 'signup.html';
    });
  });
});

// Modal functionality
function openModal(modalId) {
  var modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = "block";
    document.body.style.overflow = "hidden";
  }
}

function closeModal(modalId) {
  var modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
  }
}

// Close modal when clicking outside of it
window.onclick = function (event) {
  if (event.target.classList.contains('modal')) {
    event.target.style.display = "none";
    document.body.style.overflow = "auto";
  }
}