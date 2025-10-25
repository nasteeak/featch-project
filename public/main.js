// Глобальные переменные
let posts = [];
let users = [];
let comments = [];
let currentAuthorFilter = null;

// Элементы DOM
const authorList = document.getElementById('author-list');
const postsContainer = document.getElementById('posts-container');
const modal = document.getElementById('modal');
const closeModal = document.querySelector('.close');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');
const commentsList = document.getElementById('comments-list');

// Функция для получения данных с сервера
async function fetchData() {
  try {
    // Загружаем все данные параллельно (быстрее и надёжнее)
    const [postsRes, usersRes, commentsRes] = await Promise.all([
      fetch('http://localhost:3000/posts'),
      fetch('http://localhost:3000/users'),
      fetch('http://localhost:3000/comments')
    ]);

    if (!postsRes.ok || !usersRes.ok || !commentsRes.ok) {
      throw new Error('Один из запросов вернул ошибку');
    }

    posts = await postsRes.json();
    users = await usersRes.json();
    comments = await commentsRes.json();

    // Заполнить список авторов
    populateAuthors();

    // Показать все посты по умолчанию
    renderPosts();
  } catch (error) {
    console.error('Ошибка загрузки данных:', error);
    alert('Не удалось загрузить данные. Убедитесь, что json-server запущен на порту 3000.');
  }
}

// Заполнение списка авторов
function populateAuthors() {
  // 🔥 КРИТИЧЕСКИ ВАЖНО: очистить список перед заполнением
  authorList.innerHTML = '';

  // Добавляем "Все"
  const allItem = document.createElement('li');
  allItem.textContent = 'Все';
  allItem.addEventListener('click', () => filterByAuthor(null));
  authorList.appendChild(allItem);

  // Добавляем уникальных авторов (только фамилии!)
  const uniqueLastNames = new Set();
  posts.forEach(post => {
    const user = users.find(u => u.id === post.userId);
    if (user && user.name) {
      // Извлекаем фамилию (последнее слово в имени)
      const lastName = user.name.trim().split(' ').pop();
      uniqueLastNames.add(lastName);
    }
  });

  uniqueLastNames.forEach(lastName => {
    const li = document.createElement('li');
    li.textContent = lastName;
    li.addEventListener('click', () => filterByAuthor(lastName));
    authorList.appendChild(li);
  });
}

// Фильтрация постов по фамилии автора
function filterByAuthor(lastName) {
  currentAuthorFilter = lastName;
  renderPosts();

  // Обновляем активный элемент в списке
  Array.from(authorList.children).forEach(li => {
    const isActive = (lastName === null && li.textContent === 'Все') ||
                     (lastName && li.textContent === lastName);
    li.classList.toggle('active', isActive);
  });
}

// Отображение постов
function renderPosts() {
  postsContainer.innerHTML = '';

  const filteredPosts = currentAuthorFilter
    ? posts.filter(post => {
        const user = users.find(u => u.id === post.userId);
        return user && user.name.trim().split(' ').pop() === currentAuthorFilter;
      })
    : posts;

  filteredPosts.forEach(post => {
    const postEl = document.createElement('div');
    postEl.className = 'post';

    const user = users.find(u => u.id === post.userId);
    const lastName = user ? user.name.trim().split(' ').pop() : 'Неизвестно';

    postEl.innerHTML = `
      <p><strong>Автор:</strong> ${lastName}</p>
      <p>${post.body.substring(0, 100)}${post.body.length > 100 ? '...' : ''}</p>
      <button class="read-more" data-id="${post.id}">Read More</button>
    `;

    postsContainer.appendChild(postEl);
  });

  // 🔥 ВАЖНО: перепривязываем обработчики после обновления DOM
  document.querySelectorAll('.read-more').forEach(button => {
    button.addEventListener('click', (e) => {
      const postId = parseInt(e.target.dataset.id, 10);
      showPostModal(postId); // async не нужен, т.к. данные уже загружены
    });
  });
}

// Показать модальное окно с постом и комментариями
function showPostModal(postId) {
  const post = posts.find(p => p.id === postId);
  if (!post) return;

  const user = users.find(u => u.id === post.userId);
  const postComments = comments.filter(c => c.postId === postId);

  modalTitle.textContent = post.title;
  modalBody.textContent = post.body;

  commentsList.innerHTML = '';
  postComments.forEach(comment => {
    const commentEl = document.createElement('li');
    commentEl.className = 'comment';
    commentEl.innerHTML = `
      <p><strong>${comment.name}</strong> (${comment.email})</p>
      <p>${comment.body}</p>
    `;
    commentsList.appendChild(commentEl);
  });

  modal.style.display = 'block';
}

// Закрытие модального окна
if (closeModal) {
  closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
  });
}

window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
  // Проверяем, что все элементы существуют
  if (!authorList || !postsContainer || !modal) {
    console.error('Не найдены необходимые элементы в HTML!');
    return;
  }
  fetchData();
});