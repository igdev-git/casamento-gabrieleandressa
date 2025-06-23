// Registra o plugin ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Animação da galeria
gsap.from(".swiper-slide", {
    scrollTrigger: {
        trigger: ".mySwiper",
        start: "top center",
        end: "bottom center",
        toggleActions: "play none none reverse"
    },
    y: 100,
    opacity: 0,
    duration: 1,
    stagger: 0.2,
    ease: "power2.out"
});

// Animação do título da galeria
gsap.from(".mySwiper + h2", {
    scrollTrigger: {
        trigger: ".mySwiper",
        start: "top center",
        end: "bottom center",
        toggleActions: "play none none reverse"
    },
    y: 50,
    opacity: 0,
    duration: 1,
    ease: "power2.out"
});

// Animação de entrada para todas as seções
gsap.utils.toArray('section').forEach(section => {
    gsap.from(section, {
        scrollTrigger: {
            trigger: section,
            start: "top 80%",
            toggleActions: "play none none reverse"
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power2.out"
    });
});

// Animação do formulário – efeito popping
gsap.from("#rsvpForm", {
    scrollTrigger: {
        trigger: "#rsvpForm",
        start: "top 80%",
        toggleActions: "play none none reverse"
    },
    scale: 0.5,
    opacity: 0,
    duration: 1.2,
    ease: "elastic.out(1, 0.4)"
});

// Animação do footer
gsap.from("footer", {
    scrollTrigger: {
        trigger: "footer",
        start: "top 90%",
        toggleActions: "play none none reverse"
    },
    y: 50,
    opacity: 0,
    duration: 1,
    ease: "power2.out"
});

var swiper = new Swiper(".mySwiper", {
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: "auto",
    coverflowEffect: {
        rotate: 50,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: true,
    },
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
});

// Data do casamento
const weddingDate = new Date('2025-07-19T00:00:00');

function updateCountdown() {
    const now = new Date();
    const difference = weddingDate - now;

    // Cálculos
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    // Atualiza os elementos
    document.getElementById('dias').textContent = String(days).padStart(2, '0');
    document.getElementById('horas').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutos').textContent = String(minutes).padStart(2, '0');
    document.getElementById('segundos').textContent = String(seconds).padStart(2, '0');
}

// Atualiza a cada segundo
updateCountdown();
setInterval(updateCountdown, 1000);

// Animação do título letra por letra (executa após carregar tudo)
document.addEventListener('DOMContentLoaded', () => {
    const titleEl = document.querySelector('.letter-animation');
    if (!titleEl) return;

    const content = titleEl.textContent.trim();
    titleEl.textContent = '';

    content.split('').forEach((char, i) => {
        const span = document.createElement('span');
        span.textContent = char;
        span.style.opacity = '0';
        span.style.display = 'inline-block';
        span.style.transform = 'translateY(20px)';
        titleEl.appendChild(span);

        gsap.to(span, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out',
            delay: i * 0.05
        });
    });
    // revela o container após criar spans
    titleEl.style.opacity = 1;
});

// ==================================
// Mensagens dos convidados
// ==================================
function exibirMensagens() {
    fetch('https://script.google.com/macros/s/AKfycby_qVeDE2dWduu_ts3qFYMw7D2cfRFDc5YEUBiOdbTcavzaw8la09K59JJEIdVdhVo8/exec?action=getMessages')
        .then(res => res.json())
        .then(mensagens => {
            if (!Array.isArray(mensagens) || mensagens.length === 0) return;
            const alvo = document.getElementById('mensagem-rotativa');
            let indice = 0;
            const trocarMensagem = () => {
                gsap.to(alvo, {opacity: 0, duration: 0.4, onComplete: () => {
                    alvo.textContent = mensagens[indice];
                    gsap.to(alvo, {opacity: 1, duration: 0.4});
                    indice = (indice + 1) % mensagens.length;
                }});
            };
            // Primeira mensagem
            alvo.textContent = mensagens[0];
            indice = 1;
            setInterval(trocarMensagem, 5000); // troca a cada 5s
        })
        .catch(err => {
            console.error(err);
            document.getElementById('mensagem-rotativa').textContent = 'Não foi possível carregar as mensagens.';
        });
}
exibirMensagens();

document.getElementById('rsvpForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const data = {
        nome: formData.get('nome'),
        acompanhantes: formData.get('acompanhantes'),
        presenca: formData.get('presenca'),
        mensagem: formData.get('mensagem') || ''
    };

    // Mostra mensagem de carregamento
    const submitButton = this.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Enviando...';
    submitButton.disabled = true;

    // Envia os dados usando fetch
    fetch('https://script.google.com/macros/s/AKfycbxo1Sie1ozpN4cV_AEax0jZf2GDjIEm7FKSDHWX_O4ILwqmHPv6xtJetNRmNhAV_TZ_/exec', {
        method: 'POST',
        body: new URLSearchParams(data),
        redirect: 'follow'
    })
    .then(response => response.text())
    .then(result => {
        // Mostra mensagem de sucesso na própria página
        const successMessage = document.createElement('div');
        successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg title-custom';
        successMessage.textContent = 'Presença confirmada com sucesso!';
        document.body.appendChild(successMessage);
        
        // Remove a mensagem após 3 segundos
        setTimeout(() => {
            successMessage.remove();
        }, 3000);

        // Limpa o formulário
        this.reset();
    })
    .catch(error => {
        // Mostra mensagem de erro na própria página
        const errorMessage = document.createElement('div');
        errorMessage.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg title-custom';
        errorMessage.textContent = 'Erro ao enviar formulário. Por favor, tente novamente.';
        document.body.appendChild(errorMessage);
        
        // Remove a mensagem após 3 segundos
        setTimeout(() => {
            errorMessage.remove();
        }, 3000);
    })
    .finally(() => {
        // Restaura o botão
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    });
});