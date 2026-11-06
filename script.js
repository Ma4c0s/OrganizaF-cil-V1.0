function enviarMensagem() {
    fetch("https://api.callmebot.com/whatsapp.php?phone=554196178833&text=Olá,++gostaria+de+mais+informações!&apikey=6165139")

    .then(response => {
        alert("Mensagem enviada com sucesso!")
    })
}