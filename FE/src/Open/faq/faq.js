function sendEmail() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    if (!name || !email || !message) {
        alert('すべてのフィールドを入力してください。');
        return;
    }

    const subject = 'お問い合わせ';
    const body = `名前: ${name}%0Aメールアドレス: ${email}%0A%0A内容:%0A${message.replace(/\n/g, '%0A')}`;

    const mailtoLink = `mailto:bondringage.info@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoLink;
}