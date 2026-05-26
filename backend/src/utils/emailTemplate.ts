export const getEmailWrapper = (title: string, bodyContent: string) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>${title}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6f9; margin: 0; padding: 0; color: #333333; }
          .container { max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05); border: 1px solid #e1e8ed; }
          .header { background-color: #e11d48; padding: 30px 20px; text-align: center; }
          .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 0.5px; }
          .content { padding: 30px 25px; line-height: 1.6; }
          .content h2 { margin-top: 0; color: #1e293b; font-size: 20px; }
          .btn { display: inline-block; background-color: #e11d48; color: #ffffff !important; padding: 12px 28px; margin: 20px 0; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px; text-align: center; }
          .footer { background-color: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header"><h1>PropRent</h1></div>
          <div class="content">${bodyContent}</div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} PropRent. Hak Cipta Dilindungi.</p>
            <p>Email ini dikirim secara otomatis oleh sistem. Mohon tidak membalas email ini.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};
