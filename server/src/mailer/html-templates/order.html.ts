export const generateOrderEmail = (
  name: string,
  products: { titleRu: string; jars: number; price: number }[],
): string => {
  // Вычисляем общую сумму заказа
  const totalPrice = products.reduce(
    (sum, product) => sum + product.price * product.jars,
    0,
  );

  // Формируем список товаров в HTML-таблице
  const productRows = products
    .map(
      (product) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #DEDEDE;">${product.titleRu}</td>
        <td style="padding: 10px; border-bottom: 1px solid #DEDEDE; text-align: center;">${product.jars}</td>
        <td style="padding: 10px; border-bottom: 1px solid #DEDEDE; text-align: right;">${product.price.toFixed(2)} ₽</td>
      </tr>
    `,
    )
    .join('');

  // HTML-шаблон письма
  return `
  <!DOCTYPE html>
  <html lang="ru">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ваш заказ в Вкус Мёда</title>
  </head>
  <body style="font-family: Arial, sans-serif; background-color: #FFFFFF; color: #333; margin: 0; padding: 0;">
    <table style="max-width: 600px; margin: 20px auto; background-color: #FFFFFF; border-radius: 8px; box-shadow: 0px 0px 10px #DEDEDE; padding: 20px;">
      <tr>
        <td style="text-align: center; padding-bottom: 20px;">
          <h1 style="color: #FFB813; font-size: 24px;">Вкус Мёда</h1>
          <p style="color: #666; font-size: 16px;">Здравствуйте, <b>${name}</b>!</p>
          <p style="color: #666; font-size: 14px;">

Уважаемый покупатель,

Настоящее уведомление носит исключительно информационный характер. Ваш заказ был оформлен в рамках учебного проекта и не является реальной сделкой. Данный заказ не подлежит обработке, оплате или доставке.

Если у Вас возникли вопросы, пожалуйста, свяжитесь со мной.

С уважением,
Никита Дегтярев (@tg: nikkk_deg)</p>
        </td>
      </tr>
      <tr>
        <td>
          <h2 style="color: #333; font-size: 18px; border-bottom: 2px solid #FFB813; padding-bottom: 10px;">Детали заказа</h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
            <thead>
              <tr style="background-color: #FFB813; color: #FFFFFF;">
                <th style="padding: 10px; text-align: left;">Товар</th>
                <th style="padding: 10px; text-align: center;">Кол-во</th>
                <th style="padding: 10px; text-align: right;">Цена</th>
              </tr>
            </thead>
            <tbody>
              ${productRows}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">Итого:</td>
                <td style="padding: 10px; text-align: right; font-weight: bold;">${totalPrice.toFixed(2)} ₽</td>
              </tr>
            </tfoot>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding-top: 20px; text-align: center;">
          <p style="color: #666; font-size: 14px;">Спасибо, что интересуетесь нашей продукцией!</p>
          <p style="color: #666; font-size: 12px;">С уважением, команда <b>Вкус Мёда</b></p>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
};
