
module.exports = {
  emailTemplate: data => {
    return `<html>
    <head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#FFFFFF" />
    <link href="https://fonts.googleapis.com/css?family=Sen:400,700&display=swap&subset=latin-ext" rel="stylesheet">
    <style>
    body{
      color: #47484c;
      background-color: #F5F5F5;
      font-family: 'Sen', sans-serif;
      word-wrap: break-word;
    }
    .main{
        width: 90%;
        max-width: 600px;
        margin: 100px auto;
        background-color: #FFFFFF;
        text-align: center;
        padding: 50px;
        border-radius: 30px;
        box-sizing: border-box;
    }
      .title{
        font-size: 20px;
        margin-bottom: 40px;
      }
      .code{
        margin: 50px 0;
        font-size: 35px;
        width: 100%;
        text-align: center;
      }
      .or{
        font-size: 12px;
        margin-bottom: 40px;
      }
      .footer{
        width: 100%;
        text-align: center;
        font-size: 10px;
      }
      a{
        font-size: 12px;
        color: #47484c;
        text-decoration: underline;
      }
      button{
        background-color: #47484c;
        color: #FFFFFF;
        padding: 20px 40px;
        margin: 50px 0;
        font-size: 16px;
        letter-spacing: 1px;
        outline: none;
        text-transform: uppercase;
        border-radius: 15px;
        border: none;
      }
    </style
    </head>
    <body>
    <div class='main'>
    ${data}
    </div>
      <div class='footer'>If you didn’t provide your email address to QR Spots, please ignore this email. Thanks!</div>
    </body>
    </html>`
  },

  activateTemplate: data => {
    return module.exports.emailTemplate(
      `<div class='title'>Hi ${data.name},</div>
        <p>Click the button below within the <strong>24h</strong> to activate your account.</p>
        <div>
        <a href='http://localhost:3000/activate/${data.id}'>
        <button>Activate</button>
        </a>
        </div>
        <div class='or'>Or click the link below</div>
        <div>
        <a href='http://localhost:3000/activate/${data.id}'>
        http://localhost:3000/activate/${data.id}
        </a>
        </div>`
    )
  },

  forgotTemplate: data => {
    return module.exports.emailTemplate(
      `<div class='title'>Hi ${data.name},</div>
        <p>Click the button below within the <strong>24h</strong> to reset your password.</p>
        <div>
        <a href='http://localhost:3000/reset/${data.id}'>
        <button>Reset password</button>
        </a>
        </div>
        <div class='or'>Or click the link below</div>
        <div>
        <a href='http://localhost:3000/reset/${data.id}'>
        http://localhost:3000/reset/${data.id}
        </a>
        </div>`
    )
  },

  emailChangeTemplate: data => {
    return module.exports.emailTemplate(
      `<div class='title'>Hi ${data.name},</div>
        <p>Use the code below within <strong>10 minutes</strong> to change the email.</p>
        <div class='code'>${data.code}</div>`
    )
  }
}