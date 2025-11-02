// ====================================================
// 1. Menu Mobile Toggle
// ====================================================
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const header = document.getElementById('header');

    // Função para alternar a visibilidade do menu
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Fechar o menu ao clicar em um link (apenas em mobile)
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
            }
        });
    });

    // ====================================================
    // 2. Rolagem Suave (Smooth Scrolling)
    // ====================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Verifica se o link é para uma seção interna
            if (this.getAttribute('href').length > 1) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    // Calcula a posição de rolagem, subtraindo a altura do cabeçalho fixo
                    const headerHeight = header.offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // ====================================================
    // 3. Carrossel de Portfólio
    // ====================================================
    const carousel = document.querySelector('.portfolio-carousel');
    const items = carousel ? carousel.querySelectorAll('.carousel-item') : [];
    const prevButton = carousel ? carousel.querySelector('.prev') : null;
    const nextButton = carousel ? carousel.querySelector('.next') : null;
    let currentIndex = 0;

    if (items.length > 0) {
        // Função para mostrar o item atual
        function showItem(index) {
            // Remove a classe 'active' de todos os itens
            items.forEach(item => item.classList.remove('active'));

            // Adiciona a classe 'active' ao item desejado
            items[index].classList.add('active');
        }

        // Inicializa o carrossel
        showItem(currentIndex);

        // Evento para o botão Anterior
        if (prevButton) {
            prevButton.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + items.length) % items.length;
                showItem(currentIndex);
            });
        }

        // Evento para o botão Próximo
        if (nextButton) {
            nextButton.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % items.length;
                showItem(currentIndex);
            });
        }
    }
});

// ====================================================
// 4. Animação Simples (Opcional: Header Sticky/Shadow on Scroll)
// ====================================================
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (window.scrollY > 50) {
        header.style.backgroundColor = 'rgba(255, 255, 255, 1)'; // Fundo sólido após rolagem
        header.style.boxShadow = '0 2px 15px rgba(0, 0, 0, 0.15)';
    } else {
        header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)'; // Fundo semi-transparente no topo
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
});

// Torna os itens clicáveis
document.querySelectorAll('.carousel-item').forEach(item => {
  item.addEventListener('click', () => {
    const link = item.getAttribute('data-link');
    if (link) window.open(link, '_blank');
  });
});

