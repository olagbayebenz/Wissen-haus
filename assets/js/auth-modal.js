// Login Modal
const modal = document.getElementById('authModal');
const authForm = document.getElementById('authForm');
const toggleForm = document.getElementById('toggleForm');
const closeBtn = document.getElementById('closeAuthModal');
const formTitle = document.getElementById('formTitle');
const submitBtn = document.getElementById('submitBtn');
const errorMsg = document.getElementById('authError');
const isLoginInput = document.getElementById('isLogin');

let isLogin = true;

window.openAuthModal = () => {
  modal.classList.add('show');
  isLogin = true;
  updateFormMode();
};

window.closeAuthModal = () => {
  modal.classList.remove('show');
};

closeBtn?.addEventListener('click', closeAuthModal);

modal?.addEventListener('click', (e) => {
  if (e.target === modal) closeAuthModal();
});

toggleForm?.addEventListener('click', (e) => {
  e.preventDefault();
  isLogin = !isLogin;
  updateFormMode();
});

function updateFormMode() {
  isLoginInput.value = isLogin;
  if (isLogin) {
    formTitle.textContent = 'Sign In';
    document.getElementById('signupFields').style.display = 'none';
    submitBtn.textContent = 'Sign In';
    toggleForm.innerHTML = 'No account? <a>Create one</a>';
  } else {
    formTitle.textContent = 'Create Account';
    document.getElementById('signupFields').style.display = 'block';
    submitBtn.textContent = 'Sign Up';
    toggleForm.innerHTML = 'Already have an account? <a>Sign In</a>';
  }
  errorMsg.classList.remove('show');
}

authForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  errorMsg.classList.remove('show');

  const isLoginMode = isLoginInput.value === 'true';
  const email = document.getElementById('authEmail').value.trim();
  const password = document.getElementById('authPassword').value;

  if (!email || !password) {
    showError('Please fill in all fields');
    return;
  }

  try {
    submitBtn.disabled = true;
    submitBtn.textContent = isLoginMode ? 'Signing in...' : 'Creating account...';

    if (!window.supabase) throw new Error('Auth service not ready');

    let result;
    if (isLoginMode) {
      result = await window.supabase.auth.signInWithPassword({ email, password });
    } else {
      const firstName = document.getElementById('authFirstName').value.trim();
      const lastName = document.getElementById('authLastName').value.trim();
      if (!firstName || !lastName) {
        throw new Error('Please enter your first and last name');
      }
      result = await window.supabase.auth.signUp({
        email,
        password,
        options: { data: { first_name: firstName, last_name: lastName } }
      });
    }

    if (result.error) throw new Error(result.error.message);

    const user = result.data.user;
    localStorage.setItem('wh_currentUser', JSON.stringify({
      email: user.email,
      name: isLoginMode ?
        user.user_metadata?.name || user.email :
        `${document.getElementById('authFirstName').value} ${document.getElementById('authLastName').value}`,
      id: user.id
    }));

    closeAuthModal();
    authForm.reset();

    // Redirect or trigger callback
    if (window.onAuthSuccess) window.onAuthSuccess();
    else window.location.href = 'community.html';

  } catch (err) {
    showError(err.message);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = isLoginMode ? 'Sign In' : 'Sign Up';
  }
});

function showError(msg) {
  errorMsg.textContent = msg;
  errorMsg.classList.add('show');
}
