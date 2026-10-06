import nodemailer from 'nodemailer';

export async function sendVerificationEmail(to: string, token: string, baseUrl: string) {
  // Configuração padrão. Se você tiver um SMTP real, pode usar process.env.SMTP_HOST, etc.
  // Como fallback para desenvolvimento, usaremos o Ethereal Mail (nodemailer dummy SMTP)
  
  let transporter;
  
  if (process.env.SMTP_HOST) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    // Modo de Desenvolvimento Automático (Ethereal)
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, 
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }

  const verificationUrl = `${baseUrl}/api/auth/verify?token=${token}`;

  const info = await transporter.sendMail({
    from: '"Segurança Iuaix" <security@iuaix.com>',
    to: to,
    subject: "Ação Necessária: Autenticação de Cadastro Iuaix",
    text: `Bem-vindo à Iuaix!\n\nPor favor, confirme seu endereço de e-mail clicando no link abaixo:\n${verificationUrl}\n\nCaso não tenha sido você, ignore este e-mail.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; background-color: #111; color: #fff; padding: 40px; text-align: center;">
        <h1 style="color: #FACC15; text-transform: uppercase;">Acesso Bloqueado</h1>
        <p style="font-size: 16px; margin-bottom: 30px;">Para efetivar seu cadastro na plataforma Iuaix DaaS, você precisa autenticar este endereço de e-mail.</p>
        <a href="${verificationUrl}" style="background-color: #2563EB; color: #fff; padding: 15px 30px; text-decoration: none; font-weight: bold; text-transform: uppercase; border: 2px solid #fff; display: inline-block;">
          Verificar E-mail Agora
        </a>
        <p style="margin-top: 30px; font-size: 12px; color: #666;">Caso o botão não funcione, copie e cole este link no navegador:<br/>${verificationUrl}</p>
      </div>
    `,
  });

  if (!process.env.SMTP_HOST) {
    console.log("=========================================");
    console.log("📧 E-MAIL DE VERIFICAÇÃO ENVIADO (MODO DEV)");
    console.log("URL de Visualização:", nodemailer.getTestMessageUrl(info));
    console.log("URL de Ativação Direta:", verificationUrl);
    console.log("=========================================");
  }
}
