// ====================================================
// 1. Menu Mobile Toggle
// ====================================================
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const header = document.getElementById('header');

    // Acessibilidade: atrela ARIA e overlay
    if (menuToggle) {
        menuToggle.setAttribute('aria-controls', 'nav-menu');
        menuToggle.setAttribute('aria-expanded', 'false');
    }

    let overlay = document.getElementById('nav-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'nav-overlay';
        overlay.setAttribute('aria-hidden', 'true');
        document.body.appendChild(overlay);
    }

    const icon = menuToggle ? menuToggle.querySelector('i') : null;

    const setMenuState = (open) => {
        if (!menuToggle || !navMenu) return;
        navMenu.classList.toggle('active', open);
        document.body.classList.toggle('menu-open', open);
        menuToggle.classList.toggle('open', open);
        menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        menuToggle.setAttribute('aria-label', open ? 'Fechar Menu' : 'Abrir Menu');
        if (overlay) overlay.classList.toggle('active', open);

        // Troca do ícone (compatível com FA5/FA6)
        if (icon) {
            if (open) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
                icon.classList.remove('fa-xmark');
            }
        }
    };

    // Toggle do menu
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            setMenuState(!navMenu.classList.contains('active'));
        });
    }

    // Fechar ao clicar em um link
    if (navMenu) {
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => setMenuState(false));
        });
    }

    // Fechar ao clicar fora (overlay)
    if (overlay) {
        overlay.addEventListener('click', () => setMenuState(false));
    }

    // Fechar com ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') setMenuState(false);
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
      const response = await fetch('https://formsubmit.co/ajax/igorsdev67@gmail.com', {
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
      setStatus('Não foi possível enviar agora. Tente novamente mais tarde ou envie e-mail para igorsdev67@gmail.com.', 'error');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText || 'Enviar Mensagem';
      }
    }
  });
}
