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

// ==============================
// Formulário de Contato (AJAX)
// ==============================
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  const statusBox = document.getElementById('formStatus');
  const submitBtn = document.getElementById('contactSubmit');

  const setStatus = (msg, type = 'info') => {
    if (!statusBox) return;
    statusBox.textContent = msg;
    statusBox.classList.remove('success', 'error', 'info');
    statusBox.classList.add(type);
  };

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = contactForm.querySelector('#name')?.value.trim();
    const email = contactForm.querySelector('#email')?.value.trim();
    const message = contactForm.querySelector('#message')?.value.trim();

    if (!name || !email || !message) {
      setStatus('Preencha todos os campos obrigatórios.', 'error');
      return;
    }

    const originalText = submitBtn ? submitBtn.textContent : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando...';
    }
    setStatus('Enviando sua mensagem...', 'info');

    try {
      const response = await fetch('https://formsubmit.co/ajax/igorcs1104@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          message,
          _subject: "Novo contato pelo site - Igor's Dev",
          _template: 'table',
          _captcha: false
        })
      });

      if (!response.ok) throw new Error('Falha ao enviar');
      const data = await response.json();

      if (data && data.success) {
        setStatus('Mensagem enviada com sucesso! Em breve entraremos em contato.', 'success');
        contactForm.reset();
      } else {
        throw new Error('Erro no envio');
      }
    } catch (err) {
      setStatus('Não foi possível enviar agora. Tente novamente mais tarde ou envie e-mail para igorcs1104@gmail.com.', 'error');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText || 'Enviar Mensagem';
      }
    }
  });
}
