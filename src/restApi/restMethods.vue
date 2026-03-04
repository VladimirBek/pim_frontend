<script>
import axios from 'axios'
const tokenString = localStorage.getItem('token') || sessionStorage.getItem('token')
let url = ''
if (import.meta.url.startsWith('http://backoffice.integraaal.com')) {
  url = 'http://api.backoffice.integraaal.com/api/v1/'
} else if (import.meta.url.startsWith('http://test.backoffice.integraaal.com')) {
  url = 'http://api.test.backoffice.integraaal.com/api/v1/'
} else  {
  url = 'http://api.sandbox.backoffice.integraaal.com/api/v1/'
}
let token = ''

try {
  token = tokenString;
} catch (error) {
  token = '';
  localStorage.removeItem('token');
  sessionStorage.removeItem('token');
}
const createAuthInterceptor = (instance) => {
  instance.interceptors.response.use(
    response => response,
    error => {
      // Безопасная проверка на статус 401
      if (error && error.response && error.response.status === 401) {
        logoutFun();
      }
      return Promise.reject(error);
    }
  );
  return instance;
};

const restApi = createAuthInterceptor(axios.create({
  baseURL: url,
  timeout: 10000,
  headers: {
    'x-token': token && token !== 'false' ? token : 'false',
    'Content-Type': 'application/json',
    "Access-Control-Allow-Origin": "*"
  }
}));

const formApi = createAuthInterceptor(axios.create({
  baseURL: url,
  timeout: 10000,
  headers: {
    'x-token': token,
    "Content-Type": "multipart/form-data",
    "Access-Control-Allow-Origin": "*"
  }
}));

const supportApi = createAuthInterceptor(axios.create({
  baseURL: import.meta.url.startsWith('http://test.backoffice.integraaal.com') ? 'http://dashboard.test.backoffice.integraaal.com/api/v1/' : 'http://dashboard.backoffice.integraaal.com/api/v1/',
  timeout: 10000,
  headers: {
    'x-token': '111',
    'Content-Type': 'application/json',
    "Access-Control-Allow-Origin": "*"
  }
}));

const logoutFun = () => {
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('username');
  sessionStorage.removeItem('roles');
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  localStorage.removeItem('roles');

  // Используйте try-catch для Notify, на случай если он не определен
  try {
    Notify.error(`Просрочились учётные данные и токен авторизации. Необходимо снова авторизироваться.`);
  } catch (e) {
    console.error('Ошибка уведомления:', e);
  }

  window.location.href = "/login";
}

const logoutSite = () => {
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('username');
  sessionStorage.removeItem('roles');
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  localStorage.removeItem('roles');
  Notify.warning(`Вы вышли`)
  window.location.href = "/login";
}

const saveData = async (name) => {
  try {
    await restApi.post(name)
  } catch (error) {
    logoutFun()
  }
}

export { restApi, supportApi, formApi, logoutSite }

</script>
