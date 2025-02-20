export const loginEmailTemplate = (link: string) => {
  return `
<!doctype html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Вход в аккаунт</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #FFFFFF;
    }
    .email-container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #FFFFFF;
      border: 1px solid #DEDEDE;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .email-header {
      color: black;
      background-color: #FFB813;
      text-align: center;
      padding: 20px;
      font-size: 24px;
      font-weight: bold;
    }
    .email-body {
      padding: 20px;
      font-size: 16px;
      color: #333333;
      line-height: 1.6;
    }
    .email-footer {
      text-align: center;
      padding: 10px;
      font-size: 14px;
      color: #777777;
      background-color: #DEDEDE;
    }
    .btn {
      cursor: pointer;
      display: inline-block;
      padding: 12px 20px;
      color: #FFFFFF !important;
      background-color: #FFB813;
      border-radius: 4px;
      text-decoration: none;
      font-size: 16px;
      font-weight: bold;
      margin: 10px 0;
    }
    .btn:hover {
      text-decoration: none;
      color: #FFFFFF !important;
      background-color: #E6A400;
    }
    .note {
      font-size: 14px;
      color: #555555;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      Вход в аккаунт Вкус Мёда
    </div>
    <div class="email-body">
      <p>Здравствуйте!</p>
      <p>Вы запросили вход в аккаунт в сервисе <strong>Вкус Мёда</strong>. Для авторизации нажмите на кнопку ниже:</p>
      <p style="text-align: center;">
        <a href="${link}" class="btn">Войти в аккаунт</a>
      </p>
      <p class="note">Ссылка действительна в течение ограниченного времени. Если вы не запрашивали вход, просто проигнорируйте это письмо.</p>
    </div>
    <div class="email-footer">
      &copy; 2025 Вкус Мёда. Все права защищены.
    </div>
  </div>
</body>
</html>
`;
};
