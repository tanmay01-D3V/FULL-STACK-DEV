import { fetchQuotes } from "./Api.js";

fetchQuotes().then(data => {
  console.log("Quote:", data);
});

document.addEventListener('DOMContentLoaded', () => {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    item.addEventListener('click', function () {
      const plus = this.querySelector('.faq-question span:last-child');
      plus.textContent = plus.textContent === '+' ? '×' : '+';
    });
  });

  const signinModal = document.getElementById('signin-modal');
  const signinForm = document.getElementById('signin-form');
  const emailError = document.getElementById('email-error');
  const passwordError = document.getElementById('password-error');
  const signinEmail = document.getElementById('signin-email');
  const signinPassword = document.getElementById('signin-password');

  function clearErrors() {
    signinFormError.textContent = '';
    emailError.textContent = '';
    passwordError.textContent = '';
    signinEmail.classList.remove('error-field');
    signinPassword.classList.remove('error-field');
  }

  function openSigninModal() {
    clearErrors();
    signinModal.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function closeSigninModal() {
    signinModal.classList.remove('show');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.signout').forEach(btn => {
    btn.addEventListener('click', openSigninModal);
  });

  document.querySelector('.signin-close').addEventListener('click', closeSigninModal);
  signinModal.addEventListener('click', (e) => {
    if (e.target === signinModal) closeSigninModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && signinModal.classList.contains('show')) closeSigninModal();
  });

  signinForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();

    const email = signinEmail.value.trim();
    const password = signinPassword.value;

    const errors = [];
    if (!email) {
      emailError.textContent = 'Please enter your email or phone number.';
      signinEmail.classList.add('error-field');
      errors.push('email');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && !/^\d{10}$/.test(email)) {
      emailError.textContent = 'Please enter a valid email address or phone number.';
      signinEmail.classList.add('error-field');
      errors.push('email');
    }
    if (!password) {
      passwordError.textContent = 'Your password must contain at least 8 characters.';
      signinPassword.classList.add('error-field');
      errors.push('password');
    } else if (password.length < 4 || password.length > 60) {
      passwordError.textContent = 'Your password must contain at least 8 characters.';
      signinPassword.classList.add('error-field');
      errors.push('password');
    }

    if (errors.length > 0) {
      signinFormError.textContent = 'Please correct the errors below.';
    } else {
      signinFormError.textContent = '';
      alert('You have successfully signed in!');
      closeSigninModal();
    }
  });

  const getStartedButtons = document.querySelectorAll('.get-started-trigger');
  getStartedButtons.forEach(button => {
    button.addEventListener('click', function () {
      window.location.href = 'signup.html';
    });
  });

  const trendingCardList = [
    {
      id: 'taskari',
      title: 'Taskari',
      description:
        'A dedicated customs officer and his team take on a notorious smuggler leading a powerful syndicate, but unexpected obstacles threaten their mission.',
      image:
        'https://occ-0-8974-2164.1.nflxso.net/dnm/api/v6/mAcAr9TxZIVbINe88xb3Teg5_OA/AAAABTk_B0l_BvDJ7CQuWOAax9ZKSAe65vFGUMjAee8pcvuYXDFDvcnFaF8nOEuwxBg-TFKzHTqhdD3D7zlMsXSpA_BQTHf-ouBVNdwJIJvNQzUGje4WVrnptKL5Ywqu9hV7pg3A.webp?r=f34'
    },
    {
      id: 'stranger-things',
      title: 'Stranger Things',
      description:
        'When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.',
      image:
        'https://occ-0-8974-2164.1.nflxso.net/dnm/api/v6/mAcAr9TxZIVbINe88xb3Teg5_OA/AAAABXMlNt8lRlEH5nkoYUHkzaYFsKJJvQq-3wQ4-DyYWQmKlxu9qrynyD5cNZEHPowiQL9IPEPbTSBM9B-id8nR8QPVfL1P_CQjPOqe5ZsDbekwH5AVJbhS3v4gSBXhZb4qdcE6.webp?r=e8a'
    },
    {
      id: 'tere-ishq-mein',
      title: 'Tere Ishq Mein',
      description:
        'A hot-headed fighter pilot and a psychologist confront their turbulent romantic past when they meet years later — with new lives and unresolved feelings.',
      image:
        'https://occ-0-8974-2164.1.nflxso.net/dnm/api/v6/mAcAr9TxZIVbINe88xb3Teg5_OA/AAAABVbXUoTNkiWeGLsVtY9HIcuwl1a3-qGoR3UlqNqTqNaSBIYjd0DYeSO0mJcKaiMaH4AYtFRuqnHeuwcxSB3sofkfoh_zn_c9A80.webp?r=0e8'
    },
    {
      id: 'kapil-show',
      title: 'The Great Indian Kapil Show',
      description:
        'Comedian Kapil Sharma hosts this laugh-out-loud variety talk show with celebrity guests, hilarious antics and his signature supporting cast.',
      image:
        'https://occ-0-8974-2164.1.nflxso.net/dnm/api/v6/mAcAr9TxZIVbINe88xb3Teg5_OA/AAAABV8y885z_biaHFzOnK0KRFhkNoyKYARfacGgsrezJNn5kYOvAfIDh4J02r4QkAELJzVWJnBu7aF45OyrVslCvEb0pK7vvMUb-tlPMEB8-rMJnpjGfCCaQoxzIWjciJoT851p.webp?r=dff'
    },
    {
      id: 'jolly-llb',
      title: 'Jolly LLB',
      description:
        'Two advocates with wildly different legal tactics seek justice for a farmer\'s widow after her late husband lost his land to a major developer.',
      image:
        'https://occ-0-8974-2164.1.nflxso.net/dnm/api/v6/mAcAr9TxZIVbINe88xb3Teg5_OA/AAAABTJf3e14TtZ2Z3216UaphDq5nf1SaFyC-0R59wDCSyGdNROqYPTHg8g8SU0kbcn61BMumEkghBN8r11S6_bhQvNJ4oQD4oECM-M.webp?r=e5d'
    }
  ];

  const trendingRow = document.getElementById('trending-row');

  if (trendingRow && Array.isArray(trendingCardList)) {
    trendingCardList.forEach((cardData, index) => {
      const card = document.createElement('div');
      card.classList.add('trending-card', `trending-card${index + 1}`);

      const rankBadge = document.createElement('span');
      rankBadge.classList.add('trending-number');
      rankBadge.textContent = String(index + 1);

      const thumbnail = document.createElement('img');
      thumbnail.classList.add('movie-thumbnail');
      thumbnail.setAttribute('src', cardData.image);
      thumbnail.setAttribute('alt', cardData.title);

      const modalId = `modal-${cardData.id}`;
      thumbnail.addEventListener('click', function () {
        openModal(modalId);
      });

      const modal = document.createElement('div');
      modal.classList.add('modal');
      modal.setAttribute('id', modalId);

      const modalContent = document.createElement('div');
      modalContent.classList.add('modal-content');

      const closeSpan = document.createElement('span');
      closeSpan.classList.add('close');
      closeSpan.innerHTML = '&times;';
      closeSpan.addEventListener('click', function () {
        closeModal(modalId);
      });

      const modalImage = document.createElement('img');
      modalImage.setAttribute('src', cardData.image);
      modalImage.setAttribute('alt', cardData.title);

      const modalTitle = document.createElement('h2');
      modalTitle.textContent = cardData.title;

      const modalDescription = document.createElement('p');
      modalDescription.textContent = cardData.description;

      const modalButton = document.createElement('button');
      modalButton.classList.add('Getstarted', 'get-started-trigger');
      modalButton.textContent = 'Get Started >';

      modalContent.appendChild(closeSpan);
      modalContent.appendChild(modalImage);
      modalContent.appendChild(modalTitle);
      modalContent.appendChild(modalDescription);
      modalContent.appendChild(modalButton);

      modal.appendChild(modalContent);

      card.appendChild(rankBadge);
      card.appendChild(thumbnail);
      card.appendChild(modal);

      trendingRow.appendChild(card);
    });


    const dynamicGetStartedButtons = document.querySelectorAll('.get-started-trigger');
    dynamicGetStartedButtons.forEach(button => {
      button.addEventListener('click', function () {
        window.location.href = 'signup.html';
      });
    });
  }
});

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

window.onclick = function (event) {
  if (event.target.classList.contains('modal')) {
    event.target.style.display = "none";
    document.body.style.overflow = "auto";
  }
}

